import { useSelector } from "@/hooks/useTypedSelector";
import { FormSendMessageProps } from "@/interfaces/components/form-send-messages";
import { useSendMessageMutation, useSendMessageToBotMutation, useUpdateMessageMutation } from "@/redux/services/messagesApi";
import { resetDataChangeMessage } from "@/redux/slices/changeMessageSlice";
import { selectChangeMessageState, selectUser } from "@/selectors/selectors";
import { encryptText } from "@/utils/encryption/encryptText";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';

const FormSendMessages = (
    { message, socket, name,
        currentUserid, setMessage, messageId,
        publicKeys }:
        FormSendMessageProps) => {

    const searchParams = useSearchParams();
    const authData = useSelector(selectUser)

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

                if (updateMessageState.isChange && publicKeys) {
                    updateMessage({ messageId: messageId, userId: authData?.id, data: { message: JSON.stringify(base64Message) } });
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

                    const userId = searchParams?.get('user');

                    if (userId && socket) {
                        if (name === 'БОТ' && currentUserid) {
                            sendMessageToBot({
                                userId,
                                currentUserId: currentUserid,
                                data: formData
                            })
                            // Убираем пользовательский ввод при отправке
                            setMessage('')
                        } else {
                            if (currentUserid) {
                                sendMessage({
                                    userId,
                                    currentUserId: currentUserid,
                                    data: formData
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
            console.log(JSON.stringify(encMessage))
            submitForm()
        }
    }, [isSubmit, encMessage])

    const onSendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (publicKeys) {

            setIsSubmit(true)
                        console.log(message, publicKeys)
            const encryptMessage = await encryptText(message, publicKeys);
            console.log(encryptMessage, message, publicKeys)
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
        <form onSubmit={onSendMessage} className="w-full h-full flex relative">
            <input placeholder='Сообщение...' type="text"
                className="bg-white z-52 mb-1 w-[calc(100%-110px)] mr-5 p-2 rounded-xl px-3 outline-0 border-2
        focus:border-amber-400/50 hover:border-amber-400/50
        transition-all duration-400 ml-6" name='message' onChange={onChangeMessage} value={message} />
            <button type="submit" className="mb-1 hover:text-amber-400/50 transition-all duration-400 text-4xl cursor-pointer">
                ➤
            </button>
        </form>
    )
}

export default FormSendMessages