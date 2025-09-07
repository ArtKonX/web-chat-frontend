import { UserData } from "@/interfaces/users"
import { ChangeEvent } from "react"

interface DialogueData {
    recipient_id: string,
    sender_id: string,
    userId: string,
    nameSender: string,
    lengthMessages: number,
    lastMessage: string
}

export interface SideBarProps {
    findUsers: UserData[],
    onSearchUsers: (e: ChangeEvent<HTMLInputElement>) => void,
    searchUsers: string,
    dialoguesData: DialogueData[]
}

export interface SideBarActionLinkProps {
    icon: string,
    alt: string,
    href: string,
    isActive: boolean
}

export interface SideBarInputSearchProps {
    onSearchUsers: (e: ChangeEvent<HTMLInputElement>) => void,
    searchUsers: string
}

export interface SearchUsersWithActionListProps {
    usersData: UserData[]
}

interface DialogueData {
    userId: string,
    nameSender: string,
    lengthMessages: number,
    recipient_id: string,
    sender_id: string,
    lastMessage: string,
    status: boolean,
    colorProfile: string
}

export interface DialoguesListProps {
    dialoguesData: DialogueData[]
}

export interface DialogueProps {
    id: string,
    name: string,
    isActiveUser: boolean,
    quantityMessages: number,
    lastMassage: string,
    status: boolean,
    profileColor: string
}