'use client'

import React, { useRef } from 'react';

import { useEffect, useState } from "react"
import HeaderBurger from "./HeaderBurger/HeaderBurger"
import HeaderUserLinks from "./HeaderUserLinks/HeaderUserLinks"
import { useDispatch } from "react-redux"
import { toggleSideBar } from "@/redux/slices/sideBarSlice"
import HeaderLogo from "./HeaderLogo/HeaderLogo"
import { useSelector } from "@/hooks/useTypedSelector"
import { selectTokenState } from "@/selectors/selectors"
import { useRouter, useSearchParams } from "next/navigation"
import HeaderMenu from "./HeaderMenu/HeaderMenu"

import dataMenu from '../../data/data-menu.json';
import { HeaderProps } from "@/interfaces/components/header"
import useUrl from '@/hooks/useUrl'
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { useGetUsersQuery } from '@/redux/services/usersApi';
import { getCachedUser } from '@/cashe/userCache';
import { UserData } from '@/interfaces/users';
import { toggleIsWindow } from '@/redux/slices/windowSlice';
import { useMediaPredicate } from 'react-media-hook';

const Header = (
    { isDemoHeader, isWelcomePage }: HeaderProps
) => {
    const dispatch = useDispatch();
    const tokenState = useSelector(selectTokenState)
    const router = useRouter();
    const searchParams = useSearchParams();

    const { data: authData, isLoading: isLoadingAuth } = useCheckAuthQuery({ token: tokenState.token });
    const { data: userData, isLoading: userIsLoading } = useGetUsersQuery({ q: String(searchParams?.get('user')), currentId: authData?.user?.id, token: tokenState.token });

    const [userInfo, setUserInfo] = useState<UserData | null>(null)

    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const { url } = useUrl()

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    const [userName, setUserName] = useState<string | null | undefined>(null);

    const [dataUser, setDataUser] = useState({
        city: 'Москва',
        colorBackgroundIcon: '',
        userName: ''
    })

    const newParams = useRef<URLSearchParams>(new URLSearchParams());
    const newPathname = useRef<string>('/');

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search) {
            newParams.current = new URLSearchParams(window.location.search);
        }
    }, [window.location.search, searchParams?.get('tab')]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.pathname) {
            newPathname.current = window.location.pathname;
        }
    }, [window.location.pathname]);

    useEffect(() => {
        (async () => {
            try {
                const userData = await getCachedUser();

                if (authData?.user?.id) {
                    setUserInfo(authData!.user)
                } else if (userData[0].id) {
                    setUserInfo(userData[0])
                }
            } catch (err) {
                console.log(err)
            }
        })()
    }, [authData?.user])

    useEffect(() => {
        if (!userIsLoading && searchParams?.get('user')) {
            setUserName(userData?.users[0].name)
        } else {
            setUserName(null)
        }
    }, [isLoadingAuth, userData, searchParams?.get('user')])

    useEffect(() => {
        if (userInfo) {
            setDataUser({
                city: userInfo!.city,
                colorBackgroundIcon: userInfo!.color_profile,
                userName: userInfo!.name
            })
        }
    }, [userInfo])

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [])

    const showSideBar = () => {
        // Функция для показа и скрытия сайдбара
        dispatch(toggleSideBar());
    }

    const showSendSettings = () => {

        if (url && newParams.current) {

            if (newParams.current.get('settings')) {
                newParams.current.delete('settings');
            } else {
                newParams.current.set('settings', 'true');
            }

            const newUrl = `${newPathname.current.toString()}?${newParams.current.toString()}`;

            router.push(newUrl);

            dispatch(toggleIsWindow())
        }
    }

    return (
        <div data-testid="header" className="w-full h-[64px] flex items-center bg-white p-2 px-10 max-sm:px-4 border-b-2 box-content fixed z-50">
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
                {(!userInfo?.id && isWelcomePage) && (
                    <div className="w-full flex justify-between overflow-x-auto ml-[50px] px-1 mr-30 max-sm:mr-9 max-sm:ml-[20px]">
                        <div className="w-full max-sm:max-w-full">
                            <HeaderMenu dataMenu={dataMenu} />
                        </div>
                    </div>
                )}
                {userName && (<span className={`text-[18px] font-bold ${!isOnline && 'text-red-600/90'} ${isMobile ? 'absolute w-full flex justify-center -bottom-[28px] left-0 bg-amber-100' : ''}`}>{!isOnline ? 'Нет соединения с интернетом(' : userName}</span>)}
                {((!isWelcomePage && !isDemoHeader)) && (
                    <div className="flex items-center mr-19 max-sm:mr-8 z-50">
                        <HeaderUserLinks isDisable={!isOnline} city={dataUser.city || userInfo!.city} colorBackgroundIcon={dataUser.colorBackgroundIcon} userName={dataUser.userName} />
                        <button data-testid="settings-button" onClick={showSendSettings} className="ml-5 text-6xl h-[40px] relative bottom-3 cursor-pointer hover:opacity-65 duration-700 max-sm:text-4xl max-sm:h-[15px] max-sm:ml-2">⚙</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header