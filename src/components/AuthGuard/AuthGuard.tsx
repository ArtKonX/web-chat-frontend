'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import { useCheckAuthQuery, useUpdateCityMutation } from "@/redux/services/authApi";
import { selectbackgroundState, selectTokenState } from "@/selectors/selectors";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import urlBg from '../../../public/backgrounds/background.svg'
import fetchCityFromCoors from "@/utils/fetchCityFromCoors";
import getGeoCoors from "@/utils/getGeoCoors";
import { Coordinates } from "@/interfaces/position";
import { cacheUser, getCachedUser } from '@/cashe/userCache';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const tokenState = useSelector(selectTokenState);

    const { data: authData, isLoading: isLoadingAuth, refetch: authRefetch } = useCheckAuthQuery({ token: tokenState.token });
    const [updateCity, { data: updateCityData, isLoading: isLoadingUpdateCity }] = useUpdateCityMutation();

    const bgColor = useSelector(selectbackgroundState);

    const searchParams = useSearchParams();

    const router = useRouter()

    const pathname = usePathname();

    const [dataPosition, setDataPosition] = useState({ id: '', city: '', token: '' })
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        authRefetch()
    }, [])

    useEffect(() => {

        if (!isLoadingUpdateCity && updateCityData?.status === 'ok') {
            authRefetch()
        }
    }, [updateCityData, isLoadingUpdateCity, tokenState])

    useEffect(() => {
        const body = document.querySelector('body');

        if (body && authData) {
            // Для фона чата
            body.style.background = `url('${urlBg.src}'), linear-gradient(135deg, ${bgColor.bgColor}, rgba(0, 0, 255, 0.3))`;

            if (!searchParams.get('tab') && !pathname.includes('profile')) {
                router.push('/?tab=users')
            }
        }

        if (!isLoadingAuth && !authData) {
            router?.push('/')
        }

    }, [bgColor, authData,])

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
                if (user) {
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

    return children;
};

export default AuthGuard