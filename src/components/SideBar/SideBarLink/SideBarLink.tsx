import React from 'react';

import { SideBarActionLinkProps } from "@/interfaces/components/side-bar"
import Link from "next/link"

const SideBarActionLink = (
    { icon, alt, href, isActive, isDisable }: SideBarActionLinkProps) => {

    return (
        <Link className={`hover:opacity-45 transition-opacity duration-700 ${isActive && 'opacity-30'} ${isDisable && 'pointer-events-none opacity-30'}`} href={href}>
            <img src={icon.src} className='w-[40px]' alt={alt} />
        </Link>
    )
}

export default SideBarActionLink