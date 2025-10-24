import React from 'react';

import { SearchUsersWithActionListProps } from "@/interfaces/components/side-bar"
import SearchUserWithAction from "../SearchUserWithAction/SearchUserWithAction"

const SearchUsersWithActionList = (
    { usersData }: SearchUsersWithActionListProps
) => {

    return (
        <ul className="w-full h-full max-h-[80%] overflow-y-auto pr-[15px]">
            {usersData?.map(user => (
                <li key={user.id}>
                    <SearchUserWithAction {...user} />
                </li>
            ))}
        </ul>
    )
}

export default SearchUsersWithActionList