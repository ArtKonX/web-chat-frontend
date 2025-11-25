import React from 'react';

import Btn from "@/components/ui/Btn/Btn"
import CloseBtn from "@/components/ui/CloseBtn/CloseBtn"
import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle"
import { PopUpPin2FAProps } from "@/interfaces/components/components-for-work-2fa"

const PopUpPin2FA = (
    { pin, isShow2FA, setIsShow2FA, isShow2FAFade, setIsShow2FAFade, authDataRefetch }: PopUpPin2FAProps) => {

    const closeShow2FACode = () => {
        if (isShow2FA) {
            setIsShow2FAFade(false);
            setTimeout(() => {
                setIsShow2FA(false)
                authDataRefetch()
            }, 100)
        }
    }

    return (
        <div className={`flex justify-center z-100 pt-[65px] items-center fixed top-0 left-0 w-full h-full
                            bg-black/50 transition-all duration-200 ease-out
                            ${isShow2FAFade ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-2'}`}
        >
            <div className='min-h-[calc(100%-442px)] pb-[40px] pt-[15px] w-full flex justify-center items-center'>
                <div className="z-100 bg-white h-auto dark:text-[#E1E3E6] dark:bg-[#212121] py-6 px-9 rounded-2xl max-w-2/5 max-sm:max-w-9/10 w-full flex flex-col items-center relative">
                    <div className="absolute top-0 right-0">
                        <CloseBtn onClose={closeShow2FACode} />
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <HeadingWithTitle text='Код для восстановления аккаунта:' >
                            <span className="text-center text-red-500 font-bold text-2xl mb-4 max-sm:text-xl">
                                {pin}
                            </span>
                            <p className="font-bold mb-6">Копируйте его или запишите, он нужен для восстановления доступа к аккунту!</p>
                            <p className="font-bold text-xl mb-3">Повторно выдаваться не будет!</p>
                            <Btn text='Хорошо' type='button' onAction={closeShow2FACode} />
                        </HeadingWithTitle>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PopUpPin2FA