'use client'

import React from 'react';

import { useEffect, useState } from 'react';

const dataLoader = [
    {
        id: 0,
        text: 'Соединяем с сервером...'
    },
    {
        id: 1,
        text: 'Уже скоро...'
    },
    {
        id: 2,
        text: 'Проверяем код...'
    },
    {
        id: 3,
        text: 'Сверяем сообщения...'
    },
    {
        id: 4,
        text: 'Ищем пользователей...'
    },
    {
        id: 5,
        text: 'Еще несколько секунд...'
    },
    {
        id: 6,
        text: 'Настраиваем стили...'
    },
    {
        id: 7,
        text: 'Создаем бота...'
    },
    {
        id: 8,
        text: 'Проверяем время...'
    },
]

const Loader = (
    { isFade }: { isFade: boolean }
) => {

    const [textCount, setTextCount] = useState(0);
    const [isFadeText, setIsFadeText] = useState(0);

    useEffect(() => {
        setIsFadeText(100)
        const timeoutIdOut = setTimeout(() => {
            setIsFadeText(0)
        }, 5400)

        const intervalId = setInterval(() => {
            const timeoutIdOne = setTimeout(() => {
                setIsFadeText(100)
                setTextCount(prevState => prevState < dataLoader.length - 1 ? prevState + 1 : 0)
            }, 400)

            const timeoutIdTwo = setTimeout(() => {
                setIsFadeText(0)
            }, 5400)

            return () => {
                clearTimeout(timeoutIdOne);
                clearTimeout(timeoutIdTwo);
            };
        }, 5500)

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutIdOut)
        };
    }, [])

    return (
        <div data-testid="loader" className={`z-390 flex justify-center items-center absolute  top-0 left-0 w-full
        h-full bg-black/60 transition-all duration-200 ease-out
        ${isFade ? 'opacity-100 scale-100 translate-y-0 flex-col' :
                'opacity-0 scale-95 -translate-y-2'}`}>
            <div className="z-70 flex flex-col bg-amber-400 dark:text-black dark:border-black dark:bg-[#ebb318] max-w-25 h-25 w-25
        rounded-b-full rounded-t-xl items-center justify-center
        border-4 cursor-pointer relative">
                <span className="font-bold animate-pulse text-4xl z-10 absolute top-0 mt-2">
                    K
                </span>
                <div className='z-10 animate-pulse'>
                    {/* <span className={`absolute mb-1.5 right-4.5
                        bottom-1 font-bold text-5xl rotate-135 ${styles['animate-rotate-45']}
                        transition-transform duration-500`}>
                        🗡️
                    </span>
                    <span className={`absolute mb-1.5 left-4.5 bottom-1 font-bold text-5xl
                        rotate-135 ${styles['animate-rotate-315']} transition-transform
                        duration-500`}>
                        🗡️
                    </span> */}
                    <span className="w-full flex justify-center relative -bottom-4 font-bold text-4xl">
                        ⚔️
                    </span>
                </div>
            </div>
            <p className=
                {`opacity-${isFadeText} duration-500 transition-opacity mt-5 text-white font-bold text-3xl`}>
                {dataLoader[textCount].text}
            </p>
        </div>
    )
}

export default Loader