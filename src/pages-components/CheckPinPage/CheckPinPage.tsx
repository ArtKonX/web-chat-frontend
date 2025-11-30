'use client'

import React from 'react';

import Btn from "@/components/ui/Btn/Btn"
import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle"
import InputWithLabelAndInfo from "@/components/ui/InputWithLabelAndInfo/InputWithLabelAndInfo"
import Loader from "@/components/ui/Loader/Loader"
import { useSelector } from "@/hooks/useTypedSelector"
import { useCheckAuthQuery, useLoginMutation, useLogoutMutation, useUpdateUserMutation } from "@/redux/services/authApi"
import { resetDataAuth } from "@/redux/slices/authSlice"
import { selectAuthState, selectIsCheckPinCodeState, selectTokenState } from "@/selectors/selectors"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { addToken } from '@/redux/slices/tokenSlice';
import { getCachedUser } from '@/cashe/userCache';
import WarningWindow from '@/components/WarningWindow/WarningWindow';

interface LoginMutation {
    data: {
        status: string,
        data: {
            attempt: number
        },
        user: {
            token: string
        }
    },
    isLoading: boolean,
    error: {
        data: {
            status: string,
            data: {
                succesPinCode: string,
                attempt: number
            }
        }
    }
}

interface UpdateMutation {
    data: {
        status: string,
        data: {
            attempt: number
        }
    },
    isLoading: boolean,
    error: {
        data: {
            status: string,
            data: {
                attempt: number,
                succesPinCode?: string
            }
        }
    }
}

const CheckPinPage = () => {

    const auth = useSelector(selectAuthState);
    const tokenState = useSelector(selectTokenState);

    const isCheckPinCodeState = useSelector(selectIsCheckPinCodeState)

    const [isErrorAction, setIsErrorAction] = useState(false);

    const [login, { data: dataLogin, isLoading: isLoginLoading, error: loginError }] = useLoginMutation<LoginMutation>();
    const [updateUser, { data: updateData, isLoading: isUpdateLoading, error: updateError }] = useUpdateUserMutation<UpdateMutation>();

    const [logout, { data: logoutData }] = useLogoutMutation();

    const { data: authData, isLoading: isLoadingAuth, refetch: authRefetch } = useCheckAuthQuery({ token: tokenState.token });

    const dispatch = useDispatch();
    const router = useRouter();

    const [pin, setPin] = useState('');
    const [attempt, setAttempt] = useState<null | number>(null);

    const [isShowWindowInfo, setIsShowWindowInfo] = useState(false)

    const searchParams = useSearchParams();

    useEffect(() => {
        (async () => {
            const userData = await getCachedUser();

            if (!isLoadingAuth && !isCheckPinCodeState.isCheckPinCode && !userData.length && !authData?.user) {
                router.push('/?tab=users')
            }

            if (!auth.email && userData.length && authData?.user && !isCheckPinCodeState.isCheckPinCode) {

                router.push('/?tab=users')
            }
        })()
    }, [authData, isLoadingAuth, logoutData, auth])

    useEffect(() => {
        if (!isLoadingAuth && loginError?.data?.data.succesPinCode === 'error') {
            setIsShowWindowInfo(true)
            const timoutId = setTimeout(() => {
                setIsShowWindowInfo(false)
                router.push('/?tab=users')
            }, 7000)

            return () => clearTimeout(timoutId)
        }
    }, [isLoadingAuth, loginError])

    const onSendPin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (pin) {
            setPin('');
            console.log('Отправляем форму');

            if (searchParams?.get('action') === 'login') {
                console.log('Вызываем login мутацию');
                login({
                    email: auth.email,
                    password: auth.password,
                    pin: pin
                });
            } else if (searchParams?.get('action') === 'update') {

                updateUser({
                    id: auth.id,
                    name: auth.name ? auth.name : null,
                    password: auth.password ? auth.password : null,
                    pin: pin,
                    token: tokenState.token
                })
            }
        } else {
            setIsErrorAction(true);
            setTimeout(() => {
                setIsErrorAction(false);
            }, 2000)
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setPin(value);
    }

    useEffect(() => {
        if (!auth.id) {
            // router.push('/')
        }
    }, [auth])

    useEffect(() => {
        if (!isLoginLoading) {
            if (loginError?.data?.status === 'error') {
                setPin('');
                setAttempt(loginError?.data?.data?.attempt)
                setIsErrorAction(true);
                setTimeout(() => {
                    setIsErrorAction(false);
                }, 2000)
            } else if (dataLogin?.status === 'ok' && dataLogin?.user?.token) {
                setPin('');
                dispatch(addToken({ token: JSON.stringify(dataLogin?.user?.token) }))
                dispatch(resetDataAuth())
                window.location.reload();
                router.push('/?tab=users')
            }
        }
    }, [dataLogin, loginError, isLoginLoading])

    useEffect(() => {

        if (!isUpdateLoading) {

            if (!isUpdateLoading && updateError?.data?.status === 'error-with-pin-code') {
                setIsShowWindowInfo(true)
                setPin('');

                const timoutId = setTimeout(() => {
                    setIsShowWindowInfo(false)
                    dispatch(addToken({ token: JSON.stringify('error-success-token') }))
                    logout({})
                    authRefetch()
                }, 7000)

                return () => clearTimeout(timoutId)
            }
            if (updateError?.data?.status === 'error') {
                if (updateError?.data?.data?.succesPinCode === 'error') {
                    setIsShowWindowInfo(true)
                    setPin('');

                    const timoutId = setTimeout(() => {
                        setIsShowWindowInfo(false)
                        dispatch(addToken({ token: JSON.stringify('error-success-token') }))
                        logout({})
                    }, 7000)

                    return () => clearTimeout(timoutId)
                }
                setIsErrorAction(true);
                setTimeout(() => {
                    setIsErrorAction(false);
                }, 2000)
                setAttempt(updateError?.data?.data?.attempt)
            } else if (updateData?.status === 'ok') {
                setPin('');
                dispatch(resetDataAuth())
                router.push('/profile')
            }
        }
    }, [updateData, updateError, isUpdateLoading])

    return (
        <div className="w-full min-h-[calc(100vh-442px)] pb-[40px] pt-[15px] flex items-center justify-center">
            {(isLoginLoading || isUpdateLoading) && <Loader isFade={true} />}
            {isShowWindowInfo ? (<WarningWindow title='Доступ к Вашему аккаунту ограничен!' text='К сожалению, все возможные попытки закончились! Ваш аккаунт заблокирован на 2 недели из-за подозрения!' timeCount={7} />) : null}
            {/* <div className='min-h-[calc(100%-442px)] w-full pb-[40px] pt-[15px] flex justify-center'> */}
            {!isShowWindowInfo ? (
                <div className={`flex pt-[65px] justify-center items-center fixed top-0 left-0 w-full h-full
                            transition-all duration-200 ease-out
                            ${true ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 -translate-y-2'}`}
                >
                    <div className="w-full min-h-[calc(100vh-442px)] pb-[40px] pt-[15px] flex items-center justify-center relative">
                        <form data-testid="form" onSubmit={onSendPin}
                            className="z-100 dark:text-[#E1E3E6] dark:bg-[#222222] bg-white py-6 px-9 rounded-2xl max-w-2/5 max-lg:max-w-9/11 max-sm:max-w-10/11 w-full flex
                flex-col items-center relative">
                            <HeadingWithTitle text='Введите код для двойной защиты:' >
                                {attempt &&
                                    (<span className="font-bold mb-2 text-red-500">
                                        Осталось попыток: {attempt}
                                    </span>)
                                }
                                <InputWithLabelAndInfo error={isErrorAction} text='Код' type='text' value={pin} onChange={onChange} />
                                <span>
                                    Введите код, который был Вам предоставлен при подключении двойной защиты
                                    {/* {loginError ? String(loginError?.data?.data?.attempt) : null} */}
                                    {/* {dataLogin && String(Object.keys(dataLogin).join(' '))} */}
                                </span>
                                <div className="w-full text-end">
                                    <Btn text='Проверить' type='submit' />
                                </div>
                            </HeadingWithTitle>
                        </form>
                    </div>
                </div>
            ) : null}
        </div>
    )
}

export default CheckPinPage