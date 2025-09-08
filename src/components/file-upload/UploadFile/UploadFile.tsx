import React, { Suspense } from 'react';

import UploadFileForm from "@/components/upload-file-components/UploadFileForm/UploadFileForm"
import { UploadFileProps, UploadFileResponse } from "@/interfaces/components/file-upload";
import { useEffect, useState } from "react";
import Loader from '@/components/ui/Loader/Loader';

const UploadFile = (
    { isShowUploadForm, file, fileSrc,
        isFormUploadFade,
        setIsFormUploadFade, isFormUploadFile,
        setIsFormUploadFile, authState,
        encFile, socket, publicKeys }: UploadFileProps) => {

    const [dataUploadFile, setDataUploadFile] = useState<UploadFileResponse | undefined | null>(null);
    const [errorDataUploadFile, setErrorDataUploadFile] = useState<boolean | undefined>(false);
    const [messageToFile, setMessageToFile] = useState<string | null | undefined>('')

    const closeFileForm = () => {
        if (isFormUploadFile) {
            setIsFormUploadFade(false);
            setTimeout(() => {
                setIsFormUploadFile(false)
            }, 100)
        }
    }

    useEffect(() => {
        if (dataUploadFile && dataUploadFile?.status === 'ok' && !errorDataUploadFile) {
            setMessageToFile('')
            closeFileForm()
        }
    }, [dataUploadFile, errorDataUploadFile])

    if (isShowUploadForm) {
        return (
            <Suspense fallback={<Loader isFade={true} />}>
                <div className={`z-100 flex justify-center items-center fixed top-0 left-0 w-full h-full
                            bg-black/50 transition-all duration-200 ease-out
                            ${isFormUploadFade ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2'}`}
                >
                    <UploadFileForm
                        publicKeys={publicKeys}
                        setDataUploadFile={setDataUploadFile}
                        setErrorDataUploadFile={setErrorDataUploadFile}
                        authState={authState}
                        file={encFile} socket={socket}
                        messageToFile={messageToFile}
                        closeFileForm={closeFileForm}
                        setMessageToFile={setMessageToFile}
                        typeFile={file!.type} fileSrc={fileSrc}
                    />
                </div>
            </Suspense>
        )
    }

    return null
}

export default UploadFile