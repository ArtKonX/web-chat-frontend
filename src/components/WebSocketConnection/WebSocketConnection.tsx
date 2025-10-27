'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import { useSelector } from "@/hooks/useTypedSelector";
import { WSDialogueData } from "@/interfaces/components/websocket-connection";
import { PrivatKey } from "@/interfaces/encryption";
import { MessageInfo } from "@/interfaces/message";
import { UserStatus } from "@/interfaces/users";
import { useCheckAuthQuery } from "@/redux/services/authApi";
import { selectTokenState } from "@/selectors/selectors";
import { base64ToArrayBuffer } from "@/utils/base64ToArrayBuffer";
import { decryptFile } from "@/utils/encryption/decryptFile";
import { decryptText } from "@/utils/encryption/decryptText";
import { getPrivateKeyFromIndexedDB } from "@/utils/encryption/indexedDB/getPrivateKeyFromIndexedDB";
import loadFile from "@/utils/loadFile";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import constsEnv from '@/environment/environment';
import { cacheDeleteMessage, cacheMessage, cacheUpdateMessage } from '@/cashe/messageCache';
import { cacheDeleteDialogue, cacheDialogue } from '@/cashe/dialoguesCache';

const WebSocketConnection = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [wsMessages, setWsMessages] = useState<MessageInfo[]>([]);
    const searchParams = useSearchParams();
    const tokenState = useSelector(selectTokenState);
    const [wsInfoDialogues, setWsInfoDialogues] = useState<WSDialogueData | null>(null);
    const userRef = useRef(searchParams?.get('user'));
    const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
    const [updatedMessage, setUpdatedMessage] = useState<MessageInfo | null>(null);
    const [userStatus, setUserStatus] = useState<UserStatus | null>(null)

    const [userId, setUserId] = useState<string | null>(null)

    const { data: dataAuth, isLoading: isAuthLoading, refetch: authRefetch } = useCheckAuthQuery({ token: tokenState?.token });

    const [privatKey, setPrivatKey] = useState<PrivatKey | null>(null)

    useEffect(() => {
        const getPrivatKey = async () => {
            const privatKeyCurrent = await getPrivateKeyFromIndexedDB();

            if (privatKeyCurrent) {
                setPrivatKey(privatKeyCurrent)
            }
        }

        getPrivatKey();
    }, [])

    useEffect(() => {
        userRef.current = searchParams?.get('user')
    }, [searchParams?.get('user')])

    useEffect(() => {

        const initWebSocket = async () => {

            // Создаем объект для работы с WebSocket
            const currentSocket = new WebSocket(constsEnv.NEXT_BACKEND_URL_WS);
            setSocket(currentSocket)

            // Создаем обработчик открытия соединения
            currentSocket.onopen = () => {
                console.log('Соединение WebSocket установлено!');
                // Отправляем свой userId при подключении
                currentSocket.send(JSON.stringify({
                    type: 'connect',
                    userId: dataAuth?.user?.id
                }));
            };

            // Создаем обработчик обмена сообщениями
            currentSocket.onmessage = async (event) => {
                try {
                    const newMessage = JSON.parse(event.data);
                    console.log('newMessage', newMessage)
                    // Фильтруем сообщения, чтобы они были только по id от получателя
                    // или отправителя
                    if (((newMessage.sender_id === '0f000000-000c-00d0-00d0-0d0000e00000' && newMessage.recipient_id === dataAuth?.user?.id)
                        || (newMessage.recipient_id === '0f000000-000c-00d0-00d0-0d0000e00000' && newMessage.sender_id === dataAuth?.user?.id)) ||
                        (newMessage.sender_id === searchParams?.get('user')
                            && newMessage.recipient_id === dataAuth?.user?.id) ||
                        (newMessage.sender_id === dataAuth?.user?.id
                            && newMessage.recipient_id === searchParams?.get('user'))
                    ) {
                        if (newMessage.type === 'message') {
                            if (!wsMessages.find(message => message.id === newMessage.id)) {
                                if (newMessage.file_type && privatKey) {
                                    const fetchFile = async () => {
                                        const encryptedFile = await loadFile(
                                            newMessage.file_url, newMessage.file_type, newMessage.file_name
                                        );

                                        if (encryptedFile) {

                                            const decryptedArrayBuffer = await decryptFile(encryptedFile, privatKey.data, newMessage.file_name,
                                                newMessage.file_type);

                                            const messageList = newMessage.message.split('\n');
                                              console.log('messageList', messageList)

                                            let decMessage;

                                            try {
                                                if (messageList[1].trim()) {
                                                    const arrBufferMessage = base64ToArrayBuffer(messageList[1].trim());
                                                    decMessage = await decryptText(arrBufferMessage, privatKey.data)
                                                } else {
                                                    const arrBufferMessage = base64ToArrayBuffer(newMessage.message.trim());
                                                    decMessage = await decryptText(arrBufferMessage, privatKey.data)
                                                }
                                            } catch (err) {
                                                console.log(err);
                                                if (messageList[1].trim()) {
                                                    decMessage = messageList[1].trim();
                                                } else {
                                                    decMessage = newMessage.message
                                                }
                                            }

                                            if (decryptedArrayBuffer && decMessage) {
                                                const allMessage = messageList[1].trim() ? messageList[0].trim() + ' \n ' + decMessage : decMessage;

                                                try {

                                                    // Создаем url адрес
                                                    const url = URL.createObjectURL(decryptedArrayBuffer);

                                                    // Обновляем сообщение
                                                    const updatedMessage = {
                                                        ...newMessage,
                                                        message: allMessage,
                                                        file_url: url,
                                                        file: {
                                                            originalName: newMessage.file_name,
                                                            file_url: url,
                                                            type: newMessage.file_type,
                                                            size: newMessage.file_size
                                                        }
                                                    };

                                                    if (searchParams.get('user')) {

                                                        await cacheMessage(updatedMessage, String(searchParams.get('user')))
                                                    }
                                                    // Добавляем обновленное сообщение в список
                                                    setWsMessages(prev =>
                                                        [...prev.filter(elem => elem.id !== newMessage.id),
                                                            updatedMessage]);

                                                } catch (err) {
                                                    console.log(err)
                                                }
                                            }
                                        }
                                    }

                                    fetchFile()
                                } else {
                                    if (privatKey) {
                                        const fetchMessage = async () => {
                                            let message;
                                            try {
                                                const arrBufferMessage = base64ToArrayBuffer(JSON.parse(newMessage.message));
                                                message = await decryptText(arrBufferMessage, privatKey.data)
                                            } catch (err) {
                                                console.log(err)
                                                message = newMessage.message
                                            }

                                            if (message) {
                                                const newMessageDec = { ...newMessage, message };

                                                if (searchParams.get('user')) {

                                                    await cacheMessage(newMessageDec, String(searchParams.get('user')))
                                                }

                                                setTimeout(() => {
                                                    setWsMessages(prev => [...prev.filter(elem => elem.id !== newMessageDec.id), newMessageDec]);
                                                }, 400)
                                            }
                                        }

                                        fetchMessage();
                                    }
                                }
                            }

                        }

                        // Если сообщение удалено
                        if (newMessage.type === 'delete-message') {

                            await cacheDeleteMessage(newMessage.idMessage)
                            setDeleteMessageId(newMessage.idMessage)
                        }

                        // Если сообщение обновлено
                        if (newMessage.type === 'update-message' && privatKey) {
                            const arrBufferMessage = base64ToArrayBuffer(JSON.parse(newMessage.message));
                            const decMessage = await decryptText(arrBufferMessage, privatKey.data)

                            if (decMessage) {
                                await cacheUpdateMessage(decMessage, newMessage.idMessage)
                                setUpdatedMessage({ idMessage: newMessage.idMessage, message: decMessage })
                            }
                        }

                        if (newMessage.type === 'info-about-chat' && privatKey) {
                            let decMessage;
                            console.log('newMessage', newMessage)

                            try {
                                if (newMessage.lastMessage) {
                                    const arrBufferMessage = base64ToArrayBuffer(JSON.parse(newMessage.lastMessage));
                                    decMessage = await decryptText(arrBufferMessage, privatKey.data)
                                }
                            } catch (err) {
                                console.log(err);
                                decMessage = newMessage.lastMessage
                            }

                            if (decMessage) {
                                await cacheDialogue({ ...newMessage, lastMessage: decMessage })
                                setWsInfoDialogues({ ...newMessage, lastMessage: decMessage })
                            } else {
                                await cacheDeleteDialogue(newMessage.userId)
                                setWsInfoDialogues({ ...newMessage, lastMessage: null })
                            }
                        }
                    }
                    if ((newMessage.sender_id === dataAuth?.user?.id || newMessage.recipient_id === dataAuth?.user?.id)) {
                        if (newMessage.type === 'info-about-chat' && privatKey) {
                            let decMessage;
                            console.log('newMessage', newMessage)

                            try {
                                if (newMessage.lastMessage) {
                                    const arrBufferMessage = base64ToArrayBuffer(JSON.parse(newMessage.lastMessage));
                                    decMessage = await decryptText(arrBufferMessage, privatKey.data)
                                }
                            } catch (err) {
                                console.log(err);
                                decMessage = newMessage.lastMessage
                            }

                            if (decMessage) {
                                await cacheDialogue({ ...newMessage, lastMessage: decMessage })
                                setWsInfoDialogues({ ...newMessage, lastMessage: decMessage })
                            } else {
                                await cacheDeleteDialogue(newMessage.userId)
                                setWsInfoDialogues({ ...newMessage, lastMessage: null })
                            }
                        }
                    }

                    if (newMessage.type === 'user-status') {
                        setUserStatus(newMessage)
                    }
                }
                catch (err) {
                    console.log(err)
                }
            }
        };

        if (userId) {
            initWebSocket();
        }
    }, [userId, dataAuth?.user, dataAuth?.user?.id, userRef.current, privatKey, searchParams?.get('user'),]);

    useEffect(() => {

        if (!isAuthLoading && dataAuth?.user?.id) {
            setUserId(dataAuth?.user?.id)
        } else {
            authRefetch();
        }
    }, [isAuthLoading, dataAuth?.user])

    return {
        socket, wsMessages,
        setWsMessages, wsInfoDialogues,
        setWsInfoDialogues, deleteMessageId,
        setDeleteMessageId, updatedMessage,
        setUpdatedMessage, userStatus,
        setUserStatus
    };
};

export default WebSocketConnection