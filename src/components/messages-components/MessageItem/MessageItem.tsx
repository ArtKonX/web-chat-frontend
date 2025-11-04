import React, { useCallback } from 'react';

import imgAudio from '../../../../public/images/img-audio.png';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addDataChangeMessage } from '@/redux/slices/changeMessageSlice';
import { useSelector } from '@/hooks/useTypedSelector';
import { selectChangeMessageState, selectTokenState } from '@/selectors/selectors';
import { useDeleteMessageMutation } from '@/redux/services/messagesApi';
import { MessageItemProps, ShowActionMessage } from '@/interfaces/components/messages-components';
import { addUrl } from '@/redux/slices/imageSlice';
import { formattedDate } from '@/utils/formattedDate';
import { useCheckAuthQuery } from '@/redux/services/authApi';
import { cacheDeleteMessage } from '@/cashe/messageCache';
import { useMediaPredicate } from 'react-media-hook';

const MessageItem = (
    { currentId, message,
        anotherAuthorName, setIsScroll, isCache }: MessageItemProps
) => {

    const [showActionMessage, setShowActionMessage] = useState<ShowActionMessage | null>(null);
    const [isFade, setIsFade] = useState(false)

    const tokenState = useSelector(selectTokenState);

    const isMobile = useMediaPredicate('(max-width: 1050px)');

    // для вычисления ширины сообщения
    const refMessageItem = useRef<HTMLDivElement | null>(null);

    const refActions = useRef<HTMLUListElement | null>(null);

    const { data: authData } = useCheckAuthQuery({ token: tokenState.token });

    const dispatch = useDispatch();

    const [deleteMessage, { data: deleteMessageData, isLoading: isLoadingDeleteMessage }] = useDeleteMessageMutation()

    const messageChangeData = useSelector(selectChangeMessageState);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (
            showActionMessage &&
            refActions.current &&
            !refActions.current.contains(event.target as Node)
        ) {
            setShowActionMessage({ id: message.id, isShow: false });
        }
    }, [showActionMessage, refActions, message.id]);

    useEffect(() => {
        if (showActionMessage?.isShow) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showActionMessage, handleClickOutside]);

    useEffect(() => {

        if (
            refActions &&
            refMessageItem &&
            refActions.current &&
            refMessageItem.current &&
            refMessageItem?.current
        ) {
            if (!isMobile) {
                refActions.current.style.left = `${refMessageItem?.current?.offsetWidth / 2}px`;
            }
        }
    }, [showActionMessage?.isShow, messageChangeData?.isChange, isFade]);

    useEffect(() => {

        if (!messageChangeData.isChange) {
            setShowActionMessage({ id: message.id, isShow: false })
        }

    }, [messageChangeData.isChange])

    useEffect(() => {

        if (showActionMessage?.isShow && !messageChangeData.isChange && isFade) {
            setIsScroll(true)
        } else {
            setIsScroll(false)
        }

    }, [showActionMessage?.isShow, messageChangeData?.isChange, isFade])

    useEffect(() => {
        if (!messageChangeData.isChange) {
            const timeoutId = setTimeout(() => {
                setIsFade(false)
            }, 100)

            return () => clearTimeout(timeoutId)
        }
    }, [messageChangeData.isChange])

    useEffect(() => {

        if (showActionMessage?.isShow) {
            setIsFade(true)
        } else {

            const timeoutId = setTimeout(() => {
                setIsFade(false)
            }, 100)

            return () => clearTimeout(timeoutId)
        }

    }, [showActionMessage, setShowActionMessage])

    useEffect(() => {
        if (!isLoadingDeleteMessage && deleteMessageData?.status === 'ok') {
            setIsFade(false)
            setTimeout(() => {
                setShowActionMessage({ id: message.id, isShow: false })
            }, 400)
        }
    }, [deleteMessageData, isLoadingDeleteMessage])

    const onShowImage = (url: string) => {
        dispatch(addUrl({ url }))
    }

    const onClose = (id?: string) => {
        setIsFade(false)
        setTimeout(() => {
            setShowActionMessage({ id: id, isShow: false })
        }, 400)
    }

    const onDelete = (id?: string) => {
        if (id) {
            cacheDeleteMessage(id)
            deleteMessage({ messageId: id, userId: authData?.user?.id, token: tokenState.token })
        }
    }

    const onChange = () => {
        dispatch(addDataChangeMessage({ message: message.message, id: message.id }))
    }

    const renderFileByType = (type?: string, url?: string) => {

        if (type && url) {

            if (type.includes('image')) {
                return (
                    <button className="relative w-full h-60 hover:opacity-80
                    duration-300 transition-opacity cursor-pointer" onClick={() => onShowImage(url)}>
                        <img className='w-160 h-60 object-cover' src={url} alt='Не прогрузилось изображение' />
                    </button>
                )
            } else if (type.includes('video')) {
                return (
                    <div className="relative w-full h-60">
                        <video className='w-full h-60 object-cover' src={url} controls />
                    </div>
                )
            } else if (type.includes('audio')) {
                return (
                    <div className="relative w-full min-w-full flex flex-col items-center h-52">
                        <div className='w-full flex bg-amber-600/50 rounded-3xl mb-2 items-center justify-around px-1 box-border'>
                            <img className='w-40 h-40' src={imgAudio.src} alt="обложка песни" />
                            <p className='mx-1 text-[black] font-bold whitespace-pre-line'>{message.message.split('\n')[0].replace('Файл: ', 'Песня: ').replaceAll('_', ' ')}</p>
                        </div>
                        <audio className='w-full h-10 object-cover' src={url} controls />
                    </div>
                )
            }

        }
    }

    return (
        <>
            {showActionMessage?.isShow ? (<div className={`z-60 flex justify-center items-center fixed top-0 left-0 w-full
        h-full bg-black/60 transition-all duration-200 ease-out
        ${isFade ? 'opacity-60 scale-100 translate-y-0 flex-col' :
                    'opacity-0 scale-95 -translate-y-2'}`}>
            </div>) : null}
            {showActionMessage?.isShow && !messageChangeData.isChange && isFade && (
                <div className={`${isMobile ? 'fixed top-[50%]' : ''} absolute w-full z-110 flex items-center justify-center`}>
                    <ul ref={refActions} className='bg-white rounded-4xl border-2 border-black'>
                        {!message.file_type?.includes('audio/mpeg') ? (['Изменить', 'Удалить', message.file_url ? 'Скачать файл' : null, 'Отмена'].filter(elem => Boolean(elem)).map((item, indx, arr) => (
                            <li key={indx} className='not-last:mb-4 first:mt-4 not-last:border-b-1 pb-4 px-7'>
                                {arr.length === 4 ? [0, 1].includes(indx) || 3 === indx ?
                                    (<button onClick={() => indx === 0 && !message.file_type?.includes('audio/mpeg') ? onChange() : indx === 1 ? onDelete(message.id) : onClose(message.id)} className='text-xl font-bold hover:opacity-55 duration-500 cursor-pointer'>
                                        {item}
                                    </button>) :
                                    (<a onClick={() => onClose(message.id)} href={message.file_url} download={message.file_name} className="text-xl font-bold hover:opacity-55 duration-500 cursor-pointer">
                                        {item}
                                    </a>) :
                                    (<button onClick={() => indx === 0 ? onChange() : indx === 1 ? onDelete(message.id) : onClose(message.id)} className='text-xl font-bold hover:opacity-55 duration-500 cursor-pointer'>
                                        {item}
                                    </button>)}
                            </li>
                        ))) : (['Скачать файл', 'Удалить', 'Отмена'].filter(elem => Boolean(elem)).map((item, indx) => (
                            <li key={indx} className='not-last:mb-4 first:mt-4 not-last:border-b-1 pb-4 px-7'>
                                {[1, 2].includes(indx) ?
                                    (<button onClick={() => indx === 1 ? onDelete(message.id) : onClose(message.id)} className='text-xl font-bold hover:opacity-55 duration-500 cursor-pointer'>
                                        {item}
                                    </button>) :
                                    (<a onClick={() => onClose(message.id)} href={message.file_url} download={message.file_name} className="text-xl font-bold hover:opacity-55 duration-500 cursor-pointer">
                                        {item}
                                    </a>)}
                            </li>)))}
                    </ul>
                </div>
            )}
            <div ref={showActionMessage && showActionMessage.id === message.id && showActionMessage.isShow ? refMessageItem : null} className={`relative flex max-w-[80%] flex-col py-2 pr-10 pl-4 rounded-3xl
        border-2 ${isCache ? 'opacity-80 animate-pulse' : ''} ${(showActionMessage && showActionMessage.id === message.id && showActionMessage.isShow && !isMobile) && 'z-100 fixed'} ${currentId?.id === message?.sender_id ?
                    'bg-amber-200' : 'bg-white'}`}>
                {isCache !== true && !messageChangeData.isChange && currentId?.id === message?.sender_id && !(showActionMessage?.isShow && showActionMessage.id === message.id) ? (<div className='absolute -top-7 -right-6 z-1'>
                    <button onClick={() => { setShowActionMessage({ id: message.id, isShow: true }) }} className='bg-white pt-[4px] pb-[14px] px-3
                rounded-full text-2xl font-bold cursor-pointer hover:opacity-85 duration-500 z-51'>
                        …
                    </button>
                </div>) : null}
                {
                    message.file_url && renderFileByType(message.file_type, message.file_url)
                }
                {
                    message.message.length ? (
                        <div className='my-1'>
                            {!message.file_type?.includes('audio/mpeg') ? <p className="font-bold">{message.message.split('\n')[0]}</p> : null}
                            {message.message.split('\n')[1]?.trim() ? <p className="font-bold">{message.message.split('\n')[1]}</p> : null}
                        </div>
                    ) : <p className="font-bold my-1 whitespace-pre-wrap">{message.message}</p>
                }
                <time>{formattedDate(message.created_at)}</time>
                <>
                    {currentId?.id === message?.sender_id ? <span className="font-bold  text-end">Вы</span> : <span className="font-bold text-end">{anotherAuthorName?.name}</span>}
                </>
                <>
                    {currentId?.id === message?.sender_id ? <span className="font-bold  text-end">{currentId?.city}</span> : <span className="font-bold text-end">{anotherAuthorName?.city}</span>}
                </>
            </div>
        </>
    )
}

export default MessageItem