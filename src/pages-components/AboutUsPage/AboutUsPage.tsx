'use client'

import React, { useEffect } from 'react';

import HeaderLogo from "@/components/Header/HeaderLogo/HeaderLogo"

import authorImg from '../../../public/images/img-author.jpg';
import Link from "next/link";
import { useMediaPredicate } from 'react-media-hook';
import { useRouter } from 'next/navigation';
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { selectTokenState } from '@/selectors/selectors';
import { useSelector } from '@/hooks/useTypedSelector';

const features = [
    {
        id: 0,
        text: 'Мгновенный обмен сообщениями'
    },
    {
        id: 1,
        text: 'Поиск собеседников'
    },
    {
        id: 2,
        text: 'Выбор своей геолокации автоматически или на карте и в списке'
    },
    {
        id: 3,
        text: 'Двойной фактор защиты для дополнительной защиты данных'
    },
    {
        id: 4,
        text: 'Гибридное шифрование данных'
    },
    {
        id: 5,
        text: 'Обмен медиафайлами'
    },
    {
        id: 6,
        text: 'Удобный веб-интерфейс'
    }
]

const AboutUsPage = () => {

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    const tokenState = useSelector(selectTokenState);

    const { data: authData, isLoading: isLoadingAuth } = useCheckAuthQuery({ token: tokenState.token });

    const router = useRouter();

    useEffect(() => {
        if (!isLoadingAuth && authData?.user?.id) {
            router.push('/?tab=users')
        }
    }, [authData])

    if (!isLoadingAuth && authData?.user?.id) return

    return (
        <div className="w-full">
            <div className={`bg-[#F6F7F8] dark:bg-[#141414] dark:border-black w-full h-[calc(100%-41px)] max-lg:h-[100%] max-sm:h-full max-sm:py-[90px] ${isMobile ? 'py-[45px]!' : ''} flex flex-col py-10 px-10 max-lg:pt-[100px] max-lg:px-10 max-sm:px-4 overflow-y-auto`}>
                <div className="flex items-center justify-center text-center max-sm:flex-col">
                    <h1 className='text-[36px] dark:text-[#E1E3E6] max-sm:text-[26px] max-sm:whitespace-nowrap font-bold mr-3 max-sm:mr-0'>
                        О веб-приложении K-Чат
                    </h1>
                    <div className="max-sm:mt-4">
                        <HeaderLogo />
                    </div>
                </div>
                <div className="mt-14 flex flex-col items-center justify-center">
                    <h2 className='text-[28px] dark:text-[#E1E3E6] font-bold mr-3 mb-10 max-sm:text-[26px] max-sm:whitespace-nowrap'>Что такое K-Чат?</h2>
                    <p className="text-xl dark:text-[#E1E3E6] font-bold text-gray-800 indent-15 mb-5 max-sm:flex max-sm:text-[19px]">
                        K-Чат — это инновационный мессенджер с привязкой к геолокации, который позволяет пользователям общаться с людьми из разных локации России. Приложение объединяет людей, создавая уникальные возможности для общения и обмена информацией.
                    </p>
                    <p className="text-xl dark:text-[#E1E3E6] font-bold text-gray-800 indent-15 max-sm:text-[19px]">
                        В приортиете K-Чат, является обеспечение безопасности конфиденциальных данных с помощью гибридного шифрования файлов и сообщений пользователей.
                    </p>
                </div>
                <div className="mt-20">
                    <h2 className='text-[28px] dark:text-[#E1E3E6] font-bold mb-10 text-center max-sm:text-[26px]'>Ключевые особенности</h2>
                    <ul className="text-xl dark:text-[#E1E3E6] font-bold list-disc space-y-4 whitespace-nowrap max-sm:whitespace-normal text-gray-800 indent-5 pl-17 max-sm:pl-4 max-sm:text-[19px]">
                        {features.map(feature => (
                            <li key={feature.id}>{feature.text}</li>
                        ))}
                    </ul>
                </div>
                <div className="mt-20">
                    <h2 className='text-[28px] dark:text-[#E1E3E6] font-bold text-center max-sm:text-[26px] mb-10'>О разработчике, создавшем это веб-приложение</h2>
                    <div className="flex items-center max-sm:flex-col">
                        <Link href='https://github.com/ArtKonX' className="mr-10 dark:text-[#E1E3E6] max-sm:mr-0 flex flex-col items-center hover:opacity-65! transition-opacity duration-800">
                            <img className="w-70 mb-3 rounded-full" src={authorImg.src} alt="фото автора к-чата" />
                            <span className="text-xl font-bold whitespace-nowrap">
                                ArtKonX
                            </span>
                        </Link>
                        <p className="text-xl font-bold text-gray-800 mb-5 dark:text-[#E1E3E6] indent-15 max-sm:text-[19px] max-sm:mt-6">Специлизизируется на разработке веб-приложений на React и Node.js. ArtKonX стремится создавать продукты, которые делают жизнь проще и продуктивнее.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AboutUsPage