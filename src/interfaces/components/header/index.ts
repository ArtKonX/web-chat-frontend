export interface HeaderProps {
    isDemoHeader: boolean,
    isWelcomePage: boolean
}

export interface HeaderUserLinksProps {
    city: string,
    userName: string,
    colorBackgroundIcon: string
}

export interface HeaderMenuItemProps {
    text: string,
    href: string
}

export interface MenuDataElem {
    id: number,
    href: string,
    text: string
}

export interface HeaderBurgerProps {
    showSideBar: () => void
}