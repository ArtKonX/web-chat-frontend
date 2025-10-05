import React from 'react';

import { MenuDataElem } from "@/interfaces/components/header"
import HeaderMenuItem from "./HeaderMenuItem/HeaderMenuItem"

const HeaderMenu = (
    { dataMenu }: { dataMenu: MenuDataElem[] }) => {

    return (
        <ul data-testid="header-menu" className="max-w-full w-full flex justify-between">
            {dataMenu.map(itemData => (
                <li key={itemData.id}>
                    <HeaderMenuItem {...itemData} />
                </li>
            ))}
        </ul>
    )
}

export default HeaderMenu