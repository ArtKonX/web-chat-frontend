import React from 'react';

import { HeaderBurgerProps } from "@/interfaces/components/header"

const HeaderBurger = (
    { showSideBar }: HeaderBurgerProps
) => {

    return (
        <button onClick={showSideBar}
            data-testid="header-burger-button"
            className="mr-10 dark:text-[#E1E3E6]! max-sm:mr-2 text-5xl cursor-pointer
        relative -top-0 hover:opacity-65 transition-opacity
        duration-700"
            type="button">
            ≡
        </button>
    )
}

export default HeaderBurger