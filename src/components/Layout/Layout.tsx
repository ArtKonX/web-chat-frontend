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

const Layout = (
    { children }: { children: ReactNode }
) => {

    const searchParams = useSearchParams();

    const sideBarState = useSelector(selectSideBarState);
    const tokenState = useSelector(selectTokenState)

    const { data: authData } = useCheckAuthQuery({ token: tokenState?.token });

    const pathname = usePathname();
    const [isDemoHeader, setIsDemoHeader] = useState(false);
    const [searchUsers, setSearchUsers] = useState('');
    const searchUsersDebounce = useDebounce(searchUsers, 400);
    const { data: findUsers, isLoading: isFindUsersLoading } = useGetUsersQuery({ q: searchUsersDebounce, currentId: authData?.user?.id, token: tokenState.token });
    const { data: listInfoDialogues, isLoading: isListInfoDialoguesLoading } = useGetInfoDialoguesQuery({ userId: authData?.user?.id, token: tokenState.token });
    const { socket, wsInfoDialogues, setWsInfoDialogues, userStatus, setUserStatus } = WebSocketConnection();
    const [listDialogues, setListDialogues] = useState<DialogueData[] | null>(null);

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
                        (![wsInfoDialogues.recipient_id, wsInfoDialogues.sender_id].includes(dialogue.recipient_id))
                        || (![wsInfoDialogues.recipient_id, wsInfoDialogues.sender_id].includes(dialogue.sender_id))) as DialogueData[]
                    filteredAllListDialogues.unshift(wsInfoDialogues)

                    setListDialogues(filteredAllListDialogues)
                }
            }
        }


        fetchDialogues()
    }, [wsInfoDialogues, setWsInfoDialogues])

    useEffect(() => {
        if (listDialogues && userStatus) {
            const findIndexDialogue = listDialogues.findIndex(dialogue => dialogue.userId === userStatus.userId);

            if (findIndexDialogue !== -1) {
                const updatedDialogues = [...listDialogues];

                const updatedDialogue = {
                    ...updatedDialogues[findIndexDialogue],
                    status: userStatus.status
                };

                updatedDialogues[findIndexDialogue] = updatedDialogue;

                setListDialogues(updatedDialogues);
            }
        }
    }, [userStatus, setUserStatus])

    useEffect(() => {
        if (listInfoDialogues?.data?.length && privatKey) {
            const fetchDialogues = async () => {
                const decListDialogues = await Promise.all(listInfoDialogues?.data.map(async (dialogue) => {
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
                            return { ...dialogue, lastMessage: decMessage };
                        }
                    }
                })) as DialogueData[]

                const userId = searchParams.get('user');

                try {
                    if (userId) {

                        await Promise.all(decListDialogues.map(async (dialogue) => {
                            await cacheDialogue(dialogue);
                        }))

                        console.log('Диалоги успешно сохранены в кеш', decListDialogues);
                    }
                } catch (error) {
                    console.error('Ошибка при сохранении в кеш:', error);
                }
                setListDialogues(decListDialogues)
            }

            fetchDialogues()
        }
    }, [listInfoDialogues?.data?.length, isListInfoDialoguesLoading,])

    useEffect(() => {
        const userId = searchParams.get('user');

        (async () => {
            if (userId) {

                const cached = await getCachedDialogues();

                if (cached.length > 0) {
                    setListDialogues(cached)
                }
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
            <div className="max-w-full w-full h-full">
                <Header isDemoHeader={isDemoHeader || (!userInfo?.id && !authData?.user.id)}
                    isWelcomePage={!['/login', '/registration'].includes(String(pathname)) && (!userInfo?.id && !authData?.user.id)} />
                <div className="w-full max-w-full h-full pt-[66px] flex max-lg:pt-[0px] max-lg:min-w-full max-lg:h-[calc(100%+22px)] relative">
                    {sideBarState.isShow && !isDemoHeader && (userInfo?.id || authData?.user.id) && (
                        <SideBar
                            isListInfoDialoguesLoading={isListInfoDialoguesLoading}
                            isDisableFindUsers={!isOnline}
                            findUsers={findUsers?.users || []}
                            dialoguesData={listDialogues || []}
                            onSearchUsers={onSearchUsers}
                            searchUsers={searchUsers}
                        >
                            {(searchParams.get('tab') === 'users') && isFindUsersLoading && sideBarState.isShow && !isDemoHeader && (userInfo?.id || authData?.user.id) && (<div className='absolute top-0 pt-[170px] max-lg:pt-[0px] w-full left-0'><SkeletonLayoutList length={3} /></div>)}
                            {(searchParams.get('tab') === 'chats') && !listDialogues?.length && isListInfoDialoguesLoading && sideBarState.isShow && !isDemoHeader && !listDialogues?.length && (userInfo?.id || authData?.user.id) && (<div className='absolute top-0 pt-[100px] max-lg:pt-[0px] w-full left-0'><SkeletonLayoutList length={3} /></div>)}
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