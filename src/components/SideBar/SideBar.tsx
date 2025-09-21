'use client'

import React, { Suspense } from 'react';

import { useSearchParams } from "next/navigation"
import SideBarInputSearch from "./SideBarInputSearch/SideBarInputSearch"
import SearchUsersWithActionList from "./search-users-sidebar/SearchUsersWithActionList/SearchUsersWithActionList"
import DialoguesList from "./dialogues/DialoguesList/DialoguesList"
import SideBarActionLink from "./SideBarLink/SideBarLink"
import messageIcon from '../../../public/svg/messages.svg';
import usersIcon from '../../../public/svg/group-users.svg';
import { SideBarProps } from "@/interfaces/components/side-bar"
import Loader from '../ui/Loader/Loader';

const SideBar = (
    { findUsers, dialoguesData, onSearchUsers, searchUsers, isDisableFindUsers }: SideBarProps
) => {

    const searchParams = useSearchParams()

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <div className="w-2/7 max-sm:pt-[66px] max-lg:pt-[66px] max-sm:w-full bg-white h-full max-lg:min-w-[220px] px-5 border-r-2">
                <div className="w-full h-full pt-10 relative">
                    <h3 className="text-center text-lg font-bold max-sm:text-[20px]">
                        {searchParams!.get('tab') == 'chats' ?
                            'Все ваши сообщения:' : findUsers.length > 0 ?
                                `Всего найдено пользователей ${findUsers.length}:` :
                                'Пользователи не найдены'
                        }
                    </h3>
                    {searchParams!.get('tab') == 'users' && (
                        <SideBarInputSearch onSearchUsers={onSearchUsers} searchUsers={searchUsers} />
                    )}
                    {searchParams!.get('tab') == 'users' && findUsers && (
                        <div className="w-full flex justify-center">
                            <div className="mt-10 w-full">
                                <SearchUsersWithActionList usersData={findUsers} />
                            </div>
                        </div>
                    )}
                    {searchParams!.get('tab') == 'chats' && dialoguesData?.length > 0 ? (
                        <DialoguesList dialoguesData={dialoguesData} />
                    ) : searchParams!.get('tab') === 'users' ? null : <span className="w-full flex justify-center mt-5 font-bold max-sm:text-[18px] max-sm:text-center">У вас нет сообщений(</span>}
                    <div className="w-full absolute bottom-0 pb-1 pt-2 flex justify-around border-t-2">
                        <SideBarActionLink isActive={searchParams!.get('tab') === 'chats'} icon={messageIcon} alt='сообщения' href='/?tab=chats' />
                        <SideBarActionLink isDisable={isDisableFindUsers} isActive={searchParams!.get('tab') === 'users'} icon={usersIcon} alt='пользователи' href='/?tab=users&q=' />
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default SideBar