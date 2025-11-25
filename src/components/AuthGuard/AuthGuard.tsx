'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import { useCheckAuthQuery, useLogoutMutation, useUpdateCityMutation } from "@/redux/services/authApi";
import { selectbackgroundState, selectNotFoundState, selectTokenState } from "@/selectors/selectors";
import { ReactNode, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import urlBg from '../../../public/backgrounds/background.svg'
import fetchCityFromCoors from "@/utils/fetchCityFromCoors";
import getGeoCoors from "@/utils/getGeoCoors";
import { Coordinates } from "@/interfaces/position";
import { cacheUser, clearCachedUser, getCachedUser } from '@/cashe/userCache';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Loader from '../ui/Loader/Loader';
import { removeToken } from '@/redux/slices/tokenSlice';
import { clearCachedDialogues } from '@/cashe/dialoguesCache';
import { clearCachedMessages } from '@/cashe/messageCache';

interface CheckAuthError {
    data: {
        status: string,
        message: string
    },
    status: number
}

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const tokenState = useSelector(selectTokenState);

    const { data: authData, isLoading: isLoadingAuth, error: errorAuth, refetch: authRefetch } = useCheckAuthQuery({ token: tokenState.token });
    const [updateCity, { data: updateCityData, isLoading: isLoadingUpdateCity }] = useUpdateCityMutation();

    const bgColor = useSelector(selectbackgroundState);

    const notFound = useSelector(selectNotFoundState);

    const dispatch = useDispatch();

    const searchParams = useSearchParams();

    const router = useRouter()

    const pathname = usePathname();

    const [dataPosition, setDataPosition] = useState({ id: '', city: '', token: '' })
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    const [logout, { data: logoutData }] = useLogoutMutation();

    const [isReload, setIsReload] = useState(false)

    useEffect(() => {
        authRefetch()
    }, [])

    useEffect(() => {
        if (pathname === '/' && !searchParams.get('tab')) {
            router.push('/?tab=users')
        }
    }, [pathname, searchParams])

    useEffect(() => {
        const errorAuthData = errorAuth as CheckAuthError

        if (errorAuthData && errorAuthData.data && errorAuthData.data.message.includes('jwt expired') && errorAuthData.data.status === 'error' && errorAuthData.status === 400) {
            logout({});
        }

        (async () => {
            const userData = await getCachedUser();

            if (errorAuthData && errorAuthData.data && userData[0].id) {
                logout({});
            }

            if (errorAuthData && errorAuthData.data && !userData[0].id && !authData?.user) {
                logout({});
            }
        })()

    }, [errorAuth, authData?.user,])

    useEffect(() => {
        if (logoutData?.status === 'ok') {
            dispatch(removeToken())
            clearCachedDialogues()
            clearCachedMessages()
            clearCachedUser()
            window.location.reload()
        }
    }, [logoutData])

    useEffect(() => {

        if (!isLoadingUpdateCity && updateCityData?.status === 'ok') {
            authRefetch()
            setIsReload(true)
        }
    }, [updateCityData, isLoadingUpdateCity, tokenState])

    useEffect(() => {
        if (isReload && authData?.user?.id) {
            setIsReload(false)
            window.location.reload()
        }
    }, [authRefetch, setIsReload, isReload])

    useEffect(() => {
        const body = document.querySelector('body');

        if (body && authData) {
            // Для фона чата
            body.style.background = `url('${urlBg.src}'), linear-gradient(135deg, ${bgColor.bgColor}, rgba(0, 0, 255, 0.3))`;

            if (!searchParams.get('tab') && !pathname.includes('profile') && !pathname.split('/')[1]) {
                router.push('/?tab=users')
            }
        }

        if (!isLoadingAuth && !authData) {
            router?.push('/?tab=users')
        }

    }, [bgColor, authData, notFound?.isNotFound])

    useEffect(() => {

        if (!isLoadingAuth && !authData?.user.city) {
            getGeoCoors()?.then(geoCoors => {
                const coors = geoCoors as Coordinates;

                setPosition(coors);
            })
        }

        (async () => {
            const user = authData?.user;

            try {
                if (user && !errorAuth) {
                    const cached = await getCachedUser();

                    if (!cached.length) {
                        await cacheUser(user);
                        console.log('Данные пользователя сохранены в кеш');
                    }
                }
            } catch (error) {
                console.error('Ошибка при сохранении в кеш:', error);
            }
        })()
    }, [authData])

    useEffect(() => {
        if (position && !isLoadingAuth && !authData?.user.city && authData?.user?.id && tokenState.token) {
            fetchCityFromCoors({ position }).then(res => {
                if (res) {
                    const dataPosition = {
                        id: authData?.user?.id,
                        city: res,
                        token: tokenState.token
                    }

                    setDataPosition(dataPosition)
                }
            })
        }
    }, [position, tokenState.token])

    useEffect(() => {
        if (!isLoadingAuth && !authData?.user.city) {
            if (dataPosition) {
                updateCity(dataPosition)
            }
        }
    }, [dataPosition, setDataPosition, isLoadingAuth, authData?.user.city])

    return (
        <>
            {(isLoadingUpdateCity || isLoadingAuth || (!isLoadingAuth && authData?.user.id && !authData?.user.city)) && <Loader isFade={true} />}
            {children}
        </>
    );
};

export default AuthGuard