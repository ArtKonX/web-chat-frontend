export async function decryptText(
    encryptedText: ArrayBuffer,
    privateKey: CryptoKey
): Promise<string> {
    // Определяем размеры частей
    const rsaKeySize = 256; // Размер RSA ключа
    const ivSize = 16; // Размер IV

    const data = new Uint8Array(encryptedText);

    // Разделяем данные
    const encryptedSymmetricKey1 = data.slice(0, rsaKeySize);
    const encryptedSymmetricKey2 = data.slice(rsaKeySize, rsaKeySize * 2);
    const iv = data.slice(rsaKeySize * 2, rsaKeySize * 2 + ivSize);
    const encryptedData = data.slice(rsaKeySize * 2 + ivSize);

    try {
        // Параметры для дешифрования RSA
        const decryptParamsRSA = {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
        };

        let symmetricKeyBuffer: ArrayBuffer;

        // Пытаемся расшифровать первый симметричный ключ
        try {
            symmetricKeyBuffer = await crypto.subtle.decrypt(
                decryptParamsRSA,
                privateKey,
                encryptedSymmetricKey1
            );
        } catch (error) {
            console.error(error)

            // Если не получилось, пробуем второй ключ
            symmetricKeyBuffer = await crypto.subtle.decrypt(
                decryptParamsRSA,
                privateKey,
                encryptedSymmetricKey2
            );
        }

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

        // Параметры для дешифрования AES
        const decryptParamsAES = {
            name: 'AES-CBC',
            iv: iv
        };

        // Расшифровываем данные
        const decryptedData = await crypto.subtle.decrypt(
            decryptParamsAES,
            symmetricKey,
            encryptedData
        );

        // Преобразуем в строку
        const decoder = new TextDecoder();
        return decoder.decode(decryptedData);
    } catch (error) {
        console.error('Ошибка при дешифровании:', error);
        throw new Error('Не удалось расшифровать сообщение');
    }
}