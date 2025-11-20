'use client'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React, { useEffect, useState } from 'react';

interface WarningWindowProps {
    title: string,
    text: string,
    timeCount: number
}

const WarningWindow = (
    { title, text, timeCount }: WarningWindowProps) => {

    const [count, setCount] = useState(timeCount);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCount(prev => prev - 1)
        }, 1000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="z-1000 bg-black/60 h-full w-full flex justify-center items-center absolute top-0">
            <div className="bg-amber-200 dark:text-black dark:border-black dark:bg-[#ebb318] max-w-[500px] p-8 text-2xl flex
            flex-col items-center font-bold rounded-3xl border-3 max-sm:text-[21px] max-sm:p-3 m-2">
                {title}
                <span className="mt-3 text-xl font-medium max-sm:text-[18px]">{text}</span>
                <span className='flex justify-between items-center w-full mt-3 text-xl max-sm:text-[18px] animate-pulse'>
                    Переход на главную через {count} сек. <span className='ml-2 text-2xl animate-spin'>↻</span>
                </span>
            </div>
        </div>
    )
}


export default WarningWindow