import React from 'react';

import { screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateProfilePage from '../../../pages-components/UpdateProfilePage/UpdateProfilePage';
import { useDispatch } from 'react-redux';
import * as authApi from '@/redux/services/authApi';
import * as NavigateNext from 'next/navigation';
import { BtnProps, InputWithLabelAndInfoProps } from '@/interfaces/components/ui';
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

jest.mock('@/components/ui/Btn/Btn', () => {
    return function MockBtn({ type, text }: BtnProps) {
        return <button type={type} data-testid="submit-button">{text}</button>;
    };
});

jest.mock('@/components/ui/InputWithLabelAndInfo/InputWithLabelAndInfo', () => {
    return function MockInput({ type, onChange, value, name, error }: InputWithLabelAndInfoProps) {
        return (
            <div>
                <input
                    type={type}
                    onChange={onChange}
                    value={value}
                    name={name}
                    data-testid={`${error ? `${name}-error` : `${name}-input`}`}
                />
                {error && <span data-testid={`${name}-error-span`}>Ошибка</span>}
            </div>
        );
    };
});

jest.mock('next/navigation', () => ({
    useRouter: jest.fn()
}));

jest.mock('@/hooks/useTypedSelector', () => ({
    useSelector: jest.fn()
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

type MockValue = {
    mockReturnValue: jest.Mock
    mockResolvedValue: jest.Mock
    mockImplementation: jest.Mock
}

describe('UpdateProfilePage', () => {
    let mockUseCheckAuthQuery: MockValue, mockUseUpdateUserMutation: MockValue, mockRouter: MockValue;
    let mockPush: jest.Mock, dispatchMock: jest.Mock;

    afterEach(() => {
        jest.resetModules();
        document.body.innerHTML = '';
    });

    beforeEach(() => {
        mockPush = jest.fn();
        mockRouter = jest.spyOn(NavigateNext, 'useRouter') as unknown as MockValue;
        mockRouter.mockReturnValue({
            push: mockPush,
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        });

        dispatchMock = jest.fn();
        (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

        mockUseCheckAuthQuery = jest.spyOn(authApi, 'useCheckAuthQuery') as unknown as MockValue;
        mockUseCheckAuthQuery.mockReturnValue({
            data: null,
            isLoading: false,
            refetch: jest.fn(),
        });

        mockUseUpdateUserMutation = jest.spyOn(authApi, 'useUpdateUserMutation') as unknown as MockValue;
        mockUseUpdateUserMutation.mockReturnValue([
            jest.fn(),
            { data: null, isLoading: false, error: null, reset: jest.fn() }
        ]);
    });

    test('корректно рендерит форму обновления профиля', () => {
        getProviderWithStore(
            <UpdateProfilePage />
        );

        expect(screen.getByTestId('name-input')).toBeInTheDocument();
        expect(screen.getByTestId('password-input')).toBeInTheDocument();
        expect(screen.getByTestId('checkPassword-input')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('валидирует форму при отправке при пустых полях', async () => {
        getProviderWithStore(
            <UpdateProfilePage />
        );

        fireEvent.submit(screen.getByTestId('submit-button'));
        await waitFor(() => {
            expect(screen.getByTestId('name-error')).toBeInTheDocument();
        });
    });

    test('валидирует форму при отправке при пустых заполненных', async () => {
        getProviderWithStore(
            <UpdateProfilePage />
        );

        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'NewName' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId('checkPassword-input'), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByTestId('submit-button'));
        await waitFor(() => {
            expect(screen.queryByTestId('name-error')).not.toBeInTheDocument();
            expect(screen.queryByTestId('password-error')).not.toBeInTheDocument();
            expect(screen.queryByTestId('checkPassword-error')).not.toBeInTheDocument();
        });
    });

    test('корректно обрабатывает изменение полей формы', () => {
        getProviderWithStore(
            <UpdateProfilePage />
        );

        const nameInput = screen.getByTestId('name-input');
        const passwordInput = screen.getByTestId('password-input');
        const checkPasswordInput = screen.getByTestId('checkPassword-input');

        fireEvent.change(nameInput, { target: { value: 'New Name' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(checkPasswordInput, { target: { value: 'password123' } });

        const formElements = [nameInput, passwordInput, checkPasswordInput];
        const formValues = [] as string[];

        formElements.forEach(elem => {
            const elemInput = elem as unknown as { [key in string]: string }
            formValues.push(elemInput.value)
        })

        expect(formValues[0]).toBe('New Name');
        expect(formValues[1]).toBe('password123');
        expect(formValues[2]).toBe('password123');
    });

    test('перенаправляет на страницу профиля после успешного обновления', async () => {
        getProviderWithStore(
            <UpdateProfilePage />
        );

        const mockUpdateUser = jest.fn();

        mockUseUpdateUserMutation.mockReturnValue([
            mockUpdateUser,
            {
                data: { status: 'ok' },
                isLoading: false,
                error: null
            }
        ]);

        fireEvent.change(screen.getAllByTestId('name-input')[0], { target: { value: 'New Name' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId('checkPassword-input'), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByTestId('form'));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/profile');
        });
    });

    test('обрабатывает ошибку при несовпадении паролей', async () => {
        getProviderWithStore(
            <UpdateProfilePage />
        );

        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId('checkPassword-input'), { target: { value: 'wrongpassword' } });

        fireEvent.submit(screen.getByTestId('submit-button'));
        await waitFor(() => {
            expect(screen.getByTestId('password-error')).toBeInTheDocument();
            expect(screen.getByTestId('checkPassword-error')).toBeInTheDocument();
        });
    });

    test('обрабатывает ошибку not-pin-code и перенаправляет на проверку PIN', async () => {

        const mockUpdateUser = jest.fn();

        mockUseUpdateUserMutation.mockReturnValue([
            mockUpdateUser,
            {
                data: null,
                isLoading: false,
                error: {
                    data: {
                        status: 'not-pin-code'
                    }
                }
            }
        ]);

        getProviderWithStore(
            <UpdateProfilePage />
        );

        fireEvent.change(screen.getByTestId('name-input'), { target: { value: 'New Name' } });
        fireEvent.change(screen.getByTestId('password-input'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByTestId('checkPassword-input'), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/check-pin?action=update');
        });
    });

    test('корректно заполняет начальные значения из состояния', () => {
        mockUseCheckAuthQuery.mockReturnValue({
            data: {
                user: {
                    id: '123',
                    name: 'Existing Name'
                }
            },
            isLoading: false
        });

        getProviderWithStore(
            <UpdateProfilePage />
        );

        const nameInput = screen.getByTestId('name-input') as unknown as { [key in string]: string };

        expect(nameInput.value).toBe('Existing Name');
    });

    test('не отправляет форму при незаполненных полях', async () => {
        const mockUpdateUser = jest.fn();

        mockUseUpdateUserMutation.mockReturnValue([
            mockUpdateUser,
            {
                data: null,
                isLoading: false,
                error: null
            }
        ]);

        getProviderWithStore(
            <UpdateProfilePage />
        );

        fireEvent.submit(screen.getByTestId('submit-button'));

        await waitFor(() => {
            expect(mockUpdateUser).not.toHaveBeenCalled();
        });
    });
})