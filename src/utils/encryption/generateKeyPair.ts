import { JWK } from "@/interfaces/encryption";

export async function generateKeyPair(): Promise<{ publicKey: JWK; privateKey: CryptoKey }> {
    try {

        const keyPair = await crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: 2048,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: 'SHA-256'
            },
            true,
            ['encrypt', 'decrypt']
        );

        const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey) as JWK;

        return { publicKey, privateKey: keyPair.privateKey };
    } catch (error) {
        console.error('Ошибка генерации ключей:', error);
        throw error;
    }
}