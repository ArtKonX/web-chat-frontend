import { DialogueData } from "@/interfaces/components/layout";
import { MessageInfo } from "@/interfaces/message";

interface MessageData {
    id?: string,
    message?: string,
    date: Date,
}

export interface GetMessagesResponse {
    messages: MessageInfo[] | []
}
export interface GetMessagesData {
    currentUserId: string | null,
    userId: string | null,
    offset: string | null,
    token: string
}

export interface SendMessageResponse {
    status: string;
    token: string;
    messageData: MessageData;
};
export interface SendMessageData {
    userId: string;
    currentUserId: string;
    data?: FormData,
    token: string
};

export interface SendMessageToBotResponse {
    status: string;
    token: string;
    messages: [MessageData, MessageData];
}
export type SendMessageToBotData = SendMessageData

export type UploadFileWithMessResponse = SendMessageToBotResponse
export type UploadFileWithMessData = SendMessageToBotData

export interface GetInfoDialoguesResponse {
    data: DialogueData[]
}
export interface GetInfoDialoguesData {
    userId?: string,
    token: string
}

export interface UpdateMessageResponse {
    messageUpdated: MessageData,
    status: string
}
export interface UpdateMessageData {
    messageId?: string,
    userId?: string,
    data: {
        message: string
    },
    token: string
}

export interface DeleteMessageResponse {
    status: string
}
export interface DeleteMessageData {
    messageId?: string,
    userId?: string,
    token: string
}

export interface GetNextLengthMessagesResponse {
    lengthNextMessages: number,
    isNextMessages: boolean
}
export interface GetNextLengthMessagesData {
    nextOffset: number,
    senderId?: string,
    recipientId: string | null | undefined,
    token: string
}