'use client'

import React from 'react';

import { useEffect, useRef, useState } from "react";
import MessageItem from "../MessageItem/MessageItem";
import Btn from "@/components/ui/Btn/Btn";
import { useRouter, useSearchParams } from "next/navigation";
import useUrl from "@/hooks/useUrl";
import { MessagesListProps } from "@/interfaces/components/messages-components";
import { useMediaPredicate } from 'react-media-hook';
import { selectChangeMessageState } from '@/selectors/selectors';
import { useSelector } from '@/hooks/useTypedSelector';

const MessageList = (
    { messages, wsMessages, currentUser,
        anotherAuthorName, setCurrentOffSet,
        dataNextLength, userId,
        isOnline, caсheMessages, children
    }: MessagesListProps
) => {

    const messagesListRef = useRef<HTMLUListElement>(null);
    const { url } = useUrl();

    const router = useRouter();


    const changeMessageState = useSelector(selectChangeMessageState);

    const searchParams = useSearchParams();

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    const [isScroll, setIsScroll] = useState(false);
    const [isOverflow, setIsOverflow] = useState(false)

    // функция для автоматической плавной прокрутки при получении нового сообщения
    // либо если сообщения не влезают в область видимости
    const scrollToBottom = () => {
        console.log(isScroll)
        if (messagesListRef.current && typeof messagesListRef.current.scroll === 'function') {
            messagesListRef.current.scroll({
                top: messagesListRef.current.scrollHeight,
                behavior: 'smooth',
            });
        } else if (messagesListRef.current) {
            messagesListRef.current.scrollTop = messagesListRef.current.scrollHeight;
        }
    };

    const onOffset = () => {
        if (url && userId) {
            const offSet = searchParams?.get('offset');

            if (offSet) {
                url.searchParams.set('user', userId)
                url?.searchParams.set('offset', String(Number(offSet) + 10))

                router.push(url.href);
                setCurrentOffSet(String(Number(offSet) + 10))
            } else {
                url.searchParams.set('user', userId)
                url?.searchParams.set('offset', '10')
                router.push(url.href);
                setCurrentOffSet('10')
            }
        }
    }

    useEffect(() => {

        scrollToBottom();
    }, [searchParams?.get('user'), wsMessages.length, caсheMessages.length]);

    return (
        <ul data-testid="message-list"
            ref={messagesListRef}
            className={`message-list overflow-y-auto ${isOverflow || changeMessageState.isChange ? 'overflow-y-hidden overflow-x-hidden' : ''} max-sm:mx-2 max-sm:pr-0 mx-8 mr-2 pr-6 ${isMobile ? 'ml-4! mr-0! pr-4!' : ''} relative h-full ${dataNextLength?.isNextMessages && isOnline && !caсheMessages.length && isMobile ? 'pt-[12px]!' : dataNextLength?.isNextMessages && isOnline && !caсheMessages.length && !isMobile ? 'pt-[23px]!' : ''} ${isMobile ? 'pt-[31px]' : 'pt-[23px]'} ${caсheMessages.length && isMobile ? `cache-messages-list-mobile cache-first-messages-${currentUser?.id === caсheMessages[0]?.sender_id ? 'current' : 'another'}-user-mobile` : caсheMessages.length && !isMobile ? `cache-messages-list-desktop cache-first-messages-${currentUser?.id === caсheMessages[0]?.sender_id ? 'current' : 'another'}-user-desktop` : ''}`}
        >
            {dataNextLength?.isNextMessages && isOnline && !caсheMessages.length ? (
                <li className="flex justify-center items-center pb-4 bg-amber-100/90 rounded-3xl mb-[34px]">
                    <Btn text="Показать больше" type="button" onAction={onOffset} />
                </li>) : null
            }
            {children}
            {
                caсheMessages.length && !messages.length ?
                    caсheMessages.map((message, indx) => (
                        <li
                            key={message.id}
                            id={String(indx)}
                            className={`flex ${currentUser?.id === message?.sender_id ?
                                'justify-start' :
                                'justify-end'} mb-15 ${indx !== 0 ? 'mt-10' : ''}`}
                        >
                            <MessageItem
                                setIsOverflow={setIsOverflow}
                                currentId={currentUser}
                                message={message}
                                anotherAuthorName={anotherAuthorName}
                                setIsScroll={setIsScroll}
                                isCache={true}
                            />
                        </li>
                    )) : messages.length && !caсheMessages.length ?
                        messages.map((message, indx) => (
                            <li
                                key={message.id}
                                id={String(indx)}
                                className={`flex ${(currentUser?.id === message?.sender_id) && indx === 0 ? 'message-current-user' : (currentUser?.id !== message?.sender_id) && indx === 0 ? 'message-another-user' : ''} ${currentUser?.id === message?.sender_id ?
                                    'justify-start' :
                                    'justify-end'} mb-15 ${indx !== 0 ? 'mt-10' : ''}`}
                            >
                                <MessageItem
                                    setIsOverflow={setIsOverflow}
                                    currentId={currentUser}
                                    message={message}
                                    anotherAuthorName={anotherAuthorName}
                                    setIsScroll={setIsScroll}
                                />
                            </li>
                        )) : null}
        </ul>
    )
}

export default MessageList