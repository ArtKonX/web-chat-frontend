import React from 'react';

import MediaUploadMenu from "@/components/upload-file-components/MediaUploadMenu/MediaUploadMenu";
import { useSelector } from "@/hooks/useTypedSelector";
import { UploadMenuWithButtonActionProps } from "@/interfaces/components/file-upload";
import { selectChangeMessageState } from "@/selectors/selectors";
import { ChangeEvent, useState } from "react";

const UploadMenuWithButtonAction = (
    { setIsFormUploadFade, setFile, setFileSrc,
        isFormUploadFile, setIsFormUploadFile
      }: UploadMenuWithButtonActionProps) => {

    const [isOpenMenuFiles, setIsOpenMenuFiles] = useState(false);
    const [isSelectFilesFade, setIsSelectFilesFade] = useState(true);

    const changeMessageState = useSelector(selectChangeMessageState);

    const onShowSelectTypeFile = () => {
        if (!isOpenMenuFiles) {
            setIsOpenMenuFiles(true)
            setTimeout(() => {
                setIsSelectFilesFade(true)
            }, 100)
        } else {
            setIsSelectFilesFade(false)
            setTimeout(() => {
                setIsOpenMenuFiles(false)
            }, 100)
        }
    }

    const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target && e.target.files?.length) {
            if (!isFormUploadFile) {
                onShowSelectTypeFile();
                setIsFormUploadFile(true)
                setTimeout(() => {
                    setIsFormUploadFade(true)
                }, 100)
                setFile(e.target.files[0]);
                setFileSrc(URL.createObjectURL(e.target.files[0]))
            }
        }
    }

    return (
        <div className="relative z-55">
            {!changeMessageState.isChange &&
                (<button onClick={onShowSelectTypeFile}
                    className="ml-6 text-3xl cursor-pointer hover:opacity-70 transition-opacity duration-700">
                    📎
                </button>)
            }
            {isOpenMenuFiles &&
                (<MediaUploadMenu onChangeFile={onSelectFile} isSelectFileFade={isSelectFilesFade} />)
            }
        </div>
    )
}

export default UploadMenuWithButtonAction