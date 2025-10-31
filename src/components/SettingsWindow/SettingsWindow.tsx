'use client'

import React, { useRef } from 'react';

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

    const newParams = useRef<URLSearchParams | null>(null);

    const refForm = useRef<HTMLFormElement | null>(null);
    const closeBtnBlockRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.location.search) {
            newParams.current = new URLSearchParams(window.location.search);
        }
    }, [window.location.search, searchParams?.get('tab')]);

    useEffect(() => {
        if (refForm.current && closeBtnBlockRef.current) {
            const imgRect = refForm.current.getBoundingClientRect();
            const btnRect = closeBtnBlockRef.current.getBoundingClientRect();
            closeBtnBlockRef.current.style.top = `${imgRect.top - (btnRect.height / 2)}px`;
            closeBtnBlockRef.current.style.left = `${imgRect.right - (btnRect.width / 2)}px`;
        }
    }, [url]);

    useEffect(() => {
        const divBgView = document.querySelector('.bg-view') as HTMLElement | null;

        if (divBgView) {
            divBgView.style.background = `linear-gradient(135deg, ${hex}, rgba(0, 0, 255, 0.3))`;
        }

    }, [hex])

    const onChangeColor = (e: ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        const valuesList = value.split(',')
        setHex(valuesList[0])
    }

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        dispatch(addColor({ bgColor: hex }))

        if (url && newParams.current) {
            newParams.current.delete('settings');

            const newUrl = `${url.pathname}?${newParams.current.toString()}`;

            router.push(newUrl);
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

    return (
        <div className={`z-60 flex justify-center items-center fixed top-0 left-0 w-full
        h-full bg-black/60 transition-all duration-200 ease-out
        ${isFade ? 'opacity-100 scale-100 translate-y-0 flex-col' :
                'opacity-0 scale-95 -translate-y-2 relative'}`}>
            <form ref={refForm} className="flex p-5 bg-white rounded-2xl" onSubmit={onSubmit}>
                <div ref={closeBtnBlockRef} className="absolute">
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