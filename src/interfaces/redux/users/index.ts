import { UserData } from "@/interfaces/users"

export interface GetUsersResponse {
    users: UserData[]
}

export interface GetUsersData {
    q: string | number | boolean,
    currentId: string | undefined,
    token: string
}