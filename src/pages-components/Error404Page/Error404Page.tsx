'use client';

import React from 'react';

import LinkNavigate from "@/components/ui/LinkNavigate/LinkNavigate";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { toggleIsFound } from '@/redux/slices/notFoundSlice';

const Error404Page = () => {

    const router = useRouter();

    const [time, setTime] = useState(7);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(toggleIsFound())

        const idSetInterval = setInterval(() => {
            setTime(prev => prev - 1)
        }, 1000)

        const idSetTimeout = setTimeout(() => {
            dispatch(toggleIsFound())
            router.push('/?tab=users&q=')
        }, 7000)

        return () => {
            clearTimeout(idSetTimeout)
            clearInterval(idSetInterval)
        }
    }, [])

    return (
        <div className="w-full h-[calc(100%+66px)] fixed top-0 z-2000">
            <div className="bg-[#F6F7F8] dark:bg-[#141414] w-full h-[calc(100%-42px)] flex flex-col items-center justify-center py-10 px-48 max-sm:px-10 max-lg:px-10">
                <h1 className="text-amber-500 font-bold text-8xl animate-pulse">
                    404
                </h1>
                <h2 className="font-bold dark:text-[#E1E3E6] text-3xl my-6">
                    Такой страницы нет(
                </h2>
                <p className="font-bold text-2xl dark:text-[#E1E3E6] mb-6 max-sm:text-center max-lg:text-center">До перехода на главную страницу всего секунд:
                    <span className="text-amber-500 text-3xl"> {time}</span>
                </p>
                <LinkNavigate path='/?tab=users&q=' text='Перейти на главную' />
            </div>
        </div>
    )
}

export default Error404Page