import React from 'react';

import { UserIconProps } from "@/interfaces/components/ui";
import { useEffect, useRef } from "react"

const UserIcon = (
    { nameFirstSymbol, colorBackgroundIcon, status }: UserIconProps) => {

    const refIcon = useRef<HTMLSpanElement | null>(null);

    useEffect(() => {
        if (refIcon.current && colorBackgroundIcon) {
            refIcon.current.style.backgroundColor = colorBackgroundIcon;
        }
    }, [colorBackgroundIcon])

    return (
        <span ref={refIcon} className={`max-sm:text-[19px] flex min-w-[43px] min-h-[43px]
            items-center justify-center text-xl
            rounded-full font-bold
        text-gray-200 border-2 border-dashed
        border-gray-600 dark:border-[#E1E3E6]! relative ${colorBackgroundIcon}`}>
            {nameFirstSymbol}
            {status ? (
                <span className='absolute -right-[6px] -top-[8px] rounded-full p-[9px] bg-amber-500 border-1 border-bg-amber-500 border-black' />
            ) : null}
        </span>
    )
}

export default UserIcon