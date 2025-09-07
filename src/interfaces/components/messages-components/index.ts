import { MessageInfo } from "@/interfaces/message"

interface UserData {
    id: string,
    city: string,
    name: string
}

export interface MessagesListProps {
    messages: MessageInfo[],
    wsMessages: MessageInfo[],
    currentUser?: UserData | null,
    anotherAuthorName?: UserData,
    setCurrentOffSet: (currentOffSet: string) => void,
    dataNextLength?: {
        lengthNextMessages: number,
        isNextMessages: boolean
    },
    isLoadingMessages: boolean,
    userId: string | null
}

export interface MessageItemProps {
    currentId?: UserData | null,
    message: MessageInfo,
    anotherAuthorName?: UserData,
    setIsScroll: (isScroll: boolean) => void
}

export interface ShowActionMessage {
    id?: string,
    isShow: boolean
}