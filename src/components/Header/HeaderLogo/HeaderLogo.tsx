import React from 'react';

import Link from "next/link"

const HeaderLogo = () => {

    return (
        <Link href={'/'} data-testid="header-logo" className="flex flex-col bg-amber-400/50 max-w-12 h-12 w-12 mr-3
        rounded-b-4xl rounded-t-lg items-center justify-center
        border-2 cursor-pointer
        hover:bg-black hover:border-amber-400 hover:text-amber-400
        hover:opacity-85 transition-colors duration-900 relative max-sm:max-w-11 max-sm:max-h-11">
            <span className="font-bold text-xl max-sm:text-[17px] z-10 absolute top-0 ">
                K
            </span>
            <span className="absolute bottom-0 font-bold text-md max-sm:text-[13px]">
                ⚔️
            </span>
            <span className="absolute -bottom-2 -right-9 font-bold max-sm:text-[13px] max-sm:left-10">Beta</span>
        </Link>
    )
}

export default HeaderLogo