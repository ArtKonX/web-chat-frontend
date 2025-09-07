import generateSymmetricKey from "./generateSymmetricKey";
import { importPublicKey } from "./importPublicKey";

export async function encryptFile(
    file: File,
    keys: string[]
): Promise<File> {

    // публичные ключи отправителя и получателя в формате JSON
    const [publicKeyRecipient, publicKeySender] = keys;

    // Преобразуем в объект js
    const publicKeyRecipientParse = JSON.parse(publicKeyRecipient);
    const publicKeySenderParse = JSON.parse(publicKeySender);

    // генерируем симметричный ключ для шифрования
    const symmetricKey = await generateSymmetricKey();

    // импортируем публичные ключи
    const publicKeyRecipientCrypto = await importPublicKey(publicKeyRecipientParse);
    const publicKeySenderCrypto = await importPublicKey(publicKeySenderParse);

    const fileReader = new FileReader();

    return new Promise(async (resolve, reject) => {
        fileReader.onload = async (event) => {
            try {
                // Экспорт симметричного ключа
                const exportedSymmetricKey = await crypto.subtle.exportKey(
                    'raw',
                    symmetricKey
                );

                // Генерация IV
                const iv = new Uint8Array(16);
                crypto.getRandomValues(iv);

                // Шифрование симметричного ключа публичными ключами
                const encryptedSymmetricKeyRecipient = await crypto.subtle.encrypt(
                    {
                        name: 'RSA-OAEP'
                    },
                    publicKeyRecipientCrypto,
                    exportedSymmetricKey
                );

                const encryptedSymmetricKeySender = await crypto.subtle.encrypt(
                    {
                        name: 'RSA-OAEP'
                    },
                    publicKeySenderCrypto,
                    exportedSymmetricKey
                );

                // Шифрование данных файла
                const buffer = event.target?.result as ArrayBuffer;

                // шифрование файла симметричным ключом
                const encryptedData = await crypto.subtle.encrypt(
                    {
                        name: 'AES-CBC',
                        iv: iv
                    },
                    symmetricKey,
                    buffer
                );

                // Объединение всех частей
                const combinedData = new Uint8Array([
                    ...new Uint8Array(encryptedSymmetricKeyRecipient),
                    ...new Uint8Array(encryptedSymmetricKeySender),
                    ...iv,
                    ...new Uint8Array(encryptedData)
                ]);

                // Создаем новый File объект
                const encryptedFile = new File(
                    [combinedData],
                    `${file.name}`,
                    {
                        type: file.type,
                        lastModified: Date.now()
                    }
                );

                resolve(encryptedFile);
            } catch (error) {
                reject(new Error(`Ошибка шифрования: ${error}`));
            }
        };

        fileReader.onerror = (error) => {
            reject(new Error(`Ошибка чтения файла: ${error}`));
        };

        fileReader.readAsArrayBuffer(file);
    });
}