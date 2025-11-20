import React from 'react';

import { FormRegistrationOrLoginProps } from "@/interfaces/components/form-registaration-or-login";
import Btn from "../ui/Btn/Btn"
import HeadingWithTitle from "../ui/HeadingWithTitle/HeadingWithTitle"
import InputWithLabelAndInfo from "../ui/InputWithLabelAndInfo/InputWithLabelAndInfo"
import Link from "next/link"

// Компонент, который может представлять, как регистрацию так и вход в систему
const FormRegistrationOrLogin = (
    { onSubmit, onChange, typeForm, formState, errors }:
        FormRegistrationOrLoginProps
) => {

    if (typeForm === 'reg') {
        return (
            <form data-testid='form' noValidate className="" onSubmit={onSubmit}>
                <HeadingWithTitle text='Регистрация в K-Чат'>
                    <div className="mb-4 flex justify-end items-center dark:text-[#E1E3E6]">
                        Уже есть K-ID? <Link className="text-amber-600/90 dark:text-[#ebb318] font-bold text-lg ml-1 hover:opacity-70 transition-opacity duration-500" href={'/login'}>Войти</Link>
                    </div>
                    <InputWithLabelAndInfo text='Имя' type='text'
                        onChange={onChange}
                        value={formState['name']!} name='name'
                        error={errors['name']!}
                    />
                    <InputWithLabelAndInfo text='Почта' type='email'
                        onChange={onChange}
                        value={formState['email']} name='email'
                        error={errors['email']} info='Email должен содержать от 6 до 254 символов, включать @ и точку.'
                    />
                    <InputWithLabelAndInfo text='Пароль' type='password'
                        onChange={onChange}
                        value={formState['password']} name='password'
                        error={errors['password']}
                    />
                    <InputWithLabelAndInfo text='Повтор пароля' type='password'
                        onChange={onChange}
                        name='checkPassword'
                        value={formState['checkPassword']!}
                        error={errors['checkPassword']!}
                    />
                    <div className="text-end">
                        <Btn type="submit" text='Зарегистрироваться' disable={Object.values(errors).some(error => error)} />
                    </div>
                </HeadingWithTitle>
            </form>
        )
    } else if (typeForm === 'log') {
        return (
            <form data-testid='form' onSubmit={onSubmit}>
                <HeadingWithTitle text='Вход в K-Чат'>
                    <div className="mb-4 flex justify-end items-center dark:text-[#E1E3E6]">
                        Ещё нет K-ID? <Link className="text-amber-600/90 dark:text-[#ebb318] font-bold text-lg ml-1 hover:opacity-70 transition-opacity duration-500" href={'/registration'}>Регистрация</Link>
                    </div>
                    <InputWithLabelAndInfo text='Ваша почта:' type='text'
                        onChange={onChange}
                        value={formState['email']} name='email'
                        error={errors['email']}
                    />
                    <InputWithLabelAndInfo text='Ваш пароль:' type='password'
                        onChange={onChange}
                        value={formState['password']} name='password'
                        error={errors['password']}
                    />
                    <div className="text-end">
                        <Btn type="submit" text='Войти' disable={Object.values(errors).some(error => error)} />
                    </div>
                </HeadingWithTitle>
            </form>
        )
    }

    return null
}

export default FormRegistrationOrLogin