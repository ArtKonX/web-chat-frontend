'use client'

import Btn from "@/components/ui/Btn/Btn"
import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle"
import InputWithLabelAndInfo from "@/components/ui/InputWithLabelAndInfo/InputWithLabelAndInfo"
import Loader from "@/components/ui/Loader/Loader"
import { useSelector } from "@/hooks/useTypedSelector"
import { useLoginMutation, useUpdateUserMutation } from "@/redux/services/authApi"
import { resetDataAuth } from "@/redux/slices/authSlice"
import { selectAuthState } from "@/selectors/selectors"
import { useRouter, useSearchParams } from "next/navigation"
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { useDispatch } from "react-redux"

interface LoginMutation {
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
                attempt: number
            }
        }
    }
}

const CheckPinPage = () => {

    const auth = useSelector(selectAuthState);

    const [login, { data: dataLogin, isLoading: isLoginLoading, error: loginError }] = useLoginMutation<LoginMutation>();
    const [updateUser, { data: updateData, isLoading: isUpdateLoading, error: updateError }] = useUpdateUserMutation<UpdateMutation>();

    const dispatch = useDispatch();
    const router = useRouter();

    const [pin, setPin] = useState('');
    const [attempt, setAttempt] = useState<null | number>(null);

    const searchParams = useSearchParams();

    const onSendPin = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPin('');
        if (searchParams?.get('action') === 'login') {
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
                pin: pin
            })
        }
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setPin(value);
    }

    useEffect(() => {
        if (loginError?.data?.status === 'error') {
            setAttempt(loginError?.data?.data?.attempt)
        } else if (dataLogin?.status === 'ok') {
            dispatch(resetDataAuth())
            window.location.reload();
            router.push('/')
        }
    }, [dataLogin, loginError])

    useEffect(() => {
        if (updateError?.data?.status === 'error') {
            setAttempt(updateError?.data?.data?.attempt)
        } else if (updateData?.status === 'ok') {
            dispatch(resetDataAuth())
            router.push('/profile')
        }
    }, [updateData, updateError])

    return (
        <div className={`flex justify-center items-center fixed top-0 left-0 w-full h-full
                            bg-black/50 transition-all duration-200 ease-out
                            ${true ? 'opacity-100 scale-100 translate-y-0'
                : 'opacity-0 scale-95 -translate-y-2'}`}
        >
            {(isLoginLoading || loginError || isUpdateLoading || updateError) && <Loader isFade={true} />}
            <form onSubmit={onSendPin}
                className="z-100 bg-white py-6 px-9 rounded-2xl max-w-2/5 max-lg:max-w-9/11 max-sm:max-w-10/11 w-full flex
                flex-col items-center relative">
                <HeadingWithTitle text='Введите код для двойной защиты:' >
                    {attempt &&
                        (<span className="font-bold mb-2 text-red-500">
                            Осталось попыток: {attempt}
                        </span>)
                    }
                    <InputWithLabelAndInfo error={false} text='Код' type='text' value={pin} onChange={onChange} />
                    <span>
                        Введите код, который был Вам предоставлен при подключении двойной защиты
                    </span>
                    <div className="w-full text-end">
                        <Btn text='Проверить' type='submit' />
                    </div>
                </HeadingWithTitle>
            </form>
        </div>
    )
}

export default CheckPinPage