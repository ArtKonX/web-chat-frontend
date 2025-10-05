import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import * as authApi from '@/redux/services/authApi';
import LoginPage from '@/pages-components/LoginPage/LoginPage';
import * as useSelector from '@/hooks/useTypedSelector'
import * as selectors from '@/selectors/selectors'

import * as NavigateNext from 'next/navigation'

import { mockResponses } from '../../../mocks/handlers';

jest.mock('@/selectors/selectors')

import { useDispatch } from 'react-redux'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

type MockValue = {
    mockReturnValue: jest.Mock
    mockResolvedValue: jest.Mock
    mockImplementation: jest.Mock
}

jest.mock('next/navigation');

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: jest.fn(),
}));

describe('LoginPage', () => {
    let mockRouter, mockPush, mockUseCheckAuthQuery: MockValue
    let dispatchMock: jest.Mock;

    afterEach(() => {
        jest.clearAllMocks();

        mockResponses.login = { success: true, attempts: 1 };
        mockResponses.updateUser = { success: true, attempts: 1 };
        mockResponses.getMessages = { success: true };
        jest.resetModules();
        document.body.innerHTML = '';
    });

    beforeEach(() => {
        jest.clearAllMocks();

        dispatchMock = jest.fn();
        (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);

        mockPush = jest.fn();

        mockRouter = {
            push: mockPush,
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
        };

        jest.spyOn(NavigateNext, 'useRouter').mockReturnValue(mockRouter);

        const useSelectorMock = jest.spyOn(useSelector, 'useSelector')

        useSelectorMock.mockImplementation((selector) => {
            if (selector === selectors.selectSideBarState) {
                return { isShow: true }
            }
            if (selector === selectors.selectTokenState) {
                return { token: 'token123' }
            }
            return null
        })

        mockUseCheckAuthQuery = jest.spyOn(authApi, 'useCheckAuthQuery') as unknown as MockValue
        mockUseCheckAuthQuery.mockReturnValue({
            data: { user: { id: '1', name: 'Test User', city: 'Moscow' } },
            isLoading: false,
            refetch: jest.fn(),
        });
    });

    test('перенаправляет на главную, если пользователь аутентифицирован', () => {
        mockUseCheckAuthQuery.mockReturnValue({ data: { user: { id: 1 } } });

        getProviderWithStore(
            <LoginPage />
        );

        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    test('обрабатывает изменение формы', () => {
        mockUseCheckAuthQuery.mockReturnValue({ data: null });

        getProviderWithStore(
            <LoginPage />
        );

        const emailInput = screen.getAllByTestId('input')[0];
        const passwordInput = screen.getAllByTestId('input')[1];

        fireEvent.change(emailInput, { target: { name: 'email', value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { name: 'password', value: 'password123' } });

        const emailInputValue = emailInput as unknown as { value: string }
        const passwordInputValue = passwordInput as unknown as { value: string }

        expect(emailInputValue.value).toBe('test@example.com');
        expect(passwordInputValue.value).toBe('password123');
    });

    test('обрабатывает успешный логин', () => {
        mockResponses.login.success = true;
        mockUseCheckAuthQuery.mockReturnValue({ data: null });

        getProviderWithStore(
            <LoginPage />
        );

        const loginInput = screen.getAllByTestId('input')[0]
        const passwordInput = screen.getAllByTestId('input')[1]
        const form = screen.getAllByTestId('form')[0]

        fireEvent.change(loginInput, { target: { value: 'konxxxxxd@ya.ru' } })
        fireEvent.change(passwordInput, { target: { value: 'dffddffddffdfddffd' } })

        fireEvent.submit(form)

        expect(dispatchMock).toHaveBeenCalledTimes(1);
    });

    test('перенаправляет на проверку PIN-кода при ошибке not-pin-code', async () => {
        const mockLogin = jest.fn().mockResolvedValue({
            error: {
                data: {
                    status: 'not-pin-code',
                    data: { attempt: 1 }
                }
            }
        });

        jest.spyOn(authApi, 'useLoginMutation').mockReturnValue([
            mockLogin,
            {
                data: {
                    status: 'not-pin-code',
                    data: { attempt: 1 }
                },
                isLoading: false,
                error: {
                    data: {
                        status: 'not-pin-code',
                        data: { attempt: 1 }
                    }
                },
                reset: jest.fn()
            }
        ]);

        getProviderWithStore(
            <LoginPage />
        );

        const loginInput = screen.getAllByTestId('input')[0];
        const passwordInput = screen.getAllByTestId('input')[1];
        const form = screen.getAllByTestId('form')[0];

        fireEvent.change(loginInput, { target: { value: 'konxxxxxd@ya.ru' } });
        fireEvent.change(passwordInput, { target: { value: 'dffddffddffdfddffd' } });
        fireEvent.submit(form);

        await waitFor(() => {
            expect(mockRouter.push).toHaveBeenCalledWith('/check-pin?action=login');
        });
    });
})