interface UserSafe {
    id: string,
    date_register?: string,
    email: string,
    name: string,
    city: string,
    color_profile: string,
    fa2_enabled?: boolean
}

export interface LoginResponse {
    user: {
        id: string,
        name: string,
        email: string
    }
}
export interface LoginData {
    email?: string,
    password?: string,
    pin?: string
}

export interface RegistarationResponse {
    user: {
        id: string,
        name: string,
        email: string,
        token: string
    },
    status: string
}
export interface RegistarationData {
    email: string,
    name: string,
    password: string,
    id: string,
    publicKey: string
}

export interface LogoutResponse {
    status?: string
};
export interface LogoutData {
    status?: string
}

export interface UpdateUserResponse {
    user: UserSafe,
    status: string
}
export interface UpdateUserData {
    name?: string | null,
    password?: string | null,
    id?: string | null,
    pin?: string | null,
    token: string
}

export interface CheckAuthResponse {
    user: UserSafe,
    status?: string
};
export interface CheckAuthData {
    status?: string,
    token: string
}

export interface GetPublicKeysResponse {
    publicKeys: string[]
}
export interface GetPublicKeysData {
    recipientId: string | null | undefined,
    senderId: string | null | undefined,
    token: string
}

export type UpdateCityResponse = CheckAuthResponse;
export interface UpdateCityData {
    id: string,
    city: string,
    token: string
}

export interface TurnOn2FAResponse {
    data: {
        user: UserSafe,
        pinCode: string
    }
}
export interface TurnOn2FAData {
    id: string,
    token: string
}

export interface TurnOff2FAResponse {
    data: {
        user: UserSafe
    }
}
export interface TurnOff2FAData {
    id: string,
    pin: string,
    token: string
}