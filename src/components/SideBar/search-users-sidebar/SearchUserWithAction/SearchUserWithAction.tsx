import React from 'react';

import UserIcon from "@/components/ui/UserIcon/UserIcon"
import { UserData } from "@/interfaces/users"
import Link from "next/link"
import { useDispatch } from 'react-redux';
import { useMediaPredicate } from 'react-media-hook';
import { toggleSideBar } from '@/redux/slices/sideBarSlice';

const SearchUserWithAction = (
    { id, name, email, color_profile }: UserData
) => {

    const dispatch = useDispatch();

    const isMobile = useMediaPredicate('(max-width: 1023px)');

    const closeSideBarMobile = () => {
        if (isMobile) {
            dispatch(toggleSideBar());
        }
    }

    return (
        <Link href={`/?tab=chats&user=${id}`}
            className='flex w-full justify-start items-center max-sm:items-end border-b-2 border-[#E1E3E6] py-2 mb-5'
            onClick={closeSideBarMobile}>
            <UserIcon nameFirstSymbol={name && name[0]} colorBackgroundIcon={color_profile} />
            <div className='flex flex-col dark:text-[#E1E3E6] max-sm:text-[15px] ml-4'>
                <span>
                    {!isMobile && name?.length > 20 ? name.slice(0, 15) + '...' : isMobile && name?.length > 30 ? name.slice(0, 20) + '...' : name}
                </span>
                <span>
                    {!isMobile && email?.length > 20 ? email.slice(0, 15) + '...' : isMobile && email?.length > 30 ? email.slice(0, 20) + '...' : email}
                </span>
            </div>
        </Link>
    )
}

export default SearchUserWithAction