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
import { useMediaPredicate } from 'react-media-hook';

const SideBar = (
    { findUsers, dialoguesData, onSearchUsers, searchUsers, isDisableFindUsers, isListInfoDialoguesLoading, children }: SideBarProps
) => {

    const searchParams = useSearchParams()

    const isMobile = useMediaPredicate('(max-width: 1033px)');

    return (
        <Suspense fallback={<Loader isFade={true} />}>
            <div data-testid="sidebar" className={`min-w-2/7 pt-[27px] dark:border-black max-sm:w-full bg-white dark:bg-[#212121] h-full px-5 ${!isMobile ? 'border-r-2' : ''} max-lg:min-w-full z-1`}>
                <div className="w-full h-full relative">
                    <h3 data-testid="search-users-title" className={`text-center text-lg dark:text-[#E1E3E6] font-bold max-sm:text-[20px] ${isMobile ? 'pt-[20px]' : ''}`}>
                        {searchParams!.get('tab') == 'chats' ?
                            'Все ваши сообщения:' : findUsers.length > 0 ?
                                `Всего найдено пользователей ${findUsers.length}:` :
                                'Пользователи не найдены'
                        }
                    </h3>
                    {children}
                    {searchParams!.get('tab') == 'users' && (
                        <SideBarInputSearch onSearchUsers={onSearchUsers} searchUsers={searchUsers} />
                    )}
                    {searchParams!.get('tab') == 'users' && findUsers && (
                        <div className="w-full h-full flex justify-center pb-45">
                            <div className="mt-5 w-full mb-100 px-2 py-3 h-[calc(100%)] overflow-y-auto">
                                <SearchUsersWithActionList usersData={findUsers} />
                            </div>
                        </div>
                    )}
                    {searchParams!.get('tab') == 'chats' && dialoguesData?.length > 0 ? (
                        <div className="w-full h-full flex justify-center pb-30">
                            <div className="mt-5 w-full mb-100 px-2 py-3 h-[calc(100%)] overflow-y-auto">
                                <DialoguesList dialoguesData={dialoguesData} />
                            </div>
                        </div>
                    ) : searchParams!.get('tab') === 'users' ? null : !isListInfoDialoguesLoading ? <span className="w-full flex justify-center mt-5 font-bold max-sm:text-[18px] max-sm:text-center">У вас нет сообщений(</span> : null}
                    <div className="w-full absolute bottom-0 pb-1 pt-2 dark:mb-2 dark:bg-[#E1E3E6] dark:rounded-xl dark:border-[#E1E3E6] flex justify-around border-t-2 bg-white">
                        <SideBarActionLink isActive={searchParams!.get('tab') === 'chats'} icon={messageIcon} alt='сообщения' href='/?tab=chats' />
                        <SideBarActionLink isDisable={isDisableFindUsers} isActive={searchParams!.get('tab') === 'users'} icon={usersIcon} alt='пользователи' href='/?tab=users&q=' />
                    </div>
                </div>
            </div>
        </Suspense>
    )
}

export default SideBar