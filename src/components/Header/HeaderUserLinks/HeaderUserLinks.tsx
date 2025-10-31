import React, { useEffect, useRef } from 'react';

import GeoCityName from "@/components/ui/GeoCityName/GeoCityName";
import UserIcon from "@/components/ui/UserIcon/UserIcon";
import useUrl from "@/hooks/useUrl";
import { HeaderUserLinksProps } from "@/interfaces/components/header";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const HeaderUserLinks = (
    { city, userName, colorBackgroundIcon, isDisable }: HeaderUserLinksProps
) => {
    const router = useRouter();

    const { url } = useUrl();

    const newParams = useRef<URLSearchParams | null>(null);

    const searchParams = useSearchParams();

    const onSwitchingOnShowCities = () => {
        if (!url || !newParams.current) return;

        newParams.current.set('city', city);
        newParams.current.delete('showMapCities');
        newParams.current.set('showSelectedCities', 'true');

        const newUrl = `${url.pathname}?${newParams.current.toString()}`;

        router.push(newUrl);
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search) {
            newParams.current = new URLSearchParams(window.location.search);
        }
    }, [window.location.search, searchParams?.get('tab')]);

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