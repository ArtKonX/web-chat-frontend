import { ChangeEvent, MouseEventHandler, ReactNode } from "react";

export interface BtnProps {
    text: string,
    type: "submit" | "button" | "reset",
    disable?: boolean,
    onAction?: MouseEventHandler<HTMLButtonElement>
}

export interface HeadingWithTitleProps {
    text: string,
    children: ReactNode
}

export interface InputProps {
    type: 'text' | 'email' | 'password',
    setIsFocused?: (isFocused: boolean) => void,
    isFocused?: boolean,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    value: string,
    name?: string
    error?: boolean
}

export interface InputProps {
    type: 'text' | 'email' | 'password',
    setIsFocused?: (isFocused: boolean) => void,
    isFocused?: boolean,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    value: string,
    name?: string
    error?: boolean
}

export interface InputWithLabelAndInfoProps extends InputProps {
    text: string,
    info?: string,
    error: boolean
}

export interface LinkNavigateProps {
    path: string,
    text: string
}

export interface UserIconProps {
    nameFirstSymbol?: string,
    colorBackgroundIcon?: string,
    status?: boolean
}