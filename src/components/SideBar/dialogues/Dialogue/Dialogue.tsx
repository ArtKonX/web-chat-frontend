import React, { useEffect, useState } from 'react';

import UserIcon from "@/components/ui/UserIcon/UserIcon"
import { DialogueProps } from "@/interfaces/components/side-bar"
// import Link from "next/link"

import { useMediaPredicate } from 'react-media-hook';
import { useDispatch } from 'react-redux';
import { toggleSideBar } from '@/redux/slices/sideBarSlice';
import useUrl from '@/hooks/useUrl';
import { useRouter, useSearchParams } from 'next/navigation';

const Dialogue = (
    { id, name, isActiveUser,
        status, profileColor,
        quantityMessages, lastMassage, isCache }: DialogueProps
) => {

    const dispatch = useDispatch();

    const { url } = useUrl()

    const router = useRouter()
    const searchParams = useSearchParams()

    const [isSend, setIsSend] = useState(false);

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    const closeSideBarMobile = () => {
        if (isMobile) {
            dispatch(toggleSideBar());
        }

        if (url) {
            // href={`/?tab=chats&user=${id}`}
            if (searchParams.get('tab') !== 'chats') {
                url.searchParams.set('tab', 'chats')
            }

            if (searchParams.get('user')) {
                url.searchParams.delete('user');
                router?.push(url.href)
                setIsSend(true)
            }

            console.log(searchParams.get('user'))
        }
    }

    useEffect(() => {
        if (!searchParams.get('user') && url && isSend) {

            url.searchParams.set('user', id)

            router?.push(url.href)
            setIsSend(false)
        }
    }, [searchParams.get('user'), isSend, setIsSend])

    return (
        <button
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
                    <p className="text-start w-40 overflow-x-hidden max-lg:max-w-[250px] max-lg:w-full text-nowrap overflow-ellipsis">
                        {lastMassage}
                    </p>
                </div>
            </div>
            <span className={`px-3.5 py-1.5 text-xl rounded-full border-2 font-bold ${isActiveUser ?
                'bg-black text-amber-400/50 border-amber-400/50' :
                'bg-amber-400/50 border-black'}`}>
                {quantityMessages}
            </span>
        </button>
    )
}

export default Dialogue