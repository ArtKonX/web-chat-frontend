'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';

import { useCheckAuthQuery, useUpdateCityMutation } from "@/redux/services/authApi";
import { selectbackgroundState } from "@/selectors/selectors";
import { ReactNode, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import urlBg from '../../../public/backgrounds/background.svg'
import fetchCityFromCoors from "@/utils/fetchCityFromCoors";
import getGeoCoors from "@/utils/getGeoCoors";
import { Coordinates } from "@/interfaces/position";

const AuthGuard = ({ children }: { children: ReactNode }) => {
    const { data: authData, isLoading: isLoadingAuth, refetch: authRefetch } = useCheckAuthQuery({});
    const [updateCity, { data: updateCityData, isLoading: isLoadingUpdateCity }] = useUpdateCityMutation();

    const bgColor = useSelector(selectbackgroundState);

    const [dataPosition, setDataPosition] = useState({ id: '', city: '' })
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        authRefetch()
    }, [])

    useEffect(() => {

        if (!isLoadingUpdateCity && updateCityData?.status === 'ok') {
            authRefetch()
        }
    }, [updateCityData, isLoadingUpdateCity])

    useEffect(() => {
        const body = document.querySelector('body');

        if (body && authData) {
            // Для фона чата
            body.style.background = `url('${urlBg.src}'), linear-gradient(135deg, ${bgColor.bgColor}, rgba(0, 0, 255, 0.3))`;
        }

    }, [bgColor, authData,])

    useEffect(() => {
        if (!isLoadingAuth && !authData?.user.city) {
            getGeoCoors().then(geoCoors => {
                const coors = geoCoors as Coordinates;

                setPosition(coors);
            })
        }
    }, [authData])

    useEffect(() => {
        if (position && !isLoadingAuth && !authData?.user.city && authData?.user.id) {
            fetchCityFromCoors({ position }).then(res => {
                if (res) {
                    const dataPosition = {
                        id: authData?.user.id,
                        city: res
                    }

                    setDataPosition(dataPosition)
                }
            })
        }
    }, [position])

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