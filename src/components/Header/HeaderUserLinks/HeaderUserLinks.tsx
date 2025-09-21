import React from 'react';

import GeoCityName from "@/components/ui/GeoCityName/GeoCityName";
import UserIcon from "@/components/ui/UserIcon/UserIcon";
import useUrl from "@/hooks/useUrl";
import { HeaderUserLinksProps } from "@/interfaces/components/header";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HeaderUserLinks = (
    { city, userName, colorBackgroundIcon, isDisable }: HeaderUserLinksProps
) => {
    const router = useRouter();

    const { url } = useUrl();

    const onSwitchingOnShowCities = () => {
        // Задаем параметр показа выбора городов
        if (url) {
            url.searchParams.set('city', city);
            url.searchParams.delete('showMapCities');
            url.searchParams.set('showSelectedCities', 'true');

            router.push(url.href)
        }
    }

    return (
        <div className="flex items-center">
            <button disabled={isDisable}
                onClick={onSwitchingOnShowCities}
                className="cursor-pointer hover:opacity-70 duration-300
                transition-opacity disabled:opacity-70 disabled:cursor-auto"
            >
                <GeoCityName city={city} />
            </button>
            <Link href={`/profile`} className={`${isDisable && 'pointer-events-none cursor-auto hover:opacity-60 opacity-60'} hover:opacity-60 duration-500 transition-opacity`}>
                <UserIcon nameFirstSymbol={userName && userName[0]}
                    colorBackgroundIcon={colorBackgroundIcon} />
            </Link>
        </div>
    )
}

export default HeaderUserLinks