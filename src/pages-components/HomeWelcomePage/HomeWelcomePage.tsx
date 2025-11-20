import React from 'react';

import HeaderLogo from "@/components/Header/HeaderLogo/HeaderLogo";
import LinkNavigate from "@/components/ui/LinkNavigate/LinkNavigate";
import { useEffect, useState } from "react"

import dataInfoChat from '../../data/data-info-char.json';

const HomeWelcomePage = () => {

    const [titleTextCount, setTitleTextCount] = useState(0);
    const [isFadeTitle, setIsFadeTitle] = useState(0);

    useEffect(() => {
        setIsFadeTitle(100)
        const timeoutIdOut = setTimeout(() => {
            setIsFadeTitle(0)
        }, 5400)

        const intervalId = setInterval(() => {
            const timeoutIdOne = setTimeout(() => {
                setIsFadeTitle(100)
                setTitleTextCount(prevState => prevState < dataInfoChat.length - 1 ? prevState + 1 : 0)
            }, 400)

            const timeoutIdTwo = setTimeout(() => {
                setIsFadeTitle(0)
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
        <div className="w-full h-full">
            <div className="bg-[#F6F7F8] dark:bg-[#141414] w-full h-full flex flex-col justify-center items-center px-4">
                <div className="flex items-center max-sm:flex max-sm:flex-col max-sm:text-center">
                    <h1 className='text-3xl font-bold mr-3 max-sm:mr-0 max-sm:text-2xl max-sm:mb-5 dark:text-[#E1E3E6]'>
                        Лучший чат для <span className={`opacity-${isFadeTitle} transition-opacity duration-500`}>{dataInfoChat[titleTextCount].text}</span> <span className="max-sm:whitespace-pre max-sm:flex max-sm:justify-center">- это K-Чат</span>
                    </h1>
                    <div className="max-sm:mr-3">
                        <HeaderLogo />
                    </div>
                </div>
                <div className="mt-14 flex items-center justify-center max-sm:flex-col">
                    <p className="font-bold text-xl mt-3 mr-3 max-sm:mr-0 dark:text-[#E1E3E6]">Не трать время впустую,</p>
                    <LinkNavigate path="/registration" text='Зарегистрируйся!' />
                </div>
            </div>
        </div>
    )
}

export default HomeWelcomePage