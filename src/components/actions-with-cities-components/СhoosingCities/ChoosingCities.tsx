import React from 'react';

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

    const onAction = () => {
        url.searchParams.delete('showSelectedCities');
        url.searchParams.set('showMapCities', 'true');

        router.push(url.pathname + url.search)
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
        if (searchParams) {
            if (searchParams?.get('tab')) {
                const tab = searchParams?.get('tab') as string
                url.searchParams.set('tab', tab)
            }

            if (searchParams?.get('user')) {
                const user = searchParams?.get('user') as string
                url.searchParams.set('user', user)
            }

            if (searchParams?.get('offset')) {
                const offset = searchParams?.get('offset') as string
                url.searchParams.set('offset', offset)
            }

            if (searchParams?.get('city')) {
                const city = searchParams?.get('city') as string
                url.searchParams.set('city', city)
            }

            url.searchParams.delete('showSelectedCities');
            router.push(url.href)
        }
    }

    return (
        <div className="bg-white py-6 px-9 rounded-2xl
        max-w-3/7 max-lg:max-w-9/11 max-sm:max-w-9/10
        w-full relative">
            <div className="absolute right-5 top-2">
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
                <div className="absolute bottom-0 right-0 max-lg:relative max-lg:-right-[45%] max-sm:relative max-sm:-right-[45%]">
                    <Btn type='button' text="Перейти на карту" onAction={onAction} />
                </div>
            </HeadingWithTitle>
        </div>
    )
}

export default ChoosingCities