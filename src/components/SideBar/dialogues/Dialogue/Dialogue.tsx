import React from 'react';

import UserIcon from "@/components/ui/UserIcon/UserIcon"
import { DialogueProps } from "@/interfaces/components/side-bar"
import Link from "next/link"

const Dialogue = (
    { id, name, isActiveUser,
        status, profileColor,
        quantityMessages, lastMassage }: DialogueProps
) => {

    return (
        <Link href={`/?tab=chats&user=${id}`}
            className={`hover:opacity-60 transition-opacity duration-700 cursor-pointer relative
        ${isActiveUser ? 'border-amber-400 opacity-50 pointer-events-none' :
                    'border-black'} pb-2 mt-10 flex items-center border-b-2 justify-around`}>
            <UserIcon status={status}
                nameFirstSymbol={name?.length ?
                    String(name[0]) : ''}
                colorBackgroundIcon={profileColor} />
            <div className='flex flex-col ml-4'>
                <span className='font-bold'>
                    {name}
                </span>
                <p className="w-40 overflow-x-hidden text-nowrap overflow-ellipsis">
                    {lastMassage}
                </p>
            </div>
            <span className={`max-lg:hidden max-md:hidden px-3.5 py-1.5 text-xl rounded-full border-2 font-bold ${isActiveUser ?
                'bg-black text-amber-400/50 border-amber-400/50' :
                'bg-amber-400/50 border-black'}`}>
                {quantityMessages}
            </span>
        </Link>
    )
}

export default Dialogue