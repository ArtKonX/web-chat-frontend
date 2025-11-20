import React from 'react';

import { MediaUploadItemProps } from "@/interfaces/components/upload-file-components"

const MediaUploadItem = (
    { handleFile, type, text }: MediaUploadItemProps
) => {

    return (
        <button
            className="block w-full p-2 text-left text-md hover:bg-gray-100 dark:hover:bg-[#424242]
            rounded-xl cursor-pointer"
            onClick={() => handleFile(type)}
        >
            {text}
        </button>
    )
}

export default MediaUploadItem