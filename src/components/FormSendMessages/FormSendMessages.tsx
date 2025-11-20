'use client'

import React from 'react';

import { useSelector } from "@/hooks/useTypedSelector";
import { FormSendMessageProps } from "@/interfaces/components/form-send-messages";
import { useSendMessageMutation, useSendMessageToBotMutation, useUpdateMessageMutation } from "@/redux/services/messagesApi";
import { resetDataChangeMessage } from "@/redux/slices/changeMessageSlice";
import { selectChangeMessageState, selectTokenState } from "@/selectors/selectors";
import { encryptText } from "@/utils/encryption/encryptText";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { cacheUpdateMessage } from '@/cashe/messageCache';

const FormSendMessages = (
    { message, socket, name,
        currentUserid, setMessage, messageId,
        publicKeys }:
        FormSendMessageProps) => {

    const tokenState = useSelector(selectTokenState);

    const searchParams = useSearchParams();

    const { data: authData } = useCheckAuthQuery({ token: tokenState.token });

    const updateMessageState = useSelector(selectChangeMessageState);

    const [updateMessage, { isLoading: isLoadingUpdateMessage, data: updateMessageData }] = useUpdateMessageMutation()

    const [sendMessageToBot] = useSendMessageToBotMutation();
    const [sendMessage] = useSendMessageMutation();
    const [encMessage, setEncMessage] = useState<ArrayBuffer | null>(null);
    const [isSubmit, setIsSubmit] = useState(false)

    const dispatch = useDispatch();

    const onChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setMessage(value)
    }

    useEffect(() => {
        const submitForm = async () => {
            if (encMessage) {
                const base64Message = Buffer.from(encMessage).toString('base64');

                const formData = new FormData();

                if (updateMessageState.isChange && publicKeys && messageId) {
                    updateMessage({ messageId: messageId, userId: authData?.user?.id, data: { message: JSON.stringify(base64Message) }, token: tokenState.token });
                    cacheUpdateMessage(message, messageId)
                    setMessage('')
                    setIsSubmit(false)
                    setEncMessage(null)
                } else {
                    const id = uuidv4();

                    formData.append('id', id);

                    const messageData = {
                        id,
                        message: JSON.stringify(base64Message)
                    }

                    formData.append('message', JSON.stringify(messageData))
                    formData.append('action', JSON.stringify(message.toLowerCase()))

                    const userId = searchParams?.get('user');

                    if (userId && socket) {
                        if (name === 'БОТ' && currentUserid) {
                            sendMessageToBot({
                                userId,
                                currentUserId: currentUserid,
                                data: formData,
                                token: tokenState.token
                            })
                            // Убираем пользовательский ввод при отправке
                            setMessage('')
                        } else {
                            if (currentUserid) {
                                sendMessage({
                                    userId,
                                    currentUserId: currentUserid,
                                    data: formData,
                                    token: tokenState.token
                                });

                                setMessage('')
                                setIsSubmit(false)
                                setEncMessage(null)
                            }
                        }
                    }
                }
            }
        }

        if (isSubmit) {
            submitForm()
        }
    }, [isSubmit, encMessage])

    const onSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (publicKeys) {

            setIsSubmit(true)
            const encryptMessage = await encryptText(message, publicKeys);

            if (encryptMessage) {
                setEncMessage(encryptMessage)
            }
        }
    }

    useEffect(() => {
        if (!isLoadingUpdateMessage && updateMessageData?.status === 'ok') {
            dispatch(resetDataChangeMessage())
        }
    }, [isLoadingUpdateMessage, updateMessageData])

    return (
        <form onSubmit={onSendMessage} className="w-full h-full flex relative dark:bg-[#212121]">
            <input placeholder='Сообщение...' type="text"
                className="bg-white z-52 mb-1 w-[calc(100%-85px)] dark:text-[#E1E3E6] dark:bg-[#141414] mr-5 p-2 rounded-xl px-3 outline-0 border-2
        focus:border-amber-400/50 hover:border-amber-400/50
        transition-all duration-400 ml-6" name='message' onChange={onChangeMessage} value={message} />
            <button type="submit" className="mb-1 hover:text-amber-400/50 transition-all duration-400 text-4xl cursor-pointer">
                {'>'}
            </button>
        </form>
    )
}

export default FormSendMessages