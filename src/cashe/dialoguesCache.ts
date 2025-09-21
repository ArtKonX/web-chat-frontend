import { DialogueData } from "@/interfaces/components/layout";
import initDB from "./db/initDB";

const DB_NAME = 'DialoguesCache';
const STORE_NAME = 'dialogues';

const convertToCached = (dialogue: DialogueData): DialogueData => {
    return {
        id: dialogue.userId,
        ...dialogue
    };
};

export const cacheDialogue = async (dialogue: DialogueData): Promise<void> => {
    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const cachedDialogue = convertToCached(dialogue);

    try {
        store.put(cachedDialogue);
        transaction.commit();
    } catch (error) {
        console.error('Ошибка при сохранении диалога:', error);
    }
};

export const cacheDialogues = async (dialogues: DialogueData[]): Promise<void> => {
    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    try {
        // Конвертируем и сохраняем все диалоги
        await Promise.all(dialogues.map(async dialogue => {
            const cachedDialogue = convertToCached(dialogue);

            store.put(cachedDialogue);
        }));

        transaction.commit();
    } catch (error) {
        console.error('Ошибка при сохранении диалогов:', error);
    }
};

export const getCachedDialogues = async (): Promise<DialogueData[]> => {
    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise<DialogueData[]>((resolve, reject) => {

        const request = store.getAll();

        request.onsuccess = () => {
            const dialogues = request.result || [];
            resolve(dialogues);
        };

        request.onerror = () => reject(request.error);
    });
};

export const clearCachedDialogues = async (): Promise<void> => {
    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const dialogues = request.result || [];
            dialogues.forEach(dialogue => store.delete(dialogue.id));
            resolve(true);
        };

        request.onerror = () => reject(request.error);
    });
};