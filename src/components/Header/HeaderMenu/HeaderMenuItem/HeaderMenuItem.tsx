import React from 'react';

import { HeaderMenuItemProps } from "@/interfaces/components/header";
import Link from "next/link"
import { usePathname } from "next/navigation";

const HeaderMenuItem = (
    { text, href }: HeaderMenuItemProps) => {

    const path = usePathname();

    const isActive = () => {
        if (href === '/') {
            return path === href;
        }

        const currentHref = href.split('/')[1];
        const currentPath = String(path).split('/')[1];

        return currentHref === currentPath;
    }

    return (
        <Link className={`font-bold text-[19px] ${isActive() ?
            'text-amber-600' :
            'text-black'} max-sm:text-[18px]`} href={href}>{text}</ Link>
    )
}

export default HeaderMenuItem