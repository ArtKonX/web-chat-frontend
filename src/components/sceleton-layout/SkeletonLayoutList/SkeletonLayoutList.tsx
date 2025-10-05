import React from 'react';

import SkeletonLayoutItem from "../SkeletonLayoutItem/SkeletonLayoutItem"

const SkeletonLayoutList = (
    { length }: { length?: number }) => {

    return (
        <ul className="flex flex-col-reverse overflow-y-hidden relative h-full">
            {Array(length).fill('?').map((_, indx) => (
                <li key={indx}>
                    <SkeletonLayoutItem />
                </li>
            ))}
        </ul>
    )
}

export default SkeletonLayoutList