import React from 'react';

import { screen, fireEvent, waitFor } from '@testing-library/react';
import authApi from '@/redux/services/authApi';
import { useRouter, useSearchParams } from 'next/navigation';
import store from '@/redux/store';

import { mockResponses } from '../../../mocks/handlers';
import CheckPinPage from '@/pages-components/CheckPinPage/CheckPinPage';
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

jest.mock('next/navigation')

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
}));

interface MockRouter {
    push: jest.Mock<void, [url: string]>;
}

interface MockSearchParams {
    get: jest.Mock<string | null, [key: string]>;
}

interface MockValue {
    mockReturnValue: jest.Mock;
    mockResolvedValue: jest.Mock;
}

describe('CheckPinPage', () => {

    let mockRouter: MockRouter;
    let mockSearchParams: MockSearchParams;

    afterEach(() => {
        jest.resetModules();
        document.body.innerHTML = '';
    });

    beforeEach(() => {

        store.dispatch(authApi.util.resetApiState())

        mockRouter = { push: jest.fn() };
        mockSearchParams = { get: jest.fn() };

        const router = useRouter as unknown as MockValue
        const searchParams = useSearchParams as unknown as MockValue

        router.mockReturnValue(mockRouter);
        searchParams.mockReturnValue(mockSearchParams);
    });

    it('рендерится без ошибок', () => {
        mockSearchParams.get.mockReturnValue('login');

        getProviderWithStore(
            <CheckPinPage />
        );

        expect(screen.getByText('Введите код для двойной защиты:')).toBeInTheDocument();
    });

    it('обрабатывает ошибку login: устанавливает attempt', async () => {
        mockSearchParams.get.mockReturnValue('login');

        mockResponses.login.success = false
        mockResponses.updateUser.success = false

        getProviderWithStore(
            <CheckPinPage />
        );

        const input = screen.getByTestId('input');
        const submitButton = screen.getByRole('button', { name: /проверить/i });

        fireEvent.change(input, { target: { value: '1234' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Осталось попыток: 1')).toBeInTheDocument();
        });
    });

    it('обрабатывает ошибку update: устанавливает attempt', async () => {
        mockSearchParams.get.mockReturnValue('update');

        mockResponses.login.success = false

        getProviderWithStore(
            <CheckPinPage />
        );

        const input = screen.getByTestId('input');
        const submitButton = screen.getByRole('button', { name: /проверить/i });

        fireEvent.change(input, { target: { value: '1234' } });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('Осталось попыток: 1')).toBeInTheDocument();
        });
    });

    it('перенаправляет на / если auth.id отсутствует', () => {

        getProviderWithStore(
            <CheckPinPage />
        );

        expect(mockRouter.push).toHaveBeenCalledWith('/');
    });

    it('обновляет pin при изменении input', () => {
        mockSearchParams.get.mockReturnValue('login');

        getProviderWithStore(
            <CheckPinPage />
        );

        const input = screen.getAllByTestId('input')[0];
        fireEvent.change(input, { target: { value: 'abcd' } });

        expect(input).toHaveValue('abcd');
    });

    it('очищает pin после submit', () => {
        mockSearchParams.get.mockReturnValue('login');

        mockResponses.login.success = false

        getProviderWithStore(
            <CheckPinPage />
        );

        const input = screen.getAllByTestId('input')[0];
        const button = screen.getAllByRole('button', { name: 'Проверить' })[0];

        fireEvent.change(input, { target: { value: '1234' } });
        fireEvent.click(button);

        expect(input).toHaveValue('');
    });
});