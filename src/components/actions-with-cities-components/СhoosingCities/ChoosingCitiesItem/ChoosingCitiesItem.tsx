import React from 'react';

import { ChoosingCitiesItemProps } from "@/interfaces/components/actions-with-cities-components"

const ChoosingCitiesItem = (
    { onChooseCity, city }: ChoosingCitiesItemProps) => {

    return (
        <button onClick={() => {onChooseCity(city)}}
            className="mt-2 nth-of-type-[1]:mt-0 hover:opacity-65 transition-opacity
        duration-700 cursor-pointer">
            {city}
        </button>
    )
}

export default ChoosingCitiesItem