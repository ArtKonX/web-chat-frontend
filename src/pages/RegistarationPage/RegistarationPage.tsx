'use client'

import React from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';
import FormRegistrationOrLogin from '@/components/FormRegistarationOrLogin/FormRegistarationOrLogin';
import { useRegistarationMutation, useUpdateCityMutation } from "@/redux/services/authApi";
import validateEmail from "@/utils/validateEmail";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from '@/hooks/useTypedSelector';
import { selectUser } from '@/selectors/selectors';
import Loader from '@/components/ui/Loader/Loader';
import { generateKeyPair } from '@/utils/encryption/generateKeyPair';
import { savePrivateKeyToIndexedDB } from '@/utils/encryption/indexedDB/savePrivateKeyToIndexedDB';
import { JWK } from '@/interfaces/encryption';
import getGeoCoors from '@/utils/getGeoCoors';
import { Coordinates } from '@/interfaces/position';
import fetchCityFromCoors from '@/utils/fetchCityFromCoors';

interface Errors {
    name: boolean;
    email: boolean;
    password: boolean;
    checkPassword: boolean;
};

const RegistrationPage = () => {

    const id = uuidv4();
    const router = useRouter();
    const [register, { data: dataRegister, isLoading: isLoadingRegister, error: registerError }] = useRegistarationMutation();
    const authData = useSelector(selectUser)

    const [successRegister, setSuccessRegister] = useState(false);

    const [isSubmit, setIsSubmit] = useState(false);

    const [publicKey, setPublicKey] = useState<JWK | null>(null)

    const [formState, setFormState] = useState({
        name: '', email: '',
        password: '', checkPassword: ''
    });
    const [errors, setErrors] = useState<Errors>({
        name: false, email: false,
        password: false, checkPassword: false
    });

    const [updateCity, { data: updateCityData, isLoading: isLoadingUpdateCity }] = useUpdateCityMutation();

    const [dataPosition, setDataPosition] = useState({ id: '', city: '' })
    const [position, setPosition] = useState({ latitude: 0, longitude: 0 });

    useEffect(() => {
        // Отправляем пользователя на главную страницу если успешная
        // регистрация или он уже входил
        if (dataRegister?.status === 'ok' && !isLoadingRegister ||
            (authData && authData?.city)) {
            setFormState({
                name: '', email: '',
                password: '', checkPassword: ''
            })
            setIsSubmit(false)
            setPublicKey(null)
            setSuccessRegister(true)
        }
    }, [dataRegister, authData,])

    useEffect(() => {
        if (!isLoadingUpdateCity && updateCityData?.status === 'ok') {
            router.push('/')
        }
    }, [isLoadingUpdateCity, updateCityData])

    useEffect(() => {
        const fetchKeys = async () => {
            const { publicKey, privateKey } = await generateKeyPair();

            savePrivateKeyToIndexedDB(privateKey);
            setPublicKey(publicKey)
        }

        if (isSubmit) {
            fetchKeys()
        }

    }, [isSubmit])

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsSubmit(true);

        const errorsInputs = Object.fromEntries(
            Object.entries(formState)
                .filter(([, value]) => value?.trim() === '')
                .map((key) => key, true)
        );

        const isValid = validateEmail(formState.email);

        if (
            formState.password !== formState.checkPassword ||
            !formState.checkPassword.trim() ||
            !formState.password.trim()
        ) {
            setErrors((prev) => ({
                ...prev,
                ...errorsInputs,
                password: true,
                checkPassword: true
            }));
        }

        if (!isValid.valid || !formState.email.trim()) {
            setErrors((prev) => ({ ...prev, email: true }));
        }

        if (!formState.name.trim() || formState.name.length <= 3) {
            setErrors((prev) => ({ ...prev, name: true }));
        }

        setTimeout(() => {
            const errorsInputs = Object.fromEntries(
                Object.entries(errors).map((key) => key, false)
            ) as Errors;

            setErrors({ ...errorsInputs });
        }, 2000);
    };

    useEffect(() => {
        if (publicKey && isSubmit) {
            if (!Object.values(errors).some(Boolean)) {
                register({
                    id: id,
                    name: formState.name,
                    email: formState.email,
                    password: formState.password,
                    publicKey: JSON.stringify(publicKey)
                });


            } else {
                setIsSubmit(false)
            }
        }
    }, [publicKey, errors])

    useEffect(() => {
        getGeoCoors().then(geoCoors => {
            const coors = geoCoors as Coordinates;

            setPosition(coors);
        })
    }, [])

    useEffect(() => {
        if (position && successRegister && dataRegister?.user.id) {
            fetchCityFromCoors({ position }).then(res => {
                if (res) {
                    const dataPosition = {
                        id: dataRegister?.user.id,
                        city: res
                    }

                    setDataPosition(dataPosition)
                }
            })
        }
    }, [position, successRegister])

    useEffect(() => {
        if (dataPosition) {
            updateCity(dataPosition)
        }
    }, [dataPosition, setDataPosition])

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value })
    }

    return (
        <div className="w-full min-h-[calc(100vh-82px)] flex items-center">
            <div className="my-2 w-full flex justify-center">
                <div className="bg-white py-6 px-9 rounded-2xl
                max-w-2/5 w-full max-sm:max-w-full max-sm:mx-4">
                    <FormRegistrationOrLogin
                        onSubmit={onSubmit} onChange={onChange}
                        typeForm='reg' formState={formState}
                        errors={errors}
                    />
                </div>
            </div>
            {(isLoadingRegister || isLoadingUpdateCity || registerError) && <Loader isFade={Boolean(isLoadingRegister || isLoadingUpdateCity || registerError)} />}
        </div>
    )
}

export default RegistrationPage