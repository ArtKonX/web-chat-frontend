import { JWK } from "@/interfaces/encryption";

export async function importPublicKey(jwk: JWK): Promise<CryptoKey> {
    return crypto.subtle.importKey(
        'jwk',
        jwk,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
        },
        true,
        ['encrypt']
    );
}