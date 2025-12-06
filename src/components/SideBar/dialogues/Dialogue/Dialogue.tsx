import React, { useEffect, useRef, useState } from 'react';

import UserIcon from "@/components/ui/UserIcon/UserIcon"
import { DialogueProps } from "@/interfaces/components/side-bar"
import Link from "next/link"

import { useMediaPredicate } from 'react-media-hook';
import { useDispatch } from 'react-redux';
import { toggleSideBar } from '@/redux/slices/sideBarSlice';
import WebSocketConnection from '@/components/WebSocketConnection/WebSocketConnection';

const Dialogue = (
    { id, name, isActiveUser,
        status, profileColor,
        quantityMessages, lastMassage, isCache }: DialogueProps
) => {

    const dispatch = useDispatch();

    const refLink = useRef<HTMLAnchorElement | null>(null);
    const [containerWidth, setContainerWidth] = useState(185);

    const { setIsLastMessage } = WebSocketConnection();

    const isMobile = useMediaPredicate('(max-width: 1023px)');

    const closeSideBarMobile = () => {
        setIsLastMessage(false)
        if (isMobile) {
            dispatch(toggleSideBar());
        }
    }

    useEffect(() => {
        if (!refLink.current) return;

        const observer = new ResizeObserver(entries => {
            for (const entry of entries) {
                setContainerWidth(entry.contentRect.width);
            }
        });

        observer.observe(refLink.current);
        return () => observer.disconnect();
    }, []);

    return (
        <Link ref={refLink} href={`/?tab=chats&user=${id}`}
            className={`hover:opacity-60 flex transition-opacity max-lg:justify-between justify-between duration-700 cursor-pointer relative
        ${isActiveUser ? 'border-amber-400 opacity-50 pointer-events-none' :
                    'border-black'} pb-2 flex items-center border-b-2 justify-around max-lg:w-full ${isCache ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={closeSideBarMobile}>
            <div className='flex justify-center items-center'>
                <UserIcon status={status}
                    nameFirstSymbol={name?.length ?
                        String(name[0]) : ''}
                    colorBackgroundIcon={profileColor} />
                <div className='flex flex-col justify-start items-start ml-4 max-lg:ml-10'>
                    <span style={{ width: containerWidth - 110 }} data-testid="user-name" className='font-bold text-start overflow-x-hidden overflow-ellipsis max-lg:max-w-[full] max-lg:w-full text-nowrap'>
                        {name}
                    </span>
                    <p style={{ width: containerWidth - 110 }} className={`text-start overflow-x-hidden overflow-ellipsis max-lg:max-w-[full] max-lg:w-full text-nowrap`}>
                        {lastMassage}
                    </p>
                </div>
            </div>
            <span className={`px-3.5 py-1.5 text-xl ${Number(quantityMessages) > 9 ? 'relative right-[5px]' : Number(quantityMessages) > 99 ? 'relative right-[17px]' : ''} rounded-full border-2 font-bold ${isActiveUser ?
                'bg-black text-amber-400/50 border-amber-400/50' :
                'bg-amber-400/50 border-black'}`}>
                {Number(quantityMessages) > 99 ? '99+' : quantityMessages}
            </span>
        </Link>
    )
}

export default Dialogue