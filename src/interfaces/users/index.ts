export interface UserData {
    id: string;
    name: string;
    email: string;
    city: string,
    color_profile: string
}

export interface UserStatus {
    type: string,
    userId: string,
    status: boolean
}