'use client'

import React from 'react';

import FormTurnOff2FA from "@/components/components-for-work-2fa/FormTurnOff2FA/FormTurnOff2FA";
import PopUpPin2FA from "@/components/components-for-work-2fa/PopUpPin2FA/PopUpPin2FA";
import Btn from "@/components/ui/Btn/Btn"
import LinkNavigate from "@/components/ui/LinkNavigate/LinkNavigate"
import Loader from "@/components/ui/Loader/Loader";
import UserIcon from "@/components/ui/UserIcon/UserIcon"
import { useCheckAuthQuery, useLogoutMutation, useTurnOn2FAMutation } from "@/redux/services/authApi";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { removeToken } from '@/redux/slices/tokenSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from '@/hooks/useTypedSelector';
import { selectTokenState } from '@/selectors/selectors';

interface ProfileDataState {
    name?: string,
    email?: string,
    id?: string,
    color?: string,
    city?: string,
    FA2?: boolean
}

const ProfilePage = () => {

    const tokenState = useSelector(selectTokenState);

    const { data: authData, isLoading: isAuthDataLoading, error: errorAuthData, refetch: authDataRefetch } = useCheckAuthQuery({ token: tokenState.token });
    const [logout, { data: logoutData }] = useLogoutMutation();
    const [turnOn2FA, { data: turnOn2FAData, isLoading: isTurnOn2FALoading }] = useTurnOn2FAMutation();
    const path = usePathname();

    const [profileData, setProfileData] = useState<ProfileDataState>({
        name: '',
        email: '',
        id: '',
        color: '',
        city: '',
        FA2: false
    })

    const [pin, setPin] = useState<null | undefined | string>(null);
    const [isShow2FA, setIsShow2FA] = useState(false);
    const [isShow2FAFade, setIsShow2FAFade] = useState(false);
    const [isShowTurnOff2FA, setIsShowTurnOff2FA] = useState(false);
    const [isShowTurnOff2FAFade, setIsTurnOff2FAFade] = useState(false);

    const dispatch = useDispatch();

    const router = useRouter();

    useEffect(() => {
        authDataRefetch()
    }, [])

    useEffect(() => {

        if (!isAuthDataLoading && errorAuthData) {
            router.push('/')
        }
    }, [isAuthDataLoading, errorAuthData])

    useEffect(() => {
        if (turnOn2FAData && !isTurnOn2FALoading) {
            setPin(turnOn2FAData.data.pinCode);
        }
    }, [turnOn2FAData, isTurnOn2FALoading])

    useEffect(() => {
        if (pin) {
            setIsShow2FA(true)
            setTimeout(() => {
                setIsShow2FAFade(true)
            }, 100)
        }
    }, [pin])

    useEffect(() => {
        setProfileData({
            name: authData?.user?.name,
            email: authData?.user?.email,
            id: authData?.user?.id,
            color: authData?.user?.color_profile,
            city: authData?.user?.city,
            FA2: authData?.user?.fa2_enabled
        })
    }, [authData, path,])

    const onLogout = () => {
        logout({});
    }

    useEffect(() => {
        if (logoutData?.status === 'ok') {
            dispatch(removeToken())
            window.location.reload()
        }
    }, [logoutData])

    useEffect(() => {
        if (!authData && !isAuthDataLoading) {
            router.push('/')
        }
    }, [authData])

    const onActionTurnOn2FA = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (authData?.user?.id) {
                turnOn2FA({ id: authData?.user?.id, token: tokenState.token });
            }
        } catch (err) {
            console.error('Ошибка подключения 2FA ', err)
        }
    }

    const closeShowTurnOff2FAForm = () => {
        if (isShowTurnOff2FA) {
            setIsTurnOff2FAFade(false);
            setTimeout(() => {
                setIsShowTurnOff2FA(false)
            }, 100)
        }
    }

    const onShow2FATurnOff = () => {
        setIsShowTurnOff2FA(true)
        setTimeout(() => {
            setIsTurnOff2FAFade(true)
        }, 100)
    }

    if (isAuthDataLoading || errorAuthData) return <Loader isFade={true} />

    return (
        <div className="w-full min-h-[calc(100vh-82px)] flex items-center justify-center">
            <div className="my-2 w-full flex-1 items-center flex flex-col">
                <div className="bg-white py-6 px-9 rounded-2xl max-w-2/5 max-lg:max-w-9/11 max-sm:max-w-9/10 w-full flex flex-col items-center">
                    <div className="mb-5 flex justify-center">
                        <UserIcon nameFirstSymbol={profileData?.name && profileData?.name[0]} colorBackgroundIcon={profileData?.color} />
                    </div>
                    <div className="border-2 flex flex-col items-center p-5 rounded-2xl border-gray-300">
                        <span className="font-bold text-xl">
                            {profileData?.name}
                        </span>
                        <span className="font-bold mt-4 text-xl">
                            {profileData?.email}
                        </span>
                        <span className="font-bold mt-4 text-xl">
                            ⚲ {profileData?.city}
                        </span>
                        <span className="font-bold mt-4 text-lg">
                            id: {profileData?.id}
                        </span>

                        <div className="font-bold mt-4 text-lg w-full">
                            <span className="flex h-full items-center justify-around">
                                Двойная защита: {profileData.FA2 ? (
                                    <Btn text='Выключить' type='button' onAction={onShow2FATurnOff} />
                                ) : (
                                    <form className="-mt-4" onSubmit={onActionTurnOn2FA}>
                                        <Btn text='Включить' type='submit' />
                                    </form>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="w-full flex justify-between mt-5">
                        <LinkNavigate path='/update-profile' text='Редактировать' />
                        <Btn text='Выйти' type='button' onAction={onLogout} />
                    </div>
                </div>
            </div>
            {isShowTurnOff2FA && (
                <div className={`flex justify-center items-center fixed top-0 left-0 w-full h-full
                            bg-black/50 transition-all duration-200 ease-out
                            ${isShowTurnOff2FAFade ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2'}`}
                >
                    <FormTurnOff2FA userId={authData?.user?.id}
                        closeShowTornOff2FAForm={closeShowTurnOff2FAForm}
                        authDataRefetch={authDataRefetch} />
                </div>
            )}
            {isShow2FA &&
                (
                    <PopUpPin2FA pin={pin} isShow2FA={isShow2FA}
                        setIsShow2FA={setIsShow2FA} isShow2FAFade={isShow2FAFade}
                        setIsShow2FAFade={setIsShow2FAFade} authDataRefetch={authDataRefetch} />
                )}
        </div>
    )
}

export default ProfilePage