'use client';

import React, { Suspense } from 'react';

import FormSendMessages from "@/components/FormSendMessages/FormSendMessages";
import Loader from "@/components/ui/Loader/Loader";
import MessageList from "@/components/messages-components/MessageList/MessageList";
import WebSocketConnection from "@/components/WebSocketConnection/WebSocketConnection";
import { useGetMessagesMutation, useGetNextLengthMessagesQuery } from "@/redux/services/messagesApi";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";
import WrapperChoosingCities from "@/components/actions-with-cities-components/WrapperChoosingCities/WrapperChoosingCities";
import ChoosingCities from "@/components/actions-with-cities-components/СhoosingCities/ChoosingCities";
import { useGetCitiesQuery } from "@/redux/services/citiesApi";
import useDebounce from "@/hooks/useDebounce";
import { useCheckAuthQuery, useGetPublicKeysQuery, useUpdateCityMutation } from "@/redux/services/authApi";
import { useRouter } from "next/navigation";
import ChoosingCitiesOnMap from "@/components/actions-with-cities-components/ChoosingCitiesOnMap/ChoosingCitiesOnMap";
import HomeWelcomePage from "../HomeWelcomePage/HomeWelcomePage";
import SettingsWindow from "@/components/SettingsWindow/SettingsWindow";
import useUrl from "@/hooks/useUrl";
import { useSelector } from "@/hooks/useTypedSelector";
import { selectChangeMessageState, selectImageState } from "@/selectors/selectors";
import { encryptFile } from "@/utils/encryption/encryptFile";
import UploadMenuWithButtonAction from "@/components/file-upload/UploadMenuWithButtonAction/UploadMenuWithButtonAction";
import UploadFile from "@/components/file-upload/UploadFile/UploadFile";
import loadFile from "@/utils/loadFile";
import { decryptFile } from "@/utils/encryption/decryptFile";
import { getPrivateKeyFromIndexedDB } from "@/utils/encryption/indexedDB/getPrivateKeyFromIndexedDB";
import WindowWithInfo from "@/components/WindowWithInfo/WindowWithInfo";
import { MessageInfo } from "@/interfaces/message";
import { PrivatKey } from "@/interfaces/encryption";
import { Coordinates } from "@/interfaces/position";
import { decryptText } from "@/utils/encryption/decryptText";
import { base64ToArrayBuffer } from "@/utils/base64ToArrayBuffer";
import ImageWindow from "@/components/ImageWindow/ImageWindow";

const HomePage = () => {
    // Для работы вебсокета
    const { socket, setWsMessages, wsMessages, deleteMessageId, setDeleteMessageId, updatedMessage, setUpdatedMessage } = WebSocketConnection();

    const searchParams = useSearchParams();
    const router = useRouter();

    const changeMessageState = useSelector(selectChangeMessageState);
    const imageUrlState = useSelector(selectImageState);

    const [message, setMessage] = useState('');
    const [isFormUploadFile, setIsFormUploadFile] = useState(false);
    const [currentOffSet, setCurrentOffSet] = useState<string | null>('0');
    const [position, setPosition] = useState<Coordinates | null>(null);

    // Для анимации перехода выбора файлов
    const [isFormUploadFade, setIsFormUploadFade] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [encFile, setEncFile] = useState<File | null>(null)
    const [fileSrc, setFileSrc] = useState('');
    const [searchCity, setSearchCity] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [updateCity, { data: updateCityData }] = useUpdateCityMutation();
    const [messages, setMessages] = useState<MessageInfo[]>([]);
    const [privatKey, setPrivatKey] = useState<PrivatKey | null>(null);
    const [countFirstRender, setCountFirstRender] = useState(0);

    // Получение данных авторизованного пользователя
    const { data: authState, isLoading: isLoadingAuth, refetch } = useCheckAuthQuery({});

    const [mapCity, setMapCity] = useState(authState?.user?.city);

    // Получение публичных ключей
    const { data: publicKeysData, isLoading: isPublicKeyLoading } = useGetPublicKeysQuery({ recipientId: authState?.user?.id, senderId: searchParams?.get('user') })

    // Получение юзеров
    const { data: userData } = useGetUsersQuery({ q: String(searchParams?.get('user')), currentId: authState?.user?.id });

    // Длина следующих сообщений
    const { data: dataNextLength } = useGetNextLengthMessagesQuery({
        nextOffset: Number(currentOffSet) + 10,
        senderId: authState?.user?.id,
        recipientId: searchParams?.get('user')
    });

    // Хук для работы с url
    const { url } = useUrl();

    // Для откладывания поиска по городу на 400 милисекунд
    const debounceSearchCity = useDebounce(searchCity, 400)

    // Получение городов при поиске
    const { data: citiesData } = useGetCitiesQuery({ q: debounceSearchCity });

    // Получение сообщений
    const [getMessages, { data: messagesData, isLoading: isLoadingMessages }] = useGetMessagesMutation();

    // Счетчик для первоначального рендера
    useEffect(() => {
        setCountFirstRender(Number(countFirstRender) + 1)
    }, [searchParams?.get('offset')])

    useEffect(() => {
        const messagesUpdated = messages.filter(message => message.id !== deleteMessageId);
        const messagesWSUpdated = wsMessages.filter(message => message.id !== deleteMessageId);
        setWsMessages(messagesWSUpdated)
        setMessages(messagesUpdated)
        setDeleteMessageId(null)
    }, [deleteMessageId, setDeleteMessageId])


    useEffect(() => {
        setWsMessages([])
        setMessages([])
        setCurrentOffSet('0')
        if (searchParams?.get('user') && authState?.user?.id) {
            getMessages({ currentUserId: searchParams?.get('user'), userId: authState?.user?.id, offset: '0' })
        }

    }, [searchParams?.get('user')])

    useEffect(() => {

        if (updatedMessage) {

            const messagesUpdateIndex = messages.findIndex(message => message.id === updatedMessage.idMessage);
            const messagesWSUpdateIndex = wsMessages.findIndex(message => message.id === updatedMessage.idMessage);

            if (messagesUpdateIndex !== -1) {

                const messagesAll = messages;

                messagesAll.splice(messagesUpdateIndex, 1, { ...messages[messagesUpdateIndex], message: updatedMessage.message })

                setMessages(messagesAll)
            }

            if (messagesWSUpdateIndex !== -1) {

                const messagesWSAll = wsMessages;

                messagesWSAll.splice(messagesWSUpdateIndex, 1, { ...wsMessages[messagesWSUpdateIndex], message: updatedMessage.message })

                setWsMessages(messagesWSAll)
            }

            setUpdatedMessage(null)
        }
    }, [setUpdatedMessage, updatedMessage])

    useEffect(() => {
        if (authState?.user?.city) {
            setSearchCity(authState?.user?.city)
        }
    }, [authState?.user?.city])

    useEffect(() => {
        if (changeMessageState.isChange) {
            setMessage(changeMessageState.message)
        }
    }, [changeMessageState.isChange])

    useEffect(() => {
        try {
            if (selectedCity.trim() && authState?.user?.id) {
                updateCity({ id: authState?.user?.id, city: selectedCity })

            }
        } catch (err) {
            console.log('Ошибка обновления города ', err)
        }
    }, [selectedCity, setSelectedCity])

    useEffect(() => {
        if (updateCityData?.status === 'ok' && url) {
            refetch();
            url.searchParams.delete('showSelectedCities');
            url.searchParams.delete('showMapCities');

            router.push(url.href)
        }
    }, [updateCityData])

    useEffect(() => {
        if (url && authState?.user?.id && !url.searchParams.get('tab')) {
            url.searchParams.set('tab', 'chats');

            router.push(url.href)
        }
    }, [authState?.user?.id])

    useEffect(() => {

        if (searchParams?.get('user') && authState?.user?.id) {
            getMessages({ currentUserId: searchParams?.get('user'), userId: authState?.user?.id, offset: currentOffSet })
        }

    }, [searchParams?.get('offset'), authState?.user?.id])

    useEffect(() => {
        if (searchParams?.get('user') && url) {
            url?.searchParams.set('offset', '0')
            url?.searchParams.set('user', String(searchParams?.get('user')));
            setCurrentOffSet('0')
            setWsMessages([])
            setMessages([])
            router.push(url?.href)
            if (searchParams?.get('user') && authState?.user?.id) {
                getMessages({ currentUserId: searchParams?.get('user'), userId: authState?.user?.id, offset: currentOffSet })
            }
        }

    }, [searchParams?.get('user')])

    useEffect(() => {
        if (searchParams?.get('user') && url) {
            url?.searchParams.set('offset', '0')
            url?.searchParams.set('user', String(searchParams?.get('user')));
            setCurrentOffSet('0')
            router.push(url.href)
        }
    }, [url])

    useEffect(() => {

        if (url && searchParams?.get('user')) {
            url?.searchParams.set('offset', String(currentOffSet))
            url?.searchParams.set('user', String(searchParams?.get('user')))
            router.push(url.href);
        }
    }, [url, setCurrentOffSet, currentOffSet])

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
        if (!isLoadingMessages && messagesData?.messages?.length && privatKey) {
            (async () => {
                const messagesDataAll = await Promise.all(messagesData?.messages.map(async (message) => {
                    if (message.file_type) {

                        const encryptedFile = await loadFile(
                            message.file_url, message.file_type, message.file_name
                        );

                        if (encryptedFile instanceof Blob) {

                            const arrayBuffer = encryptedFile;
                            const decryptedArrayBuffer = await decryptFile(arrayBuffer, privatKey.data, message.file_name,
                                message.file_type);

                            try {
                                const url = URL.createObjectURL(decryptedArrayBuffer);

                                const messageList = message.message.split('\n');

                                let decMessage;

                                try {
                                    const arrBufferMessage = base64ToArrayBuffer(messageList[1].trim());
                                    decMessage = await decryptText(arrBufferMessage, privatKey.data)
                                } catch (err) {
                                    console.log(err);
                                    decMessage = messageList[1].trim();
                                }
                                if (decMessage) {
                                    const allMessage = messageList[0].trim() + ' \n ' + decMessage;
                                    return {
                                        ...message,
                                        message: allMessage,
                                        file_url: url,
                                        file: {
                                            originalName: message.file_name,
                                            file_url: url,
                                            type: message.file_type,
                                            size: message.file_size
                                        }
                                    };
                                }

                            } catch (e) {
                                console.error(e)
                            }
                        }
                    } else {
                        let decMessage;

                        try {
                            const arrBufferMessage = base64ToArrayBuffer(JSON.parse(message.message));
                            decMessage = await decryptText(arrBufferMessage, privatKey.data)
                        } catch (err) {
                            console.log(err);
                            decMessage = message.message;
                        }
                        if (decMessage) {
                            return { ...message, message: decMessage }
                        }
                    }
                }))

                const filteredMessages = messagesDataAll.filter(message => message !== undefined) as MessageInfo[];

                const messagesSort = filteredMessages.sort((a, b) => {
                    if (a.created_at && b.created_at) {
                        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                    }
                    return 0
                });

                setMessages([...messagesSort, ...messages]);
            })()

        }
    }, [messagesData?.messages, isLoadingMessages, privatKey])

    useEffect(() => {
        if (file && publicKeysData?.publicKeys.length) {

            const encryptFileAsync = async () => {
                const encrFile = await encryptFile(file, publicKeysData.publicKeys);

                if (encrFile) {
                    setEncFile(encrFile)
                }
            }

            encryptFileAsync()
        }
    }, [file, setFile, publicKeysData?.publicKeys])

    useEffect(() => {
        const coors = citiesData?.cities[0].coordinates.split(',')
        if (coors && citiesData?.cities[0].name === authState?.user?.city) {
            setPosition({ latitude: Number(coors[0]), longitude: Number(coors[1]) });
        }
    }, [citiesData]);

    if (isLoadingAuth) return <Loader isFade={true} />

    if (!isLoadingAuth && !authState?.user?.id) return <HomeWelcomePage />

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <div className={`h-full flex flex-col justify-end w-full relative`}>
                {imageUrlState.isShowImage && imageUrlState.url ?
                    <ImageWindow url={imageUrlState.url} /> :
                    null}
                {searchParams?.get('settings') && (
                    <SettingsWindow isFade={true} />
                )}

                {searchParams?.get('showSelectedCities') && authState?.user?.city && (
                    <WrapperChoosingCities >
                        <ChoosingCities setSelectedCity={setSelectedCity} setSearchCity={setSearchCity} searchCity={searchCity}
                            cities={citiesData?.cities} cityFromServer={authState?.user?.city} />
                    </WrapperChoosingCities>
                )}
                {searchParams?.get('showMapCities') && authState?.user.city && (
                    <WrapperChoosingCities >
                        <ChoosingCitiesOnMap setSelectedCity={setSelectedCity} position={position}
                            setMapCity={setMapCity} mapCity={mapCity} />
                    </WrapperChoosingCities>
                )}
                {searchParams?.get('tab') === 'chats' && searchParams?.get('user') && (
                    <>
                        {(!isLoadingMessages &&
                            !messagesData?.messages.length && !wsMessages.length) ? (
                            <WindowWithInfo title="Сообщений нет(" text="Напиши первым!" />
                        ) : null}
                        <MessageList
                            userId={searchParams?.get('user')}
                            wsMessages={wsMessages}
                            setCurrentOffSet={setCurrentOffSet}
                            messages={[...messages || [], ...wsMessages]}
                            currentUser={authState?.user}
                            anotherAuthorName={userData && userData?.users[0]}
                            dataNextLength={dataNextLength}
                            isLoadingMessages={isLoadingMessages}
                        />
                        <div className={`bg-white w-full flex justify-center items-center pt-1 border-t-2 max-sm:absolute ${changeMessageState.isChange && 'z-100'}`}>
                            <UploadMenuWithButtonAction
                                setIsFormUploadFade={setIsFormUploadFade} setFile={setFile}
                                setFileSrc={setFileSrc} isFormUploadFile={isFormUploadFile}
                                setIsFormUploadFile={setIsFormUploadFile} />
                            <FormSendMessages
                                publicKeys={publicKeysData?.publicKeys}
                                messageId={changeMessageState.id}
                                setMessage={setMessage}
                                socket={socket} name={userData?.users[0]?.name}
                                currentUserid={authState?.user?.id}
                                message={message}
                            />
                        </div>
                        <UploadFile isShowUploadForm={Boolean(isFormUploadFile && !isPublicKeyLoading && encFile)}
                            file={file} fileSrc={fileSrc}
                            publicKeys={publicKeysData?.publicKeys}
                            isFormUploadFade={isFormUploadFade}
                            setIsFormUploadFade={setIsFormUploadFade} isFormUploadFile={isFormUploadFile}
                            setIsFormUploadFile={setIsFormUploadFile} socket={socket}
                            authState={authState} encFile={encFile} />
                    </>
                )}
            </div>
        </Suspense>
    )
}

export default HomePage