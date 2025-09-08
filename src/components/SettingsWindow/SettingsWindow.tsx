'use client'

import React from 'react';

import HeadingWithTitle from "../ui/HeadingWithTitle/HeadingWithTitle"

import bg from '../../../public/backgrounds/background.svg';
import Btn from "../ui/Btn/Btn";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addColor } from "@/redux/slices/backgroundSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector } from "@/hooks/useTypedSelector";
import { selectbackgroundState } from "@/selectors/selectors";

import bgColors from '../../data/bg-colors.json';
import useUrl from "@/hooks/useUrl";
import { SettingsWindowProps } from "@/interfaces/components/settings-window";
import CloseBtn from "../ui/CloseBtn/CloseBtn";

const SettingsWindow = (
    { isFade }: SettingsWindowProps) => {

    const bgColor = useSelector(selectbackgroundState);

    const [hex, setHex] = useState(bgColor.bgColor || bgColors[0]?.hex);
    const { url } = useUrl();

    const searchParams = useSearchParams()

    const router = useRouter();

    const dispatch = useDispatch();

    const onChangeColor = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const valuesList = value.split(',')
        setHex(valuesList[0])
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(addColor({ bgColor: hex }))

        if (url) {
            url?.searchParams.delete('settings');
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

    const onClose = () => {
        if (searchParams && url) {
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

            url.searchParams.delete('settings');

            router.push(url.href)
        }
    }

    useEffect(() => {
        const divBgView = document.querySelector('.bg-view') as HTMLElement | null;

        if (divBgView) {
            divBgView.style.background = `linear-gradient(135deg, ${hex}, rgba(0, 0, 255, 0.3))`;
        }

    }, [hex])

    return (
        <div className={`z-60 flex justify-center items-center fixed top-0 left-0 w-full
        h-full bg-black/60 transition-all duration-200 ease-out
        ${isFade ? 'opacity-100 scale-100 translate-y-0 flex-col' :
                'opacity-0 scale-95 -translate-y-2'}`}>
            <form className="flex p-5 bg-white rounded-2xl relative" onSubmit={onSubmit}>
                <div className="absolute right-3 -top-1">
                    <CloseBtn onClose={onClose} />
                </div>
                <HeadingWithTitle text="Цвет фона:">
                    <div className="w-[280px] h-[280px] relative">
                        <div className={'bg-view z-0 w-[280px] h-[280px] absolute top-0 left-0 opacity-70'} />
                        <img className="z-120 w-full h-full object-cover absolute" src={bg.src} alt="фон" />
                    </div>

                    <select defaultValue={bgColor.bgColor} onChange={onChangeColor} className="my-4" name="city" id="city-select">
                        {bgColors.map(color => (
                            <option selected={bgColor.bgColor === color.hex} key={color.id} value={`${color.hex},${color.color}`}>{color.colorRu}</option>
                        ))}
                    </select>
                    <Btn text="Сохранить" type="submit" />
                </HeadingWithTitle>
            </form>
        </div>
    )
}

export default SettingsWindow