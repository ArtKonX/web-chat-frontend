import React from 'react';

import Btn from "@/components/ui/Btn/Btn";
import CloseBtn from "@/components/ui/CloseBtn/CloseBtn";
import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle"
import InputWithLabelAndInfo from "@/components/ui/InputWithLabelAndInfo/InputWithLabelAndInfo";
import { FA2Data, FormTurnOff2FAProps } from "@/interfaces/components/components-for-work-2fa";
import { useCheckAuthQuery, useLogoutMutation, useTurnOff2FAMutation } from "@/redux/services/authApi";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSelector } from '@/hooks/useTypedSelector';
import { selectTokenState } from '@/selectors/selectors';
import { useDispatch } from 'react-redux';
import { addToken } from '@/redux/slices/tokenSlice';
import { useRouter } from 'next/navigation';

const FormTurnOff2FA = (
    { userId, closeShowTornOff2FAForm, authDataRefetch, setIsShowWindowInfo }: FormTurnOff2FAProps) => {

    const tokenState = useSelector(selectTokenState);

    const [turnOff2FA, { data: turnOff2FAData, isLoading: isLoadingTurnOff2FaLoading, error: errorTurnOff2FA }] = useTurnOff2FAMutation<FA2Data>();

    const dispatch = useDispatch();

    const [savePin, setSavePin] = useState('');
    const [attempt, setAttempt] = useState<null | number>(null);
    const [isErrorTurnOff2FA, setIsErrorTurnOff2FA] = useState(false);

    const { refetch: authRefetch } = useCheckAuthQuery({ token: tokenState.token });

    const [logout] = useLogoutMutation();

    const router = useRouter();

    const onActionTurnOff2FA = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (savePin) {
                if (userId) {
                    turnOff2FA({ id: userId, pin: savePin, token: tokenState.token });
                    setSavePin('');
                }
            } else {
                setIsErrorTurnOff2FA(true);
                setTimeout(() => {
                    setIsErrorTurnOff2FA(false);
                }, 2000)
            }
        } catch (err) {
            console.error('Ошибка отключения 2FA ', err)
        }
    }

    const onChangePin = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setSavePin(value)
    }

    useEffect(() => {
        if (!tokenState.token) {
            router.push('/?tab=users')
        }
    }, [tokenState.token])

    useEffect(() => {

        if (errorTurnOff2FA?.data?.data?.succesPinCode === 'error') {
            setSavePin('');
            setIsShowWindowInfo(true)
            const timoutId = setTimeout(() => {
                dispatch(addToken({ token: JSON.stringify('error-success-token') }))
                logout({})
                setIsShowWindowInfo(false)
                authRefetch()
                router.push('/?tab=users')

                return () => clearTimeout(timoutId)
            }, 7000)
        }

        if (turnOff2FAData?.status === 'ok') {
            closeShowTornOff2FAForm()
            setSavePin('');
            authDataRefetch()
        } else if (errorTurnOff2FA?.data?.status === 'error') {
            setAttempt(errorTurnOff2FA?.data?.attempt)
            setIsErrorTurnOff2FA(Boolean(errorTurnOff2FA));
            setTimeout(() => {
                setIsErrorTurnOff2FA(false);
                setSavePin('');
            }, 2000)
        }
    }, [errorTurnOff2FA, turnOff2FAData, isLoadingTurnOff2FaLoading])

    return (
        <form onSubmit={onActionTurnOff2FA}
            className="form-turn-off-2fa z-100 bg-white py-6 px-9 rounded-2xl
        max-w-2/5 max-lg:max-w-9/11 max-sm:max-w-9/10
        w-full flex flex-col items-center relative dark:text-[#E1E3E6] dark:bg-[#212121]">
            <div className="absolute right-0 top-0">
                <CloseBtn onClose={closeShowTornOff2FAForm} />
            </div>
            <HeadingWithTitle text='Введите код для отключения двойной защиты:' >
                {attempt &&
                    (<span className="font-bold mb-2 text-red-500">
                        Осталось попыток: {attempt}
                    </span>)
                }
                <InputWithLabelAndInfo name='turn-off' error={isErrorTurnOff2FA} text='Код' type='text' value={savePin} onChange={onChangePin} />
                <span>
                    При отключении двойной защиты риск потери аккаунта возрастает, подумайте прежде чем это делать!
                </span>
                <div className="w-full text-end">
                    <Btn text='Отключить' type='submit' />
                </div>
            </HeadingWithTitle>
        </form>
    )
}

export default FormTurnOff2FA