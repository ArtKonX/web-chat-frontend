'use client'

import React from 'react';

import FormRegistrationOrLogin from "@/components/FormRegistarationOrLogin/FormRegistarationOrLogin";
import Loader from "@/components/ui/Loader/Loader";
import { useSelector } from "@/hooks/useTypedSelector";
import { useCheckAuthQuery, useLoginMutation } from "@/redux/services/authApi";
import { addDataAuth } from "@/redux/slices/authSlice";
import validateEmail from "@/utils/validateEmail";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addToken } from '@/redux/slices/tokenSlice';
import { selectTokenState } from '@/selectors/selectors';

interface Errors {
    email: boolean;
    password: boolean;
};

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
    error: {
        data: {
            status: string,
            data: {
                attempt: number
            }
        }
    },
    isLoading: boolean
}

const LoginPage = () => {

    const router = useRouter()
    const tokenState = useSelector(selectTokenState);
    
    const [login, { data: dataLogin, isLoading: isDataLoading, error: errorLogin }] = useLoginMutation<LoginMutation>();
    const { data: authData } = useCheckAuthQuery({ token: tokenState.token });
    const dispatch = useDispatch();

    const [isSubmit, setIsSubmit] = useState(false);

    const [formState, setFormState] = useState({
        email: '', password: ''
    });
    const [errors, setErrors] = useState<Errors>({
        email: false, password: false,
    });

    useEffect(() => {
        if ((dataLogin?.status === 'ok' && dataLogin?.user?.token) ||
            (authData)) {
            dispatch(addToken({ token: JSON.stringify(dataLogin?.user?.token) }))
            router.push('/');
        } else if (errorLogin?.data?.status === 'not-pin-code') {
            dispatch(addDataAuth({ type: 'login', email: formState.email, password: formState.password }))
            router.push('/check-pin?action=login')
        }
    }, [dataLogin, authData, errorLogin])

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmit(true)

        const isValid = validateEmail(formState.email);

        if (!formState.email.trim() || !isValid.valid) {
            setErrors(prev => ({ ...prev, email: true }));
        }

        if (!formState.password.trim()) {
            setErrors(prev => ({ ...prev, password: true }));
        }

        if (
            !formState.password.trim()
        ) {
            setErrors(prev => ({
                ...prev,
                password: true,
            }));
        }

        setTimeout(() => {
            const errorsInputs = Object.fromEntries(
                Object.entries(errors).map((key) => key, false)
            ) as Errors;

            setErrors({ ...errorsInputs });
        }, 2000);
    };

    useEffect(() => {
        if (isSubmit) {
            if (!Object.values(errors).some(Boolean)) {
                login({
                    email: formState.email,
                    password: formState.password
                });
            } else {
                setIsSubmit(false)
            }
        }
    }, [setIsSubmit, isSubmit, errors])

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value })
    }


    return (
        <div className="w-full min-h-[calc(100vh-82px)] flex items-center">
            {isDataLoading || errorLogin && <Loader isFade={true} />}
            <div className="my-2 w-full flex justify-center">
                <div className="bg-white py-6 px-9 max-sm:mx-4 rounded-2xl
                max-w-2/5 w-full max-sm:max-w-full">
                    <FormRegistrationOrLogin
                        onSubmit={onSubmit} onChange={onChange}
                        typeForm='log' formState={formState}
                        errors={errors}
                    />
                </div>
            </div>
        </div>
    )
}

export default LoginPage