import generateSymmetricKey from "./generateSymmetricKey";
import { importPublicKey } from "./importPublicKey";

export async function encryptText(
    text: string,
    keys: string[]
): Promise<ArrayBuffer> {
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

    try {
        // Преобразуем текст в ArrayBuffer
        const encoder = new TextEncoder();
        const textBuffer = encoder.encode(text);

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

        // Шифрование текста симметричным ключом
        const encryptedData = await crypto.subtle.encrypt(
            {
                name: 'AES-CBC',
                iv: iv
            },
            symmetricKey,
            textBuffer
        );

        // Объединение всех частей
        const combinedData = new Uint8Array([
            ...new Uint8Array(encryptedSymmetricKeyRecipient),
            ...new Uint8Array(encryptedSymmetricKeySender),
            ...iv,
            ...new Uint8Array(encryptedData)
        ]);

        return combinedData.buffer;
    } catch (error) {
        throw new Error(`Ошибка шифрования: ${error}`);
    }
}