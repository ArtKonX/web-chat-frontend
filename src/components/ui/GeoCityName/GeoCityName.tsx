import React from 'react';

const GeoCityName = (
    { city }: { city: string }
) => {

    return (
        <span
            className="font-bold dark:text-[#E1E3E6]! text-xl mr-4 max-sm:text-[17px]"
        >
            ⚲ {city}
        </span>
    )
}

export default GeoCityName