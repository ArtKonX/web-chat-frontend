/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import RegistrationPage from '@/pages-components/RegistarationPage/RegistarationPage';
import { mockResponses } from '../../../mocks/handlers';
import * as authApi from '@/redux/services/authApi';
import * as selectors from '@/selectors/selectors';
import * as useSelector from '@/hooks/useTypedSelector';
import * as NavigateNext from 'next/navigation';
import * as testServerApi from '@/redux/services/testWorkServerApi';
import * as validateEmail from '@/utils/validateEmail';
import * as generateKeyPair from '@/utils/encryption/generateKeyPair';
import * as savePrivateKeyToIndexedDB from '@/utils/encryption/indexedDB/savePrivateKeyToIndexedDB';
import * as getGeoCoors from '@/utils/getGeoCoors';
import * as fetchCityFromCoors from '@/utils/fetchCityFromCoors';
import { useDispatch } from 'react-redux'
import { act } from '@testing-library/react'
import { FormRegistrationOrLoginProps } from '@/interfaces/components/form-registaration-or-login';
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

type MockValue = {
    mockReturnValue: jest.Mock
    mockResolvedValue: jest.Mock
    mockImplementation: jest.Mock
}

jest.mock('@/components/FormRegistarationOrLogin/FormRegistarationOrLogin', () => {
    return function MockForm({ onSubmit, onChange, formState, errors }: FormRegistrationOrLoginProps) {
        return (
            <form onSubmit={onSubmit} data-testid="mock-form">
                <input
                    name="name"
                    value={formState.name}
                    onChange={onChange}
                    data-testid="name-input"
                />
                <input
                    name="email"
                    value={formState.email}
                    onChange={onChange}
                    data-testid="email-input"
                />
                <input
                    name="password"
                    value={formState.password}
                    onChange={onChange}
                    data-testid="password-input"
                    type="password"
                />
                <input
                    name="checkPassword"
                    value={formState.checkPassword}
                    onChange={onChange}
                    data-testid="checkPassword-input"
                    type="password"
                />
                {errors.name && <span data-testid="name-error">Ошибка имени</span>}
                {errors.email && <span data-testid="email-error">Ошибка email</span>}
                {errors.password && <span data-testid="password-error">Ошибка пароля</span>}
                {errors.checkPassword && <span data-testid="checkPassword-error">Ошибка подтверждения</span>}
                <button type="submit" data-testid="submit-button">Регистрация</button>
            </form>
        );
    };
});

jest.mock('@/components/ui/Loader/Loader', () => {
    return function MockLoader({ isFade }: { isFade: boolean }) {
        return <div data-testid="loader" data-isfade={isFade}>Загрузка...</div>;
    };
});

jest.mock('@/utils/validateEmail');
jest.mock('@/utils/encryption/generateKeyPair');
jest.mock('@/utils/encryption/indexedDB/savePrivateKeyToIndexedDB');
jest.mock('@/utils/getGeoCoors');
jest.mock('@/utils/fetchCityFromCoors');
jest.mock('next/navigation');
jest.mock('@/selectors/selectors');
jest.mock('@/hooks/useTypedSelector');

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

describe('RegistrationPage', () => {
    let mockPush: MockValue, mockRouter: MockValue, mockUseRegistarationMutation: MockValue, mockUseUpdateCityMutation: MockValue;
    let mockUseCheckAuthQuery: MockValue, mockValidateEmail: MockValue, mockGenerateKeyPair: MockValue, mockSavePrivateKeyToIndexedDB: MockValue

    let dispatchMock: jest.Mock;
    const response = mockResponses as unknown as { [key in string]: { success: boolean } }

    afterEach(() => {
        jest.clearAllMocks();

        response.registration = { success: true };
        response.updateCity = { success: true };

        const mockTestServer = jest.fn().mockResolvedValue({
            error: {
                data: {
                    status: 'ok',
                    message: 'Успешное соединение с сервером'
                }
            }
        });

        jest.spyOn(testServerApi as unknown as any, 'useTestWorkServerQuery').mockReturnValue([
            mockTestServer,
            {
                data: {
                    status: 'ok',
                    message: 'Успешное соединение с сервером'
                },
                isLoading: false
            }
        ]);
    });

    beforeEach(() => {
        mockPush = jest.fn() as unknown as MockValue;
        mockRouter = jest.spyOn(NavigateNext, 'useRouter') as unknown as MockValue
        mockRouter.mockReturnValue({
            push: mockPush,
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        })

        dispatchMock = jest.fn();
        (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

        const useSelectorMock = jest.spyOn(useSelector, 'useSelector');
        useSelectorMock.mockImplementation((selector) => {
            if (selector === selectors.selectTokenState) {
                return { token: 'test-token' };
            }
            return null;
        });

        mockUseCheckAuthQuery = jest.spyOn(authApi, 'useCheckAuthQuery') as unknown as MockValue;
        mockUseCheckAuthQuery.mockReturnValue({
            data: null,
            isLoading: false,
            refetch: jest.fn(),
        });

        mockUseRegistarationMutation = jest.spyOn(authApi, 'useRegistarationMutation') as unknown as MockValue;
        mockUseRegistarationMutation.mockReturnValue([
            jest.fn(),
            { data: null, isLoading: false, error: null }
        ]);

        mockUseUpdateCityMutation = jest.spyOn(authApi, 'useUpdateCityMutation') as unknown as MockValue;
        mockUseUpdateCityMutation.mockReturnValue([
            jest.fn(),
            { data: null, isLoading: false, error: null }
        ]);

        mockValidateEmail = jest.spyOn(validateEmail, 'default') as unknown as MockValue;

        mockValidateEmail.mockReturnValue({
            valid: true,
            error: null
        });

        mockGenerateKeyPair = jest.spyOn(generateKeyPair, 'generateKeyPair') as unknown as MockValue;

        mockGenerateKeyPair.mockResolvedValue({
            publicKey: {
                kty: 'RSA', n: 'test-n', e: 'test-e',
                alg: '',
                ext: false
            },
            privateKey: { kty: 'RSA', n: 'test-n', d: 'test-d' },
        });

        mockSavePrivateKeyToIndexedDB = jest.spyOn(savePrivateKeyToIndexedDB, 'savePrivateKeyToIndexedDB') as unknown as MockValue;
        mockSavePrivateKeyToIndexedDB.mockResolvedValue(undefined);

        const mockGetGeoCoors = jest.spyOn(getGeoCoors, 'default') as unknown as MockValue;

        mockGetGeoCoors.mockResolvedValue({ latitude: 55.7558, longitude: 37.6173 });

        const mockFetchCityFromCoors = jest.spyOn(fetchCityFromCoors, 'default') as unknown as MockValue;

        mockFetchCityFromCoors.mockResolvedValue('Moscow');

        response.registration = { success: true };
        response.updateCity = { success: true };

        const mockTestServer = jest.fn().mockResolvedValue({
            error: {
                data: {
                    status: 'ok',
                    message: 'Успешное соединение с сервером'
                }
            }
        });

        jest.spyOn(testServerApi as unknown as any, 'useTestWorkServerQuery').mockReturnValue([
            mockTestServer,
            {
                data: {
                    status: 'ok',
                    message: 'Успешное соединение с сервером'
                },
                isLoading: false
            }
        ]);
    });

    test('корректно рендерит страницу регистрации', () => {
        getProviderWithStore(
            <RegistrationPage />
        );

        expect(screen.getByTestId('mock-form')).toBeInTheDocument();
        expect(screen.getByTestId('submit-button')).toBeInTheDocument();
    });

    test('показывает загрузчик при загрузке', () => {
        mockUseRegistarationMutation.mockReturnValue([jest.fn(), { data: null, isLoading: true, error: null }]);

        getProviderWithStore(
            <RegistrationPage />
        );

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('обрабатывает изменение полей формы', async () => {
        getProviderWithStore(
            <RegistrationPage />
        );

        await act(async () => {
            const nameInput = screen.getByTestId('name-input');
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const checkPasswordInput = screen.getByTestId('checkPassword-input');

            fireEvent.change(nameInput, { target: { name: 'name', value: 'Test User' } });
            fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });
            fireEvent.change(checkPasswordInput, { target: { name: 'checkPassword', value: 'password123' } });


            const formElements = [nameInput, emailInput, passwordInput, checkPasswordInput];
            const formValues = [] as string[];

            formElements.forEach(elem => {
                const elemInput = elem as unknown as { [key in string]: string }
                formValues.push(elemInput.value)
            })

            expect(formValues[0]).toBe('Test User');
            expect(formValues[1]).toBe('test@example.com');
            expect(formValues[2]).toBe('password123');
            expect(formValues[3]).toBe('password123');
        });
    });

    test('валидирует форму и показывает ошибки', async () => {
        mockValidateEmail.mockReturnValue({ valid: false });

        getProviderWithStore(
            <RegistrationPage />
        );

        await act(async () => {
            const form = screen.getByTestId('mock-form');
            fireEvent.submit(form);

            await waitFor(() => {
                expect(screen.getByTestId('name-error')).toBeInTheDocument();
                expect(screen.getByTestId('email-error')).toBeInTheDocument();
                expect(screen.getByTestId('password-error')).toBeInTheDocument();
                expect(screen.getByTestId('checkPassword-error')).toBeInTheDocument();
            });
        })
    });

    test('успешно регистрирует пользователя', async () => {
        const mockRegister = jest.fn();
        const mockUpdateCity = jest.fn();
        mockUseRegistarationMutation.mockReturnValue([mockRegister, { data: { status: 'ok', user: { id: '123', token: 'new-token' } }, isLoading: false, error: null }]);
        mockUseUpdateCityMutation.mockReturnValue([mockUpdateCity, { data: { status: 'ok' }, isLoading: false }]);

        getProviderWithStore(
            <RegistrationPage />
        );

        await act(async () => {
            const form = screen.getByTestId('mock-form');
            fireEvent.submit(form);

            await waitFor(() => {
                expect(mockGenerateKeyPair).toHaveBeenCalled();
                expect(mockSavePrivateKeyToIndexedDB).toHaveBeenCalled();
                expect(dispatchMock).toHaveBeenCalledWith({ type: 'tokenState/addToken', payload: { token: JSON.stringify('new-token') } });
                expect(mockPush).toHaveBeenCalledWith('/');
            })
        });
    });

    test('не регистрирует при ошибках валидации', async () => {
        const mockRegister = jest.fn();
        mockUseRegistarationMutation.mockReturnValue([mockRegister, { data: null, isLoading: false, error: null }]);
        mockValidateEmail.mockReturnValue({ valid: false });

        getProviderWithStore(
            <RegistrationPage />
        );

        await act(async () => {
            const form = screen.getByTestId('mock-form');
            fireEvent.submit(form);

            await waitFor(() => {
                expect(mockRegister).not.toHaveBeenCalled();
            });
        });
    });
})