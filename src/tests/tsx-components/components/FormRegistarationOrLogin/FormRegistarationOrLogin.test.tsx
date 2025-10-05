import React from 'react'
import { screen, fireEvent } from '@testing-library/react'
import FormRegistrationOrLogin from '@/components/FormRegistarationOrLogin/FormRegistarationOrLogin'
import userEvent from '@testing-library/user-event'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore'

describe('FormRegistrationOrLogin', () => {
    const defaultRegState = {
        name: '',
        email: '',
        password: '',
        checkPassword: '',
    }
    const defaultLogState = {
        email: '',
        password: '',
    }
    const noErrorsReg = { name: false, email: false, password: false, checkPassword: false }
    const noErrorsLog = { email: false, password: false }

    afterEach(() => {
        jest.clearAllMocks()
        jest.resetModules();
        document.body.innerHTML = '';
    });

    test('рендерит форму регистрации с нужными полями и ссылкой', () => {
        const onSubmit = jest.fn((e) => e.preventDefault())
        const onChange = jest.fn()

        getProviderWithStore(
            <FormRegistrationOrLogin
                typeForm="reg"
                onSubmit={onSubmit}
                onChange={onChange}
                formState={defaultRegState}
                errors={noErrorsReg}
            />
        )

        expect(screen.getByRole('heading', { name: /Регистрация в K-Чат/i })).toBeInTheDocument()
        expect(screen.getByText('Уже есть K-ID?')).toBeTruthy()
        expect(screen.getByRole('link', { name: /Войти/i })).toHaveAttribute('href', '/login')

        expect(screen.getByLabelText('Имя')).toHaveValue('')
        expect(screen.getByLabelText('Почта')).toHaveValue('')
        expect(screen.getByLabelText('Пароль')).toHaveValue('')
        expect(screen.getByLabelText('Повтор пароля')).toHaveValue('')

        const btn = screen.getByRole('button', { name: /Зарегистрироваться/i })
        expect(btn).toBeEnabled()
    })

    test('рендерит форму входа с нужными полями и ссылкой', () => {
        const onSubmit = jest.fn((e) => e.preventDefault())
        const onChange = jest.fn()

        getProviderWithStore(
            <FormRegistrationOrLogin
                typeForm="log"
                onSubmit={onSubmit}
                onChange={onChange}
                formState={defaultLogState}
                errors={noErrorsLog}
            />
        )

        expect(screen.getByRole('heading', { name: /Вход в K-Чат/i })).toBeInTheDocument()
        expect(screen.getByText('Ещё нет K-ID?')).toBeTruthy()
        expect(screen.getByRole('link', { name: /Регистрация/i })).toHaveAttribute('href', '/registration')

        expect(screen.getByLabelText('Ваша почта:')).toHaveValue('')
        expect(screen.getByLabelText('Ваш пароль:')).toHaveValue('')

        const btn = screen.getByRole('button', { name: /Войти/i })
        expect(btn).toBeEnabled()
    })

    test('кнопка отправки отключена, если есть ошибки', () => {
        const onSubmit = jest.fn((e) => e.preventDefault())
        const onChange = jest.fn()

        const errorsReg = { name: true, email: false, password: false, checkPassword: false }

        getProviderWithStore(
            <FormRegistrationOrLogin
                typeForm="reg"
                onSubmit={onSubmit}
                onChange={onChange}
                formState={defaultRegState}
                errors={errorsReg}
            />
        )
        expect(screen.getByRole('button', { name: /Зарегистрироваться/i })).toBeDisabled()

        const errorsLog = { email: true, password: false }

        getProviderWithStore(
            <FormRegistrationOrLogin
                typeForm="log"
                onSubmit={onSubmit}
                onChange={onChange}
                formState={defaultLogState}
                errors={errorsLog}
            />
        )

        expect(screen.getByRole('button', { name: /Войти/i })).toBeDisabled()
    })

    test('вызывается onChange при изменении поля', async () => {
        const onSubmit = jest.fn((e) => e.preventDefault())
        const onChange = jest.fn()

        getProviderWithStore(
            <FormRegistrationOrLogin
                typeForm="reg"
                onSubmit={onSubmit}
                onChange={onChange}
                formState={defaultRegState}
                errors={noErrorsReg}
            />
        )

        const input = screen.getByLabelText('Имя')
        await userEvent.type(input, 'John')

        expect(onChange).toHaveBeenCalled()
    })

    test('вызывается onSubmit при сабмите формы', () => {
        const onSubmit = jest.fn((e) => e.preventDefault())
        const onChange = jest.fn()

        getProviderWithStore(
            <FormRegistrationOrLogin
                typeForm="log"
                onSubmit={onSubmit}
                onChange={onChange}
                formState={defaultLogState}
                errors={noErrorsLog}
            />
        )

        fireEvent.submit(document.querySelector('form') || screen.getByTestId('form') || screen.getByRole('button', { name: /Войти/i }).closest('form'))

        expect(onSubmit).toHaveBeenCalled()
    })
})