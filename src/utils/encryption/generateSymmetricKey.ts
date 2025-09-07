export default async function generateSymmetricKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
        {
            name: 'AES-CBC', // Алгоритм для шифровки
            length: 256  // Длина ключа в битах
        },
        true,  // Можно экспортировать
        ['encrypt', 'decrypt'] // Для чего можно использовать ключ
    );
}