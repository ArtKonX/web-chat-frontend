import React from 'react';

import UserIcon from "@/components/ui/UserIcon/UserIcon"
import { UserData } from "@/interfaces/users"
import Link from "next/link"

const SearchUserWithAction = (
    { id, name, email, color_profile }: UserData
) => {

    return (
        <Link href={`/?tab=chats&user=${id}`} className='flex w-full justify-start items-center max-sm:items-end border-b-2 py-2 mb-5'>
            <UserIcon nameFirstSymbol={name[0] && name[0]} colorBackgroundIcon={color_profile} />
            <div className='flex flex-col max-sm:text-[15px] ml-4'>
                <span>
                    {name}
                </span>
                <span>
                    {email}
                </span>
            </div>
        </Link>
    )
}

export default SearchUserWithAction