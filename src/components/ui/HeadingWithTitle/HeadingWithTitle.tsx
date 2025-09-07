import React from 'react';

import { HeadingWithTitleProps } from "@/interfaces/components/ui"

const HeadingWithTitle = (
    { text, children }: HeadingWithTitleProps
) => {

    return (
        <div className="flex flex-col relative h-full">
            <h1 className="text-2xl font-bold text-center mb-6">
                {text}
            </h1>
            {children}
        </div>
    )
}

export default HeadingWithTitle