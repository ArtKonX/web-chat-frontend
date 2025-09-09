import React, { useEffect, useRef } from 'react';

import { useDispatch } from "react-redux"
import CloseBtn from "../ui/CloseBtn/CloseBtn"
import { resetUrl } from "@/redux/slices/imageSlice";

const ImageWindow = (
    { url }: { url: string }) => {

    const refImg = useRef<HTMLImageElement | null>(null);
    const closeBtnBlockRef = useRef<HTMLDivElement | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (refImg.current && closeBtnBlockRef.current) {
            const imgRect = refImg.current.getBoundingClientRect();
            const btnRect = closeBtnBlockRef.current.getBoundingClientRect();
            closeBtnBlockRef.current.style.top = `${imgRect.top - (btnRect.height / 2)}px`;
            closeBtnBlockRef.current.style.left = `${imgRect.right - (btnRect.width / 2)}px`;
        }
    }, [url]);


    const closeFileForm = () => {
        dispatch(resetUrl())
    }

    return (
        <div className={`z-60 flex justify-center items-center fixed top-0 left-0 w-full
            h-full bg-black/60 transition-all duration-200 ease-out
            opacity-100 scale-100 translate-y-0`}>
            <div className="w-full h-full flex flex-col items-center justify-center relative">
                <div className="w-[100%] h-[100%]">
                    <div className="w-full h-full relative flex items-center justify-center">
                        <img ref={refImg} className="max-w-[40%] w-full object-contain" src={url} alt={url} />
                        <div ref={closeBtnBlockRef} className='absolute'>
                            <CloseBtn onClose={closeFileForm} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ImageWindow