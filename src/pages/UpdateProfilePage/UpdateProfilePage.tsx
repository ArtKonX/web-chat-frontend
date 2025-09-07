'use client'

import Btn from "@/components/ui/Btn/Btn"
import HeadingWithTitle from "@/components/ui/HeadingWithTitle/HeadingWithTitle"
import InputWithLabelAndInfo from "@/components/ui/InputWithLabelAndInfo/InputWithLabelAndInfo"
import { useSelector } from "@/hooks/useTypedSelector";
import { useUpdateUserMutation } from "@/redux/services/authApi";
import { addDataAuth } from "@/redux/slices/authSlice";
import { selectUser } from "@/selectors/selectors";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";

interface Errors {
    name: boolean;
    password: boolean;
    checkPassword: boolean;
};

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

const UpdateProfilePage = () => {

    const authData = useSelector(selectUser);
    const router = useRouter();

    const dispatch = useDispatch();

    const [updateUser, { data: updateData, isLoading: isUpdateLoading, error: errorUpdate }] = useUpdateUserMutation<UpdateMutation>();
    const [formState, setFormState] = useState({
        name: '',
        password: '',
        checkPassword: ''
    });
    const [errors, setErrors] = useState<Errors>({
        name: false,
        password: false,
        checkPassword: false
    });

    useEffect(() => {
        if (authData?.name) {
            setFormState({ ...formState, name: authData?.name })
        }
    }, [authData])

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errorsInputs = Object.fromEntries(
            Object.entries(formState)
                .filter(([, value]) => value?.trim() === '')
                .map((key) => key, true)
        );

        if (
            formState.password !== formState.checkPassword
        ) {
            setErrors({
                ...errors,
                ...errorsInputs,
                password: true,
                checkPassword: true
            });
        }

        if (formState.name.trim() === '') {
            setErrors({
                ...errors,
                ...errorsInputs,
                name: true,
            });
        }

        setTimeout(() => {
            const errorsInputs = Object.fromEntries(
                Object.entries(errors).map((key) => key, false)
            ) as Errors;
            setErrors({ ...errorsInputs });
        }, 2000);

        if (!Object.values(errors).some(Boolean)) {
            try {
                const updateData = {
                    id: authData?.id,
                    name: formState.name,
                    password: formState.password
                }

                updateUser(updateData);
            } catch (e) {
                console.error(e)
            }
        }
    }

    useEffect(() => {
        if (!isUpdateLoading) {
            if (updateData?.status === 'ok') {
                router.push('/profile');
            } else if (errorUpdate?.data?.status === 'not-pin-code') {
                dispatch(addDataAuth({ id: authData?.id, type: 'update', name: formState.name, password: formState.password }))
                router.push('/check-pin?action=update')
            }
        }
    }, [updateData, authData, errorUpdate, formState])

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormState({ ...formState, [name]: value })
    }

    return (
        <div className="w-full min-h-[calc(100vh-82px)] flex items-center justify-center">
            <div className="my-2 w-full flex-1 items-center flex flex-col">
                <div className="bg-white py-6 px-9 rounded-2xl max-w-2/5 max-lg:max-w-9/11 max-sm:max-w-10/11 w-full flex flex-col items-center">
                    <form noValidate className="w-full" onSubmit={onSubmit}>
                        <HeadingWithTitle text='Обновление данных'>
                            <InputWithLabelAndInfo text='Имя' type='text'
                                onChange={onChange}
                                value={formState['name']} name='name'
                                error={errors['name']}
                            />
                            <InputWithLabelAndInfo text='Новый Пароль' type='password'
                                onChange={onChange}
                                value={formState['password']} name='password'
                                error={errors['password']}
                            />
                            <InputWithLabelAndInfo text='Повтор пароля' type='password'
                                onChange={onChange}
                                name='checkPassword'
                                value={formState['checkPassword']}
                                error={errors['checkPassword']}
                            />
                            <div className="text-end">
                                <Btn type="submit" text='Изменить данные' />
                            </div>
                        </HeadingWithTitle>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpdateProfilePage