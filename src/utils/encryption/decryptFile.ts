import { RSAOAEPParams } from "@/interfaces/encryption";

export async function decryptFile(
    encryptedBlob: Blob,
    privateKey: CryptoKey,
    originalFileName?: string,
    originalContentType?: string
): Promise<File> {
    try {

        // преобразуем Blob в ArrayBuffer
        const buffer = await encryptedBlob.arrayBuffer();

        const data = new Uint8Array(buffer);

        // Определяем размеры частей
        const rsaKeySize = 256;
        const ivSize = 16;

        // Разделяем данные
        const encryptedSymmetricKey1 = data.slice(0, rsaKeySize);
        const encryptedSymmetricKey2 = data.slice(rsaKeySize, rsaKeySize * 2);
        const iv = data.slice(rsaKeySize * 2, rsaKeySize * 2 + ivSize);
        const encryptedData = data.slice(rsaKeySize * 2 + ivSize);

        const decryptParamsRSA: RSAOAEPParams = {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
        };

        let symmetricKeyBuffer: ArrayBuffer;

        // Расшифровываем симметричный ключ
        try {

            symmetricKeyBuffer = await crypto.subtle.decrypt(
                decryptParamsRSA,
                privateKey,
                encryptedSymmetricKey1
            );

        } catch (error) {
            console.log(error)
            // Если не получилось, пробуем второй ключ
            symmetricKeyBuffer = await crypto.subtle.decrypt(
                decryptParamsRSA,
                privateKey,
                encryptedSymmetricKey2
            );

        }

        if (symmetricKeyBuffer) {

            // Импортируем симметричный ключ
            const symmetricKey = await crypto.subtle.importKey(
                'raw',
                symmetricKeyBuffer,
                {
                    name: 'AES-CBC',
                    length: 256
                },
                false,
                ['decrypt']
            );

            const decryptParamsAES = {
                name: 'AES-CBC',
                iv: iv
            };

            // Расшифровываем данные файла
            const decryptedData = await crypto.subtle.decrypt(
                decryptParamsAES,
                symmetricKey,
                encryptedData
            );

            // Формируем File
            const fileName = originalFileName || 'decrypted_file.png';
            const contentType = originalContentType || 'image/png';

            return new File(
                [decryptedData],
                fileName,
                {
                    lastModified: Date.now(),
                    type: contentType
                }
            );
        }

        throw new Error('Не удалось расшифровать файл');
    } catch (error) {
        console.error('Ошибка при расшифровке:', error);
        throw new Error(`Ошибка расшифровки: ${error}`);
    }
}