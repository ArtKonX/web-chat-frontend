import { UserData } from "@/interfaces/users";
import initDB from "./db/initDB";

const DB_NAME = 'UserCache';
const STORE_NAME = 'user';

const convertToCached = (user: UserData): UserData => {
    return {
        ...user,
        city: user.city
    };
};

export const cacheUser = async (user: UserData): Promise<void> => {
    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const cachedUser = convertToCached(user);

    await new Promise((resolve, reject) => {
        const request = store.put(cachedUser);
        request.onsuccess = resolve;
        request.onerror = () => reject(request.error);
    });

    transaction.commit();
};

export const getCachedUser = async (): Promise<UserData[]> => {
    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise<UserData[]>((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const user = request.result || [];
            resolve(user);
        };

        request.onerror = () => reject(request.error);
    });
};

export const clearCachedUser = async (): Promise<void> => {

    const db = await initDB(DB_NAME, STORE_NAME);
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
            const users = request.result || [];
            users.forEach(user => store.delete(user.id));
            resolve(true);
        };

        request.onerror = () => reject(request.error);
    });
};