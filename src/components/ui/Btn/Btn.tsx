import React from 'react';

import { BtnProps } from "@/interfaces/components/ui"

const Btn = ({ text, type, onAction, disable }: BtnProps) => {

    return (
        <button className={`mt-4 bg-amber-400/50 py-2
        px-5 text-lg rounded-lg font-bold
        hover:opacity-80 transition-opacity
        duration-400 cursor-pointer disabled:opacity-65
        max-sm:px-2 max-sm:py-3 max-sm:text-[17px] dark:text-[#E1E3E6] dark:bg-[#ebaf18eb]`}
            onClick={onAction}
            type={type}
            disabled={disable}
        >
            {text}
        </button>
    )
}

export default Btn