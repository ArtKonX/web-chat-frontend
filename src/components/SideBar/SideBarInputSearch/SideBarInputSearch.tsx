import React from 'react';

import { SideBarInputSearchProps } from "@/interfaces/components/side-bar"

const SideBarInputSearch = (
    { onSearchUsers, searchUsers }: SideBarInputSearchProps
) => {

    return (
        <input data-testid="search-input" className={`w-full mt-5 p-1.5 rounded-xl px-3 outline-0 border-2
            focus:border-amber-400/50 hover:border-amber-400/50 dark:bg-[#141414]
            transition-all duration-400 dark:border-[#E1E3E6] dark:text-[#E1E3E6]`}
            type="text" placeholder='Найди пользователя' onChange={onSearchUsers} value={searchUsers}
        />
    )
}

export default SideBarInputSearch