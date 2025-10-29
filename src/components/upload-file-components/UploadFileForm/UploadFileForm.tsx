'use client'

import React from 'react';

import CloseBtn from "@/components/ui/CloseBtn/CloseBtn"
import Loader from "@/components/ui/Loader/Loader";
import { UploadFileFormProps } from "@/interfaces/components/upload-file-components";
import { useUploadFileWithMessMutation } from "@/redux/services/messagesApi";
import { encryptText } from "@/utils/encryption/encryptText";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { selectTokenState } from '@/selectors/selectors';
import { useSelector } from '@/hooks/useTypedSelector';

const UploadFileForm = (
    { closeFileForm, typeFile, fileSrc,
        setMessageToFile, messageToFile, file,
        socket, authState, setDataUploadFile,
        setErrorDataUploadFile,
        publicKeys }: UploadFileFormProps
) => {

    const [uploadFileWithMess, { data: dataUploadFile, error: errorDataUploadFile, isLoading: isLoadingUpload }] = useUploadFileWithMessMutation();
    const [encMessage, setEncMessage] = useState<ArrayBuffer | null>(null);
    const [isSubmit, setIsSubmit] = useState(false)
    const searchParams = useSearchParams();

    const tokenState = useSelector(selectTokenState);

    useEffect(() => {
        setDataUploadFile(dataUploadFile)
    }, [dataUploadFile])

    useEffect(() => {
        setErrorDataUploadFile(!!errorDataUploadFile)
    }, [errorDataUploadFile])

    useEffect(() => {
        const submitForm = async () => {
            let base64Message = '';

            if (encMessage) {
                base64Message = Buffer.from(encMessage).toString('base64');
            }

            if (socket) {
                if (file) {
                    const id = uuidv4();
                    const formData = new FormData();
                    formData.append('file', file);
                    const message = { id, message: base64Message }
                    formData.append('message', JSON.stringify(message));
                    const userId = searchParams?.get('user');

                    if (userId && authState && socket) {
                        uploadFileWithMess({
                            userId,
                            currentUserId: authState?.user.id,
                            data: formData,
                            token: tokenState.token
                        })
                    }
                }
            }
        }

        if (isSubmit) {
            submitForm()
        }
    }, [isSubmit, encMessage])

    const onChangeMessFile = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setMessageToFile(value)
    }

    const onUploadFile = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (publicKeys && messageToFile) {
            const encryptMessage = await encryptText(messageToFile, publicKeys);
            if (encryptMessage) {
                setEncMessage(encryptMessage)
            }
        }
        setIsSubmit(true)
    }

    const renderViewFile = (type: string, src: string) => {
        if (type.includes('image')) {
            return (
                <img src={src} height={300} className="mb-4" />
            )
        } else if (type.includes('video')) {
            return (
                <video controls>
                    <source src={src} type={type} />
                </video>
            )
        } else if (type.includes('audio')) {
            <audio controls src={src} />
        } else {
            return (
                <span>Не распознано(</span>
            )
        }
    }

    if (isLoadingUpload) return <Loader isFade={isLoadingUpload} />

    return (
        <>
            <form data-testid="upload-file-form" onSubmit={onUploadFile} className="bg-white py-3 px-5 rounded-2xl
                                    max-w-2/6 max-lg:max-w-9/11 max-sm::max-w-10/11 w-full flex flex-col items-center justify-center">
                <div className="w-full flex justify-between items-center mb-4 z-200">
                    <h3 className='overflow-hidden whitespace-nowrap text-ellipsis'>
                        {typeFile.includes('image') ? 'Изображение' :
                            typeFile.includes('video') ? 'Видео' : typeFile.includes('audio') ?
                                'Аудио' : 'Не распознан формат'}: {file?.name}
                    </h3>
                    <CloseBtn onClose={closeFileForm} />
                </div>
                {renderViewFile(typeFile, fileSrc)}
                <div className="w-full border-t-2 relative pt-2">
                    <input className={`w-[calc(100%-22px)] focus:outline-0 text-lg`}
                        type="text" placeholder="Добавить описание..."
                        onChange={onChangeMessFile} value={String(messageToFile)} />
                    <button type="submit" data-testid="mock-upload-button" className="hover:text-amber-400/50 transition-all
                duration-400 text-2xl cursor-pointer">
                        ➤
                    </button>
                </div>
            </form >
        </>
    )
}

export default UploadFileForm