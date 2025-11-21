import { PrivatKey } from '@/interfaces/encryption';
import { openDB } from 'idb';

export async function getPrivateKeyFromIndexedDB(id: string): Promise<PrivatKey | null> {
    try {
        // Открываем базу данных
        const db = await openDB('keyStore');

        // Проверяем существование keys
        if (db.objectStoreNames.contains('keys')) {

            // транзакция для работы с хранилищем
            const transaction = db.transaction('keys');

            // получаем хранилище
            const store = transaction.objectStore('keys');

            // отдаем приватный ключ из хранилища
            return await store.get(id);
        } else {
            console.error('Keys не существует(');
            return null;
        }
    } catch (error) {
        console.error('Ошибка получения данных из IndexedDB: ', error);
        return null;
    }
}