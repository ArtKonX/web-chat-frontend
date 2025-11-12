import React from 'react';

import SkeletonMessageItem from "../SkeletonMessageItem/SkeletonMessageItem"

const SkeletonMessagesList = (
    { length }: { length?: number }) => {

    return (
        <ul id='loading-list' className="flex flex-col-reverse overflow-y-hidden mx-12 pr-6 relative bottom-0 h-full">
            {Array(length).fill('?').map((_, indx) => (
                <li key={indx}>
                    <SkeletonMessageItem />
                </li>
            ))}
        </ul>
    )
}

export default SkeletonMessagesList