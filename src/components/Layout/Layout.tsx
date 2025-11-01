'use client'

import React, { Suspense } from 'react';

import { ChangeEvent, ReactNode, useEffect, useState } from "react"
import Header from "../Header/Header"
import { usePathname, useSearchParams } from "next/navigation";
import { selectSideBarState, selectTokenState } from "@/selectors/selectors";
import { useSelector } from "@/hooks/useTypedSelector";
import SideBar from "../SideBar/SideBar";
import useDebounce from "@/hooks/useDebounce";
import { useGetUsersQuery } from "@/redux/services/usersApi";
import { useGetInfoDialoguesQuery } from "@/redux/services/messagesApi";
import WebSocketConnection from "../WebSocketConnection/WebSocketConnection";
import Footer from "../Footer/Footer";
import { DialogueData } from "@/interfaces/components/layout";
import { base64ToArrayBuffer } from "@/utils/base64ToArrayBuffer";
import { decryptText } from "@/utils/encryption/decryptText";
import { getPrivateKeyFromIndexedDB } from "@/utils/encryption/indexedDB/getPrivateKeyFromIndexedDB";
import { PrivatKey } from "@/interfaces/encryption";
import Loader from '../ui/Loader/Loader';
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { cacheDialogue, getCachedDialogues } from '@/cashe/dialoguesCache';
import { UserData } from '@/interfaces/users';
import { getCachedUser } from '@/cashe/userCache';
import SkeletonLayoutList from '../sceleton-layout/SkeletonLayoutList/SkeletonLayoutList';
import { addMessageLen } from '@/redux/slices/messagesSlice';
import { useDispatch } from 'react-redux';

const Layout = (
    { children }: { children: ReactNode }
) => {

    const searchParams = useSearchParams();

    const sideBarState = useSelector(selectSideBarState);
    const tokenState = useSelector(selectTokenState)

    const { data: authData } = useCheckAuthQuery({ token: tokenState?.token });

    const dispatch = useDispatch();

    const pathname = usePathname();
    const [isDemoHeader, setIsDemoHeader] = useState(false);
    const [searchUsers, setSearchUsers] = useState('');
    const searchUsersDebounce = useDebounce(searchUsers, 400);
    const { data: findUsers, isLoading: isFindUsersLoading } = useGetUsersQuery({ q: searchUsersDebounce, currentId: authData?.user?.id, token: tokenState.token });
    const { data: listInfoDialogues, isLoading: isListInfoDialoguesLoading } = useGetInfoDialoguesQuery({ userId: authData?.user?.id, token: tokenState.token });
    const { socket, wsInfoDialogues, setWsInfoDialogues, userStatus, setUserStatus } = WebSocketConnection();
    const [listDialogues, setListDialogues] = useState<DialogueData[] | null>(null);
    const [listCachedDialogues, setListCachedDialogues] = useState<DialogueData[] | null>(null);

    const [privatKey, setPrivatKey] = useState<PrivatKey | null>(null)

    const [userInfo, setUserInfo] = useState<UserData | null>(null)

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        (async () => {
            try {
                const userData = await getCachedUser();

                if (userData) {
                    setUserInfo(userData[0])
                } else {
                    setUserInfo(authData!.user)
                }
            } catch (err) {
                console.log(err)
            }
        })()
    }, [authData?.user,])

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
        const fetchDialogues = async () => {
            if (socket && authData?.user?.id) {
                let allListDialogues = [];
                if (wsInfoDialogues && privatKey) {

                    // Если есть диалоги и если нет
                    if (listDialogues && listDialogues?.length > 0) {
                        allListDialogues = [...listDialogues, wsInfoDialogues];
                    } else {
                        allListDialogues = [wsInfoDialogues];
                    }

                    const filteredAllListDialogues = allListDialogues.filter(dialogue =>
                        (dialogue.lastMessage && ![wsInfoDialogues.recipient_id, wsInfoDialogues.sender_id].includes(dialogue.recipient_id))
                        || (![wsInfoDialogues.recipient_id, wsInfoDialogues.sender_id].includes(dialogue.sender_id))) as DialogueData[]
                    if (wsInfoDialogues.lastMessage) {
                        filteredAllListDialogues.unshift(wsInfoDialogues)
                    }

                    dispatch(addMessageLen({ id: wsInfoDialogues.userId, numberMessages: wsInfoDialogues.listDates.filter(item => new Date(String(item)).getTime() > new Date(String(privatKey.date)).getTime()).length }))

                    setListDialogues(filteredAllListDialogues.map(dialogue => ({ ...dialogue, lengthMessages: dialogue.listDates.filter(item => new Date(String(item)).getTime() > new Date(String(privatKey.date)).getTime()).length + (dialogue.lengthMessages > dialogue.listDates.length ? dialogue.lengthMessages - dialogue.listDates.length : 0) })))
                }
            }
        }


        fetchDialogues()
    }, [wsInfoDialogues, setWsInfoDialogues])

    useEffect(() => {
        if (listDialogues && userStatus) {
            const findIndexDialogue = listDialogues.findIndex(dialogue => dialogue.userId === userStatus.userId);

            if (findIndexDialogue !== -1 && privatKey) {
                const updatedDialogues = [...listDialogues];

                dispatch(addMessageLen({ id: updatedDialogues[findIndexDialogue].userId, numberMessages: updatedDialogues[findIndexDialogue].listDates.filter(item => new Date(String(item)).getTime() > new Date(String(privatKey.date)).getTime()).length }))
                const updatedDialogue = {
                    ...updatedDialogues[findIndexDialogue],
                    lengthMessages: updatedDialogues[findIndexDialogue].listDates.filter(item => new Date(String(item)).getTime() > new Date(String(privatKey.date)).getTime()).length,
                    status: userStatus.status
                };

                updatedDialogues[findIndexDialogue] = updatedDialogue;

                setListDialogues(updatedDialogues);
            }
        }
    }, [userStatus, setUserStatus, privatKey])

    useEffect(() => {
        if (listInfoDialogues?.data?.length && privatKey) {
            const fetchDialogues = async () => {
                const accessListInfoDialogues = listInfoDialogues.data.filter(dialogue => (new Date(dialogue.dateMessage).getTime() > new Date(privatKey.date).getTime()))
                const decListDialogues = await Promise.all(accessListInfoDialogues.map(async (dialogue) => {
                    if (typeof dialogue.lastMessage !== 'object') {
                        const messageList = dialogue.lastMessage.split('\n');

                        let decMessage;
                        // Для бота т.к. его сообщения формируются на сервере
                        // и не закодированы
                        if (messageList.length === 2) {
                            try {
                                const arrBufferMessage = base64ToArrayBuffer(messageList[1].trim());
                                decMessage = await decryptText(arrBufferMessage, privatKey.data)
                            } catch (err) {
                                console.log(err);
                                decMessage = messageList[1];
                            }
                            if (decMessage) {
                                const allMessage = messageList[0].trim() + ' \n ' + decMessage;
                                return { ...dialogue, lastMessage: allMessage };
                            }
                        } else {
                            try {
                                const arrBufferMessage = base64ToArrayBuffer(JSON.parse(dialogue.lastMessage));
                                decMessage = await decryptText(arrBufferMessage, privatKey.data)
                            } catch (err) {
                                console.log(err);
                                decMessage = dialogue.lastMessage;
                            }

                            if (decMessage) {
                                dispatch(addMessageLen({ id: dialogue.userId, numberMessages: dialogue.listDates.filter(item => new Date(String(item)).getTime() > new Date(String(privatKey.date)).getTime()).length }))
                                return { ...dialogue, lengthMessages: dialogue.listDates.filter(item => new Date(String(item)).getTime() > new Date(String(privatKey.date)).getTime()).length, lastMessage: decMessage };
                            }
                        }
                    }
                })) as DialogueData[]

                try {

                    await Promise.all(decListDialogues.map(async (dialogue) => {
                        await cacheDialogue(dialogue);
                    }))

                    console.log('Диалоги успешно сохранены в кеш', decListDialogues);
                } catch (error) {
                    console.error('Ошибка при сохранении в кеш:', error);
                }
                setListDialogues(decListDialogues)

            }

            fetchDialogues()
        }
    }, [listInfoDialogues?.data?.length, isListInfoDialoguesLoading,])

    useEffect(() => {

        (async () => {

            const cached = await getCachedDialogues();

            if (cached.length > 0) {
                setListCachedDialogues(cached.map(cache => ({ ...cache, isCache: true })))
            }
        })()
    }, [searchParams.get('user'),])

    useEffect(() => {
        if (pathname) {
            // По этим путям включаем демо header
            setIsDemoHeader(['/registration', '/login', '/profile', '/update-profile', '/check-pin'].includes(pathname))
        }

    }, [pathname,])

    const onSearchUsers = (e: ChangeEvent<HTMLInputElement>) => {

        const { value } = e.target;
        setSearchUsers(value);
    }

    useEffect(() => {
        setSearchUsers('')
    }, [searchParams?.get('tab')])

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [])

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            {isListInfoDialoguesLoading && <Loader isFade={true} />}
            <div className="max-w-full w-full h-full">
                <Header isDemoHeader={isDemoHeader || (!userInfo?.id && !authData?.user.id)}
                    isWelcomePage={(!['/login', '/registration', '/profile'].includes(String(pathname))) && (!userInfo?.id && !authData?.user.id)} />
                <div className="w-full max-w-full h-full pt-[66px] flex max-lg:min-w-full relative">
                    {sideBarState.isShow && !isDemoHeader && (userInfo?.id || authData?.user.id) && (
                        <SideBar
                            isListInfoDialoguesLoading={isListInfoDialoguesLoading && !listCachedDialogues?.length}
                            isDisableFindUsers={!isOnline}
                            findUsers={findUsers?.users || []}
                            dialoguesData={listDialogues || listCachedDialogues || []}
                            onSearchUsers={onSearchUsers}
                            searchUsers={searchUsers}
                        >
                            {(searchParams.get('tab') === 'users') && isFindUsersLoading && sideBarState.isShow && !isDemoHeader && (userInfo?.id || authData?.user.id) && (<div className='absolute top-0 pt-[170px] max-lg:pt-[0px] w-full left-0'><SkeletonLayoutList length={3} /></div>)}
                            {(searchParams.get('tab') === 'chats') && !listDialogues?.length && isListInfoDialoguesLoading && sideBarState.isShow && !isDemoHeader && (userInfo?.id || authData?.user.id) && !listCachedDialogues?.length && (<div className='absolute top-0 pt-[100px] max-lg:pt-[0px] w-full left-0'><SkeletonLayoutList length={3} /></div>)}
                        </SideBar>
                    )}
                    {children}
                </div>
                {!authData?.user?.id && !userInfo?.id && (
                    <div className="relative bottom-[41px]">
                        <Footer />
                    </div>
                )}
            </div>
        </Suspense>
    )
}

export default Layout