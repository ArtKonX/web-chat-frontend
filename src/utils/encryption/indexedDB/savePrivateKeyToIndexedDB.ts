import { openDB } from 'idb';

export async function savePrivateKeyToIndexedDB(encryptedKeyData: CryptoKey, userId: string) {
    try {
        const db = await openDB('keyStore', 2, {
            upgrade(db) {

                // Проверяем существование keys и создаем если нужно
                if (!db.objectStoreNames.contains('keys')) {

                    db.createObjectStore('keys', { keyPath: 'id' });
                }
            }
        });

        // Проверяем существование keys перед использованием
        if (db.objectStoreNames.contains('keys')) {
            // создаем транзакцию с записью
            // получаем доступ к keys
            // сохраняем приватный ключ
            await db.transaction('keys', 'readwrite')
                .objectStore('keys')
                .put({ id: userId, data: encryptedKeyData, date: new Date() });
        } else {
            throw new Error('Хранилище keys не сущаствует');
        }
    } catch (error) {
        console.error('Ошибка сохранения в IndexedDB:', error);
        throw error;
    }
}