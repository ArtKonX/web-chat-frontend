import React from 'react';

import { ReactNode } from "react"

const WrapperChoosingCities = (
    { children }: { children: ReactNode }
) => {

    return (
        <div className="z-250 absolute bg-gray-400/91 top-0 left-0
        w-full h-full flex items-center max-sm:items-start  max-sm:pt-6
        justify-center">
            {children}
        </div>
    )
}

export default WrapperChoosingCities