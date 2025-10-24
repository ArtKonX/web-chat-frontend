import React from 'react';

import UserIcon from "@/components/ui/UserIcon/UserIcon"
import { DialogueProps } from "@/interfaces/components/side-bar"
import Link from "next/link"

import { useMediaPredicate } from 'react-media-hook';
import { useDispatch } from 'react-redux';
import { toggleSideBar } from '@/redux/slices/sideBarSlice';

const Dialogue = (
    { id, name, isActiveUser,
        status, profileColor,
        quantityMessages, lastMassage }: DialogueProps
) => {

    const dispatch = useDispatch();

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    const closeSideBarMobile = () => {
        if (isMobile) {
            dispatch(toggleSideBar());
        }
    }


    return (
        <Link href={`/?tab=chats&user=${id}`}
            className={`hover:opacity-60 transition-opacity max-lg:justify-between duration-700 cursor-pointer relative
        ${isActiveUser ? 'border-amber-400 opacity-50 pointer-events-none' :
                    'border-black'} pb-2 mt-10 flex items-center border-b-2 justify-around max-lg:w-full`}
            onClick={closeSideBarMobile}>
            <div className='flex justify-center items-center'>
                <UserIcon status={status}
                    nameFirstSymbol={name?.length ?
                        String(name[0]) : ''}
                    colorBackgroundIcon={profileColor} />
                <div className='flex flex-col ml-4 max-lg:ml-10'>
                    <span data-testid="user-name" className='font-bold'>
                        {name}
                    </span>
                    <p className="w-40 overflow-x-hidden max-lg:max-w-[250px] max-lg:w-full text-nowrap overflow-ellipsis">
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