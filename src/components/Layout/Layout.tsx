'use client'

import React from 'react';

import { ChangeEvent, ReactNode, useEffect, useState } from "react"
import Header from "../Header/Header"
import { usePathname, useSearchParams } from "next/navigation";
import { selectSideBarState, selectUser } from "@/selectors/selectors";
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

const Layout = (
    { children }: { children: ReactNode }
) => {

    const searchParams = useSearchParams();

    const sideBarState = useSelector(selectSideBarState);
    const authState = useSelector(selectUser);

    const pathname = usePathname();
    const [isDemoHeader, setIsDemoHeader] = useState(false);
    const [searchUsers, setSearchUsers] = useState('');
    const searchUsersDebounce = useDebounce(searchUsers, 400);
    const { data: findUsers } = useGetUsersQuery({ q: searchUsersDebounce, currentId: authState?.id });
    const { data: usersOnMessages, isLoading } = useGetInfoDialoguesQuery({ userId: authState?.id });
    const { socket, wsInfoDialogues, setWsInfoDialogues, userStatus, setUserStatus } = WebSocketConnection();
    const [listDialogues, setListDialogues] = useState<DialogueData[] | null>(null);

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
        const fetchDialogues = async () => {
            if (socket && authState?.id) {
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
        if (usersOnMessages?.data?.length && privatKey) {
            const fetchDialogues = async () => {
                const decListDialogues = await Promise.all(usersOnMessages?.data.map(async (dialogue) => {
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

                if (decListDialogues) {
                    setListDialogues(decListDialogues)
                }
            }

            fetchDialogues()
        }
    }, [usersOnMessages?.data?.length, isLoading])

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

    return (
        <div className="max-w-full w-full">
            <Header isDemoHeader={isDemoHeader || !authState?.id}
                isWelcomePage={!['/login', '/registration'].includes(String(pathname)) && !authState?.id} />
            <div className="w-full h-screen pt-[66px] flex">
                {sideBarState.isShow && !isDemoHeader && authState?.id && (
                    <SideBar
                        findUsers={findUsers?.users || []}
                        dialoguesData={listDialogues || []}
                        onSearchUsers={onSearchUsers}
                        searchUsers={searchUsers}
                    />
                )}
                {children}
            </div>
            {!authState?.id && (
                <div className="relative bottom-[42px] max-lg:bottom-0">
                    <Footer />
                </div>
            )}
        </div>
    )
}

export default Layout