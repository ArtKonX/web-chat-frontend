export interface FormSendMessageProps {
    message: string,
    socket: WebSocket | null,
    name?: string,
    currentUserid?: string,
    setMessage: (message: string) => void,
    messageId?: string,
    publicKeys?: string[]
}