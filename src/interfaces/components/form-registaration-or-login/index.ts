import { ChangeEvent, FormEvent } from "react"

interface FormState {
    name?: string,
    email: string,
    password: string,
    checkPassword?: string
}

interface ErrorsState {
    name?: boolean,
    email: boolean,
    password: boolean,
    checkPassword?: boolean
}

export interface FormRegistrationOrLoginProps {
    onSubmit: (e: FormEvent<HTMLFormElement>) => void,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    typeForm: 'reg' | 'log',
    formState: FormState,
    errors: ErrorsState,
    disable?: boolean
}