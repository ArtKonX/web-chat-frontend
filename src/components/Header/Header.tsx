import React from 'react';

import { useEffect, useState } from "react"
import HeaderBurger from "./HeaderBurger/HeaderBurger"
import HeaderUserLinks from "./HeaderUserLinks/HeaderUserLinks"
import { useDispatch } from "react-redux"
import { toggleSideBar } from "@/redux/slices/sideBarSlice"
import HeaderLogo from "./HeaderLogo/HeaderLogo"
import { useSelector } from "@/hooks/useTypedSelector"
import { selectUser } from "@/selectors/selectors"
import { useRouter, useSearchParams } from "next/navigation"
import HeaderMenu from "./HeaderMenu/HeaderMenu"

import dataMenu from '../../data/data-menu.json';
import HeaderMenuItem from "./HeaderMenu/HeaderMenuItem/HeaderMenuItem"
import { useGetUsersQuery } from "@/redux/services/usersApi"
import { HeaderProps } from "@/interfaces/components/header"

const Header = (
    { isDemoHeader, isWelcomePage }: HeaderProps
) => {
    const dispatch = useDispatch();
    const authData = useSelector(selectUser)
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: userData, isLoading: userIsLoading } = useGetUsersQuery({ q: String(searchParams?.get('user')), currentId: authData?.id })

    const [userName, setUserName] = useState<string | null | undefined>(null);
    const [url, setUrl] = useState<URL | null>(null);

    useEffect(() => {
        // Инициализируем URL
        if (typeof window !== 'undefined') {
            setUrl(new URL(window.location.href));
        }
    }, []);

    useEffect(() => {
        if (!userIsLoading && searchParams?.get('user')) {
            setUserName(userData?.users[0]?.name)
        } else {
            setUserName(null)
        }
    }, [userIsLoading, userData, searchParams?.get('user')])

    const [dataUser, setDataUser] = useState({
        city: 'Москва',
        colorBackgroundIcon: '',
        userName: ''
    })

    useEffect(() => {
        if (authData) {
            setDataUser({
                city: authData?.city,
                colorBackgroundIcon: authData?.color_profile,
                userName: authData?.name
            })
        }
    }, [authData])

    const showSideBar = () => {
        // Функция для показа и скрытия сайдбара
        dispatch(toggleSideBar());

        if (url) {
            if (searchParams && searchParams?.get('q')) {
                const q = searchParams?.get('q') as string
                url?.searchParams.set('q', q)
            }

            if (searchParams && searchParams?.get('tab')) {
                const tab = searchParams?.get('tab') as string
                url?.searchParams.set('tab', tab)
            }

            if (searchParams && searchParams?.get('user')) {
                const user = searchParams?.get('user') as string
                url?.searchParams.set('user', user)
            }

            router.push(url.pathname + url.search);
        }

    }

    const showSendSettings = () => {

        if (url) {
            if (!url?.searchParams?.get('settings')) {
                url?.searchParams.set('settings', 'true');
            }

            const tab = url.searchParams.get('tab');

            if (tab) {
                url?.searchParams.set('tab', tab);
            }

            const user = url.searchParams.get('user');

            if (user) {
                url?.searchParams.set('user', user);
            }

            router.push(url?.href);
        }
    }

    return (
        <div className="w-full bg-white p-2 px-10 max-sm:px-4 border-b-2 box-content fixed z-50">
            <div className="w-full m-auto flex justify-between
            items-center"
            >
                <div className="h-full flex">
                    {!isWelcomePage && !isDemoHeader ?
                        (
                            <div className="h-full flex">
                                <HeaderBurger showSideBar={showSideBar} />
                            </div>
                        )
                        : null}
                    <HeaderLogo />
                </div>
                {isWelcomePage && (
                    <div className="w-full flex justify-between overflow-x-auto ml-6">
                        <div className="max-w-[40%] w-full max-sm:max-w-full">
                            <HeaderMenu dataMenu={dataMenu} />
                        </div>
                        <div className="max-w-full w-full flex justify-end mr-30 max-sm:justify-center max-sm:-mr-8">
                            <HeaderMenuItem href='/login' text='Войти' />
                        </div>
                    </div>
                )}
                {userName && (<span className="text-[18px] font-bold max-sm:absolute max-sm:w-full max-sm:flex max-sm:justify-center max-sm:-bottom-[29px] max-sm:left-0 max-sm:bg-amber-100">{userName}</span>)}
                {!isDemoHeader && !isWelcomePage && (
                    <div className="flex items-center mr-19 max-sm:mr-8 z-50">
                        <HeaderUserLinks city={dataUser.city} colorBackgroundIcon={dataUser.colorBackgroundIcon} userName={dataUser.userName} />
                        <button onClick={showSendSettings} className="ml-5 text-6xl h-[40px] relative bottom-3 cursor-pointer hover:opacity-65 duration-700 max-sm:text-4xl max-sm:h-[15px] max-sm:ml-2">⚙</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header