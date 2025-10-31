'use client'

import React, { useEffect, useRef } from 'react';

import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle"
import ChoosingCitiesList from "./ChoosingCitiesList/ChoosingCitiesList"
import { ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Btn from "@/components/ui/Btn/Btn";
import { ChoosingCitiesProps } from "@/interfaces/components/actions-with-cities-components";
import CloseBtn from "@/components/ui/CloseBtn/CloseBtn";

const ChoosingCities = (
    { searchCity, cities,
        cityFromServer, setSearchCity,
        setSelectedCity }: ChoosingCitiesProps
) => {
    const router = useRouter();
    const url = new URL(window?.location?.href);
    const searchParams = useSearchParams();

    const newParams = useRef<URLSearchParams>(new URLSearchParams());

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search) {
            newParams.current = new URLSearchParams(window.location.search);
        }
    }, [window.location.search, searchParams?.get('tab')]);

    const onAction = () => {
        if (!newParams.current) return

        newParams.current.delete('showSelectedCities');
        newParams.current.set('showMapCities', 'true');

        const newUrl = `${url.pathname}?${newParams.current.toString()}`;

        router.push(newUrl);
    }

    const onSearchCity = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setSearchCity(value);
    }

    const onChooseCity = (city: string) => {
        if (city) {
            setSelectedCity(city)
        }
    }

    const onClose = () => {
        if (searchParams && newParams.current) {

            newParams.current.delete('showSelectedCities');

            const newUrl = `${url.pathname}?${newParams.current.toString()}`;

            router.push(newUrl);
        }
    }

    return (
        <div className="bg-white py-6 px-9 rounded-2xl
        max-w-3/7 max-lg:max-w-9/11 max-sm:max-w-9/10
        w-full relative">
            <div className="absolute right-0 top-0">
                <CloseBtn onClose={onClose} />
            </div>
            <HeadingWithTitle text='Выберите город'>
                <input onChange={onSearchCity} value={searchCity}
                    className="min-w-3/5 outline-0 bg-gray-100/90 border-1 border-transparent
                pt-2 pb-2 px-3 rounded-lg transition-all duration-900"
                    type="text" placeholder={cityFromServer} />
                <span className="border-t-2 border-gray-400 mt-4 mb-2"></span>
                {cities && cities?.length > 0 && <ChoosingCitiesList cities={cities}
                    onChooseCity={onChooseCity} />}
                <div className="relative w-full">
                    <div className='flex justify-end'>
                        <Btn type='button' text="Перейти на карту" onAction={onAction} />
                    </div>
                </div>
            </HeadingWithTitle>
        </div>
    )
}

export default ChoosingCities