import { MessageInfo } from "@/interfaces/message"
import { ReactNode } from "react"

interface UserData {
    id: string,
    city: string,
    name: string
}

export interface MessagesListProps {
    messages: MessageInfo[],
    wsMessages: MessageInfo[],
    caсheMessages: MessageInfo[],
    currentUser?: UserData | null,
    anotherAuthorName?: UserData,
    isOnline: boolean,
    setCurrentOffSet: (currentOffSet: string) => void,
    dataNextLength?: {
        lengthNextMessages: number,
        isNextMessages: boolean
    },
    userId: string | null,
    children: ReactNode
}

export interface MessageItemProps {
    currentId?: UserData | null,
    message: MessageInfo,
    anotherAuthorName?: UserData,
    setIsScroll: (isScroll: boolean) => void,
    isCache?: boolean
}

export interface ShowActionMessage {
    id?: string,
    isShow: boolean
}