import { MessageInfo } from "@/interfaces/message";
import initDB from "./db/initDB";

const DB_NAME = 'MessagesCache';
const STORE_NAME = 'messages';
const MAX_MESSAGES_PER_USER = 100;

const convertToCached = (message: MessageInfo, userId: string): MessageInfo => {
    return {
        userId,
        id: message.id || message.idMessage || Date.now().toString(),
        ...message
    };
};

// обновление сообщения и кеширование
export const cacheUpdateMessage = async (
    message: string,
    messageId: string
) => {
    try {
        // Инициализация базы данных
        const db = await initDB(DB_NAME, STORE_NAME);
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // Получение всех сообщений пользователя
        const userMessages = await new Promise<MessageInfo[]>(resolve => {
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result || []);
        });

        // Поиск индекса обновляемого сообщения
        const messageFined = userMessages.find(msg => msg.id === messageId);

        // Преобразование сообщения в формат для кэширования
        const cachedMessage = {
            ...messageFined,
            message,
            updatedAt: new Date().toISOString()
        };

        // Если сообщение найдено, удаляем его
        if (messageFined) {
            await new Promise((resolve, reject) => {
                const request = store.delete(messageId);
                request.onsuccess = resolve;
                request.onerror = () => reject(request.error);
            });
        }

        // Сортировка сообщений по дате
        const sortedMessages = userMessages
            .filter(msg => msg.id !== messageId) // Исключаем обновляемое сообщение
            .sort((a, b) => {
                return new Date(String(a.created_at)).getTime() - new Date(String(b.created_at)).getTime();
            });

        // Удаление старых сообщений, если превышен лимит
        const messagesToDelete = sortedMessages.slice(0, sortedMessages.length - MAX_MESSAGES_PER_USER + 1);

        for (const msg of messagesToDelete) {
            await new Promise((resolve, reject) => {
                const request = store.delete(String(msg.id));
                request.onsuccess = resolve;
                request.onerror = () => reject(request.error);
            });
        }

        // Сохранение обновленного сообщения
        await new Promise((resolve, reject) => {
            const request = store.put(cachedMessage);
            request.onsuccess = resolve;
            request.onerror = () => reject(request.error);
        });

        transaction.commit();
    } catch (error) {
        console.error('Ошибка при обновлении сообщения:', error);
        throw error;
    }
};

// Кеширование сообщения
export const cacheMessage = async (messageInfo: MessageInfo, userId: string) => {

    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const cachedMessage = convertToCached(messageInfo, userId);

    // Очистка старых сообщений для пользователя
    const userMessages = await new Promise<MessageInfo[]>(resolve => {
        const index = store.index('userId');
        const request = index.getAll(userId);
        request.onsuccess = () => resolve(request.result || []);
    });

    userMessages
        .sort((a, b) => new Date(String(a.created_at)).getMilliseconds() - new Date(String(b.created_at)).getMilliseconds())
        .slice(0, userMessages.length - MAX_MESSAGES_PER_USER + 1)
        .forEach(msg => store.delete(String(msg.id)));

    await new Promise((resolve, reject) => {
        const request = store.put(cachedMessage);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
    });

    transaction.commit();
};

export const cacheMessages = async (messages: MessageInfo[], userId: string) => {
    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Конвертируем все сообщения и сохраняем
    const cachedMessages = messages.map(msg => convertToCached(msg, userId));

    // Очищаем старые сообщения
    const userMessages = await new Promise<MessageInfo[]>(resolve => {
        const index = store.index('userId');
        const request = index.getAll(userId);
        request.onsuccess = () => resolve(request.result || []);
    });

    // Если привышен лимит сообщений, то удаляем их
    if (userMessages.length + cachedMessages.length > MAX_MESSAGES_PER_USER) {
        const totalMessages = [...userMessages, ...cachedMessages]
            .sort((a, b) => new Date(String(a.created_at)).getTime() - new Date(String(b.created_at)).getTime())
            .slice(-MAX_MESSAGES_PER_USER);

        // Удаляем все существующие сообщения для пользователя
        userMessages.forEach(msg => store.delete(String(msg.id)));

        // Сохраняем только актуальные
        totalMessages.forEach(msg => store.put(msg));
    } else {
        // Просто добавляем новые сообщения
        cachedMessages.forEach(msg => store.put(msg));
    }

    transaction.commit();
};

// Получение сообщений из кеша
export const getCachedMessages = async (userId: string): Promise<MessageInfo[]> => {

    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise<MessageInfo[]>((resolve, reject) => {
        const index = store.index('userId');
        const request = index.getAll(userId);

        request.onsuccess = () => {
            const messages = request.result || [];
            resolve(messages.sort((a, b) => a.timestamp - b.timestamp));
        };

        request.onerror = () => reject(request.error);
    });
};

export const cacheDeleteMessage = async (
    messageId: string
) => {
    try {

        const db = await initDB(DB_NAME, STORE_NAME);
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        await new Promise((resolve, reject) => {
            const request = store.delete(messageId);
            request.onsuccess = resolve;
            request.onerror = () => reject(request.error);
        });

        transaction.commit();
    } catch (error) {
        console.error('Ошибка при удаления сообщения:', error);
        throw error;
    }
};

// Удаление сообщений из кеша
export const clearCachedMessages = async () => {

    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const messages = request.result || [];
            messages.forEach(msg => store.delete(msg.id));
            resolve(true);
        };

        request.onerror = () => reject(request.error);
    });
};