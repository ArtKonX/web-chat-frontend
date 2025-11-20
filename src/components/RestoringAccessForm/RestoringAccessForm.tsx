'use client'

import React, { FormEvent } from 'react';

import Btn from "../ui/Btn/Btn"
import HeadingWithTitle from "../ui/HeadingWithTitle/HeadingWithTitle"

interface RestoringAccessFormProps {
    onSubmitUpdatePublicKey: (e: FormEvent<HTMLFormElement>) => void
}

const RestoringAccessForm = (
    { onSubmitUpdatePublicKey }: RestoringAccessFormProps) => {

    return (
        <div className={`z-60 flex justify-center items-center fixed top-0 left-0 w-full
            h-full bg-black/60 transition-all duration-200 ease-out
            opacity-100 scale-100 translate-y-0`}>
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                <form onSubmit={onSubmitUpdatePublicKey} className="z-100 bg-white dark:text-[#E1E3E6] dark:bg-[#222222] py-6 px-9 rounded-2xl max-w-2/5 max-sm:max-w-9/10 w-full flex flex-col items-center relative">
                    <HeadingWithTitle text='Восстановите доступ к данным аккаунта!'>
                        <p className='font-bold text-[22px] mb-3 text-center text-red-500'>
                            К сожалению, приватный ключ потерян(
                        </p>
                        <p className='font-bold text-[19px] mb-3'>
                            Для его восстановления нужно сгенерировать новый, старые сообщения, к сожалению, исчезнут!
                        </p>
                        <Btn text='Восстановить доступ' type='submit' />
                    </HeadingWithTitle>
                </form>
            </div>
        </div>
    )
}

export default RestoringAccessForm