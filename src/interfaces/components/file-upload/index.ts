export interface UploadFileResponse {
    status: string;
}

interface AuthState {
    user: {
        id: string
    }
}

export interface UploadFileProps {
    isShowUploadForm: boolean,
    file?: File | null,
    fileSrc: string,
    isFormUploadFade: boolean,
    setIsFormUploadFade: (isFormUploadFade: boolean) => void,
    isFormUploadFile: boolean,
    setIsFormUploadFile: (isFormUploadFile: boolean) => void,
    authState?: AuthState,
    encFile: File | null,
    socket: WebSocket | null,
    publicKeys?: string[]
}

export interface UploadMenuWithButtonActionProps {
    setIsFormUploadFade: (isFormUploadFade: boolean) => void,
    setFile: (file: File) => void,
    setFileSrc: (fileSrc: string) => void,
    isFormUploadFile: boolean,
    setIsFormUploadFile: (isFormUploadFile: boolean) => void
}