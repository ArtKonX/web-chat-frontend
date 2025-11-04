import React from 'react';

import { ReactNode } from "react"

const WrapperChoosingCities = (
    { children }: { children: ReactNode }
) => {

    return (
        <div className="z-250 fixed bg-black/60 top-0 left-0
        w-full h-full flex items-center max-sm:items-center max-sm:py-1
        justify-center max-sm:fixed max-lg:fixed">
            {children}
        </div>
    )
}

export default WrapperChoosingCities