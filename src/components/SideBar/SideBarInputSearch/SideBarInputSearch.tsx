import React from 'react';

import { SideBarInputSearchProps } from "@/interfaces/components/side-bar"

const SideBarInputSearch = (
    { onSearchUsers, searchUsers }: SideBarInputSearchProps
) => {

    return (
        <input className={`w-full mt-5 p-1.5 rounded-xl px-3 outline-0 border-2
            focus:border-amber-400/50 hover:border-amber-400/50
            transition-all duration-400`}
            type="text" onChange={onSearchUsers} value={searchUsers}
        />
    )
}

export default SideBarInputSearch