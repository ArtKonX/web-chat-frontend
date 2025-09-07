import { ChangeEvent } from "react"

export interface MediaUploadItemProps {
    handleFile: (type: string) => void,
    type: string,
    text: string
}

export interface MediaUploadMenuProps {
    onChangeFile: (e: ChangeEvent<HTMLInputElement>) => void,
    isSelectFileFade: boolean
}

export interface AuthState {
    user: {
        id: string
    }
}

interface UploadFileResponse {
    status: string;
}

export interface UploadFileFormProps {
    closeFileForm: () => void;
    setMessageToFile: (messageToFile?: string | null) => void;
    messageToFile?: string | null;
    typeFile: string;
    fileSrc: string;
    file: File | null,
    socket: WebSocket | null,
    authState?: AuthState,
    setDataUploadFile: (dataUploadFile?: UploadFileResponse | null) => void,
    setErrorDataUploadFile: (errorDataUploadFile?: boolean) => void,
    publicKeys?: string[]
}