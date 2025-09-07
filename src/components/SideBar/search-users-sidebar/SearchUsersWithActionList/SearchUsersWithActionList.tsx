import { SearchUsersWithActionListProps } from "@/interfaces/components/side-bar"
import SearchUserWithAction from "../SearchUserWithAction/SearchUserWithAction"

const SearchUsersWithActionList = (
    { usersData }: SearchUsersWithActionListProps
) => {

    return (
        <ul className="w-full max-h-full overflow-auto">
            {usersData?.map(user => (
                <li key={user.id}>
                    <SearchUserWithAction {...user} />
                </li>
            ))}
        </ul>
    )
}

export default SearchUsersWithActionList