'use client'

import React from 'react';

import { useEffect, useRef, useState } from "react";
import MessageItem from "../MessageItem/MessageItem";
import Btn from "@/components/ui/Btn/Btn";
import { useRouter, useSearchParams } from "next/navigation";
import useUrl from "@/hooks/useUrl";
import { MessagesListProps } from "@/interfaces/components/messages-components";
import { useMediaPredicate } from 'react-media-hook';

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

    const searchParams = useSearchParams();

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    const [isScroll, setIsScroll] = useState(false);

    // функция для автоматической плавной прокрутки при получении нового сообщения
    // либо если сообщения не влезают в область видимости
    const scrollToBottom = () => {
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
        console.log(isScroll)
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
    }, [searchParams?.get('user'), wsMessages.length,]);

    return (
        <ul data-testid="message-list"
            ref={messagesListRef}
            className={`message-list overflow-y-auto max-sm:mx-2 max-sm:pr-0 mx-12 pr-6 relative h-full ${isMobile ? 'pt-[40px]' : 'pt-[50px]'}`}
        >
            {dataNextLength?.isNextMessages && isOnline && !caсheMessages.length ? (
                <li className="flex justify-center items-center my-5 pb-4 bg-amber-100/90 rounded-3xl">
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
                                className={`flex ${currentUser?.id === message?.sender_id ?
                                    'justify-start' :
                                    'justify-end'} mb-15 ${indx !== 0 ? 'mt-10' : ''}`}
                            >
                                <MessageItem
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