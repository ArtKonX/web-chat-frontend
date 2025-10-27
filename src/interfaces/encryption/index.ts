export interface PrivatKey {
    data: CryptoKey,
    date: Date
}

export interface JWK {
    kty: string;
    e: string;
    n: string;
    alg: string;
    ext: boolean;
    kid?: string;
}

export interface RSAOAEPParams {
    name: 'RSA-OAEP';
    hash: string;
}