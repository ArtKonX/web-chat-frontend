import React from 'react';
import { screen } from '@testing-library/react';
import FormTurnOff2FA from '@/components/components-for-work-2fa/FormTurnOff2FA/FormTurnOff2FA';
import * as selectors from '@/selectors/selectors';

import * as authApi from '@/redux/services/authApi';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import { useSelector } from '@/hooks/useTypedSelector'
import userEvent from '@testing-library/user-event';
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

jest.mock('@/utils/getGeoCoors');
jest.mock('@/utils/fetchCityFromCoors');
jest.mock('@/cashe/userCache');

jest.mock('@/hooks/useTypedSelector');
jest.mock('next/navigation');

describe('FormTurnOff2FA', () => {
    const mockUserId = 'test-user-id';
    const mockCloseShowTornOff2FAForm = jest.fn();
    const mockAuthDataRefetch = jest.fn();

    afterEach(() => {

        jest.resetModules();
        document.body.innerHTML = '';
    });

    beforeEach(() => {

        jest.clearAllMocks();

        (useSelector as jest.Mock).mockImplementation((selector) => {
            if (selector === selectors.selectTokenState) {
                return { token: 'test-token' };
            }

            return undefined;
        });

        jest.spyOn(selectors, 'selectTokenState').mockReturnValue({
            token: 'test-token'
        });

        jest.spyOn(authApi, 'useTurnOff2FAMutation').mockReturnValue([
            jest.fn(),
            {
                data: {
                    user: {
                        id: 'd',
                        date_register: '10',
                        email: '',
                        name: '',
                        city: '',
                        color_profile: '',
                        fa2_enabled: false
                    }
                },
                isLoading: false,
                reset: jest.fn()
            }
        ]);
    });

    it('проверка рендера', () => {
        getProviderWithStore(<AuthGuard>
            <FormTurnOff2FA
                userId={mockUserId}
                closeShowTornOff2FAForm={mockCloseShowTornOff2FAForm}
                authDataRefetch={mockAuthDataRefetch}
            />
        </AuthGuard>)

        expect(screen.getByText('Введите код для отключения двойной защиты:')).toBeTruthy();
        expect(screen.getByText('При отключении двойной защиты риск потери аккаунта возрастает, подумайте прежде чем это делать!')).toBeTruthy();
        expect(screen.getByRole('button', { name: 'Отключить' })).toBeTruthy();
    })

    it('изменение значения инпута "Код"', async () => {
        getProviderWithStore(<AuthGuard>
            <FormTurnOff2FA
                userId={mockUserId}
                closeShowTornOff2FAForm={mockCloseShowTornOff2FAForm}
                authDataRefetch={mockAuthDataRefetch}
            />
        </AuthGuard>)

        const input = screen.getByRole('textbox');
        await userEvent.type(input, '123456');
        expect(input).toHaveValue('123456');
    });

    it('вызывает turnOff2FA с правильными параметрами при сабмите', async () => {
        const mockTurnOff2FA = jest.fn();
        jest.spyOn(authApi, 'useTurnOff2FAMutation').mockReturnValue([
            mockTurnOff2FA,
            { data: null, isLoading: false, reset: jest.fn() }
        ]);

        getProviderWithStore(<AuthGuard>
            <FormTurnOff2FA
                userId={mockUserId}
                closeShowTornOff2FAForm={mockCloseShowTornOff2FAForm}
                authDataRefetch={mockAuthDataRefetch}
            />
        </AuthGuard>)

        const input = screen.getByLabelText('Код');
        await userEvent.type(input, '654321');

        const button = screen.getByRole('button', { name: 'Отключить' });
        await userEvent.click(button);

        expect(mockTurnOff2FA).toHaveBeenCalledWith({
            id: mockUserId,
            pin: '654321',
            token: 'test-token',
        });
    });

    it('отображает количество оставшихся попыток при ошибке', () => {

        jest.spyOn(authApi, 'useTurnOff2FAMutation').mockReturnValue([
            jest.fn(),
            {
                data: null,
                isLoading: false,
                reset: jest.fn(),
                error: {
                    data: {
                        attempt: 2,
                        data: {
                            succesPinCode: 'error',
                        },
                    },
                },
            },
        ]);

        getProviderWithStore(<AuthGuard>
            <FormTurnOff2FA
                userId={mockUserId}
                closeShowTornOff2FAForm={mockCloseShowTornOff2FAForm}
                authDataRefetch={mockAuthDataRefetch}
            />
        </AuthGuard>)

        expect(screen.getByText(/Осталось попыток: 2/i)).toBeInTheDocument();
    });

    it('вызывает closeShowTornOff2FAForm и authDataRefetch при успешном отключении 2FA', () => {
        jest.spyOn(authApi, 'useTurnOff2FAMutation').mockReturnValue([
            jest.fn(),
            {
                data: { status: 'ok' },
                isLoading: false,
                reset: jest.fn(),
            },
        ]);

        getProviderWithStore(<AuthGuard>
            <FormTurnOff2FA
                userId={mockUserId}
                closeShowTornOff2FAForm={mockCloseShowTornOff2FAForm}
                authDataRefetch={mockAuthDataRefetch}
            />
        </AuthGuard>)

        expect(mockCloseShowTornOff2FAForm).toHaveBeenCalled();
        expect(mockAuthDataRefetch).toHaveBeenCalled();
    });
})