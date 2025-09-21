'use client'

import React from 'react';

import { useEffect, useRef, useState } from "react";
import MessageItem from "../MessageItem/MessageItem";
import Btn from "@/components/ui/Btn/Btn";
import { useRouter, useSearchParams } from "next/navigation";
import useUrl from "@/hooks/useUrl";
import SkeletonMessagesList from "@/components/skeleton-messages/SkeletonMessagesList/SkeletonMessagesList";
import { MessagesListProps } from "@/interfaces/components/messages-components";

const MessageList = (
    { messages, wsMessages, currentUser,
        anotherAuthorName, setCurrentOffSet,
        dataNextLength, isLoadingMessages, userId,
    }: MessagesListProps
) => {

    const messagesListRef = useRef<HTMLUListElement>(null);
    const { url } = useUrl();

    const router = useRouter();

    const searchParams = useSearchParams();

    const [isScroll, setIsScroll] = useState(false);

    // функция для автоматической плавной прокрутки при получении нового сообщения
    // либо если сообщения не влезают в область видимости
    const scrollToBottom = () => {
        if (messagesListRef.current) {
            messagesListRef.current.scroll({
                top: messagesListRef.current.scrollHeight,
                behavior: 'smooth'
            });
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
    }, [searchParams?.get('user'), wsMessages.length,]);

    return (
        <ul
            ref={messagesListRef}
            className={`overflow-y-auto max-sm:mx-2 max-sm:pr-0 mx-12 pr-6 relative max-sm:-top-23 max-sm:h-[83%] h-full ${isScroll && 'overflow-y-hidden'}`}
        >
            {dataNextLength?.isNextMessages ? (
                <li className="flex justify-center items-center my-5 pb-4 bg-amber-100/90 rounded-3xl">
                    <Btn text="Показать больше" type="button" onAction={onOffset} />
                </li>) : null
            }
            {isLoadingMessages && dataNextLength?.lengthNextMessages ?
                <SkeletonMessagesList length={dataNextLength?.lengthNextMessages} /> :
                isLoadingMessages && !dataNextLength?.lengthNextMessages ?
                    <SkeletonMessagesList length={10} /> :
                    null}
            {messages.map((message, indx) => (
                <li
                    key={message.id}
                    id={String(indx)}
                    className={`flex ${currentUser?.id === message?.sender_id ?
                        'justify-start' :
                        'justify-end'} mb-15 mt-10`}
                >
                    <MessageItem
                        currentId={currentUser}
                        message={message}
                        anotherAuthorName={anotherAuthorName}
                        setIsScroll={setIsScroll}
                    />
                </li>
            ))}
        </ul>
    )
}

export default MessageList