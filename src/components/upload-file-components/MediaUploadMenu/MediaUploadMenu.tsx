import React from 'react';

import { useRef } from "react";
import MediaUploadItem from "../MediaUploadItem/MediaUploadItem";
import { MediaUploadMenuProps } from "@/interfaces/components/upload-file-components";

const dataAboutFilesList = [
    { id: 0, text: '🏞 Фото', type: 'image' },
    { id: 1, text: '🎬 Видео', type: 'video' },
    { id: 2, text: '🔉 Аудио', type: 'audio' },
]

const MediaUploadMenu = (
    { onChangeFile, isSelectFileFade }: MediaUploadMenuProps
) => {

    // Создаем ref для input type="file" для взаимодействия с ним
    const fileRef = useRef<HTMLInputElement | null>(null);

    const handleFile = (type: string) => {
        if (fileRef && fileRef.current) {
            // Присваиваем тип файла, который мы хотм передать
            fileRef.current.accept = type === 'image' ? 'image/*' :
                type === 'video' ? 'video/*' :
                    'audio/*';
            // Производим механический клик
            // для показа окна выбора файла,
            // так как инпут скрыт
            fileRef.current?.click()
        }
    }

    return (
        <div className={`absolute z-40 -top-35 left-9 bg-white shadow-md p-4 rounded-2xl mt-2 w-40 transition-all
        duration-200 ease-out  ${isSelectFileFade ? 'opacity-100 scale-100 translate-y-0' :
                'opacity-0 scale-95 -translate-y-2'}`}>
            <ul>
                {
                    dataAboutFilesList.map(data => (
                        <li key={data.id}>
                            <MediaUploadItem handleFile={handleFile} type={data.type} text={data.text} />
                        </li>
                    ))
                }
            </ul>
            <input type="file" ref={fileRef} onChange={onChangeFile} className="w-0 h-0 opacity-0 block" />
        </div>
    )
}

export default MediaUploadMenu