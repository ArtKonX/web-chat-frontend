import React, { useEffect } from 'react';

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

    const { setIsLastMessage, isLastMessage } = WebSocketConnection();

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    const closeSideBarMobile = () => {
        setIsLastMessage(false)
        if (isMobile) {
            dispatch(toggleSideBar());
        }
    }

    useEffect(() => {
        console.log('isLastMessageisLastMessageisLastMessage', isLastMessage)
    }, [isLastMessage])

    return (
        <Link href={`/?tab=chats&user=${id}`}
            className={`hover:opacity-60 flex transition-opacity max-lg:justify-between duration-700 cursor-pointer relative
        ${isActiveUser ? 'border-amber-400 opacity-50 pointer-events-none' :
                    'border-black'} pb-2 flex items-center border-b-2 justify-around max-lg:w-full ${isCache ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={closeSideBarMobile}>
            <div className='flex justify-center items-center'>
                <UserIcon status={status}
                    nameFirstSymbol={name?.length ?
                        String(name[0]) : ''}
                    colorBackgroundIcon={profileColor} />
                <div className='flex flex-col justify-start items-start ml-4 max-lg:ml-10'>
                    <span data-testid="user-name" className='font-bold'>
                        {name}
                    </span>
                    <p className="text-start w-37 overflow-x-hidden max-lg:max-w-[200px] max-lg:w-full text-nowrap overflow-ellipsis">
                        {lastMassage}
                    </p>
                </div>
            </div>
            <span className={`px-3.5 py-1.5 text-xl rounded-full border-2 font-bold ${isActiveUser ?
                'bg-black text-amber-400/50 border-amber-400/50' :
                'bg-amber-400/50 border-black'}`}>
                {quantityMessages}
            </span>
        </Link>
    )
}

export default Dialogue