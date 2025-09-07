import React from 'react';

import { LinkNavigateProps } from "@/interfaces/components/ui"
import Link from "next/link"

const LinkNavigate = (
    { path, text }: LinkNavigateProps) => {

    return (
        <Link href={path} className="mt-4 bg-amber-400/50 py-2
                px-5 text-lg rounded-lg font-bold
                hover:opacity-80 transition-opacity
                duration-400 cursor-pointer
                max-sm:px-2 max-sm:py-3 max-sm:text-[17px]">{text}</Link>
    )
}

export default LinkNavigate