import React from 'react';

import '@testing-library/jest-dom';

import { screen, waitFor } from '@testing-library/react';
import AuthGuard from '@/components/AuthGuard/AuthGuard';
import * as authApi from '@/redux/services/authApi';
import * as selectors from '@/selectors/selectors';
import * as getGeoCoorsModule from '@/utils/getGeoCoors';
import * as fetchCityFromCoorsModule from '@/utils/fetchCityFromCoors';
import * as userCacheModule from '@/cashe/userCache';
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

jest.mock('@/selectors/selectors');
jest.mock('@/utils/getGeoCoors');
jest.mock('@/utils/fetchCityFromCoors');
jest.mock('@/cashe/userCache');

const mockRouter = {
    push: jest.fn()
};

jest.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    useSearchParams: () => new URLSearchParams(),
    usePathname: () => '/'
}));

describe('AuthGuard', () => {
    const mockChildren = <div>Protected Content</div>;

    beforeAll(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
    })

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(selectors, 'selectTokenState').mockReturnValue({ token: 'test-token' });
        jest.spyOn(selectors, 'selectbackgroundState').mockReturnValue({ bgColor: '#123456' });

        jest.spyOn(authApi, 'useCheckAuthQuery').mockReturnValue({
            data: {
                user: {
                    id: 'e1233'
                },
            },
            isLoading: false,
            refetch: jest.fn(),
        });

        jest.spyOn(authApi, 'useUpdateCityMutation').mockReturnValue([
            jest.fn(),
            { data: { status: 'ok' }, isLoading: false, reset: jest.fn() },
        ]);

        jest.spyOn(getGeoCoorsModule, 'default').mockResolvedValue({
            latitude: 55.75,
            longitude: 37.62,
        });

        jest.spyOn(fetchCityFromCoorsModule, 'default').mockResolvedValue('Moscow');

        jest.spyOn(userCacheModule, 'getCachedUser').mockResolvedValue([]);
        jest.spyOn(userCacheModule, 'cacheUser').mockResolvedValue(undefined);
    });

    it('рендерит дочерние компоненты', () => {
        getProviderWithStore(<AuthGuard>{mockChildren}</AuthGuard>)

        expect(screen.getByText('Protected Content')).toBeTruthy();
    });

    it('вызывает refetch при маунте', () => {
        const refetchMock = jest.fn();
        jest.spyOn(authApi, 'useCheckAuthQuery').mockReturnValue({
            data: { user: { id: 'user-id', city: '' } },
            isLoading: false,
            refetch: refetchMock,
        });

        getProviderWithStore(<AuthGuard>{mockChildren}</AuthGuard>)

        expect(refetchMock).toHaveBeenCalled();
    });

    it('вызывает updateCity, если у пользователя нет города', async () => {
        const updateCityMock = jest.fn().mockResolvedValue({ status: 'ok' });
        jest.spyOn(authApi, 'useUpdateCityMutation').mockReturnValue([
            updateCityMock,
            { data: undefined, isLoading: false, reset: jest.fn() },
        ]);

        getProviderWithStore(<AuthGuard>{mockChildren}</AuthGuard>)

        await waitFor(() => {
            expect(updateCityMock).toHaveBeenCalledWith({
                id: 'e1233',
                city: 'Moscow',
                token: 'test-token',
            });
        });
    });

    it('обновляет фон body при изменении bgColor и authData', () => {
        getProviderWithStore(<AuthGuard>{mockChildren}</AuthGuard>)

        const body = document.querySelector('body');

        expect(body).toHaveStyle(
            `background: url('/backgrounds/background.svg'), linear-gradient(135deg, #123456, rgba(0, 0, 255, 0.3))`
        );
    });

    it('сохраняет пользователя в кеш, если кеш пустой', async () => {
        const cacheUserMock = jest.spyOn(userCacheModule, 'cacheUser');
        cacheUserMock.mockResolvedValue(undefined);

        getProviderWithStore(<AuthGuard>{mockChildren}</AuthGuard>)

        await waitFor(() => {
            expect(cacheUserMock).toHaveBeenCalledWith({
                id: 'e1233'
            });
        });
    });
});
