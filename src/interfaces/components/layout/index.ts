export interface DialogueData {
    id?: string,
    recipient_id: string,
    sender_id: string,
    userId: string,
    nameSender: string,
    lengthMessages: number,
    lastMessage: string,
    status: boolean,
    colorProfile: string,
    dateMessage: Date,
    listDates: Date[]
}