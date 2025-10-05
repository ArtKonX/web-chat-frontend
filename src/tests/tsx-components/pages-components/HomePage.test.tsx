import React from 'react';
import { screen } from '@testing-library/react';
import HomePage from '@/pages-components/HomePage/HomePage';

import * as nextNavigation from 'next/navigation'

import * as authApi from '@/redux/services/authApi';

import * as usersApi from '@/redux/services/usersApi'
import * as citiesApi from '@/redux/services/citiesApi'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

jest.mock('next/navigation')

interface IDBOpenDBRequest {
    onsuccess: ((event: Event) => void) | null;
    onerror: ((event: Event) => void) | null;
    onupgradeneeded: ((event: Event) => void) | null;
    result: IDBDatabase;
}

interface IDBDatabase {
    createObjectStore: jest.Mock;
    transaction: jest.Mock<IDBTransaction>;
}

interface IDBTransaction {
    objectStore: jest.Mock<IDBObjectStore>;
}

interface IDBObjectStore {
    put: jest.Mock;
    get: jest.Mock;
    delete: jest.Mock;
}

type MockValue = {
    mockReturnValue: jest.Mock
    mockResolvedValue: jest.Mock
    mockImplementation: jest.Mock
}

global.indexedDB = {
    open: jest.fn(() => ({
        onsuccess: null,
        onerror: null,
        onupgradeneeded: null,
        result: {
            createObjectStore: jest.fn(),
            transaction: jest.fn(() => ({
                objectStore: jest.fn(() => ({
                    put: jest.fn(),
                    get: jest.fn(),
                    delete: jest.fn(),
                }) as IDBObjectStore),
            }) as IDBTransaction),
        } as unknown as IDBOpenDBRequest,
    })) as unknown as IDBOpenDBRequest,
    deleteDatabase: jest.fn(),
} as unknown as IDBFactory;

jest.mock('@/components/actions-with-cities-components/ChoosingCitiesOnMap/ChoosingCitiesOnMap', () => ({
    __esModule: true,
    default: () => <div data-testid="choosing-cities-map">Mocked Map Component</div>,
}));

jest.mock('@/hooks/useTypedSelector', () => ({
    useSelector: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockUseSelector = require('@/hooks/useTypedSelector').useSelector;

describe('HomePage', () => {

    let mockUseCheckAuthQuery: MockValue
    let mockSearchParams: MockValue;

    afterEach(() => {
        jest.resetModules();
        document.body.innerHTML = '';
    });

    beforeEach(() => {
        jest.clearAllMocks();

        const mockSelector = mockUseSelector as unknown as MockValue

        mockSelector.mockImplementation((selector: { [key in string]: string }) => {
            if (selector.name === 'selectTokenState') return { token: 'test-token' };
            if (selector.name === 'selectChangeMessageState') return { isChange: false, message: '', id: null };
            if (selector.name === 'selectImageState') return { isShowImage: false, url: '' };
            return {};
        });

        mockUseCheckAuthQuery = jest.spyOn(authApi, 'useCheckAuthQuery') as unknown as MockValue

        mockUseCheckAuthQuery.mockReturnValue({
            data: { user: { id: '1', name: 'Test User', city: 'Moscow' } },
            isLoading: false,
            refetch: jest.fn(),
        });
    });

    test('рендерит Loader при загрузке авторизации', () => {
        mockUseCheckAuthQuery.mockReturnValue({ isLoading: true, refetch: jest.fn() });

        getProviderWithStore(
            <HomePage />
        )

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    test('рендерит HomeWelcomePage при отсутствии авторизации и онлайн', () => {
        mockUseCheckAuthQuery.mockReturnValue({ data: null, isLoading: false, refetch: jest.fn() });

        mockUseSelector.mockImplementation((selector: { [key in string]: string }) => {
            if (selector.name === 'selectTokenState') return { token: null };
            return {};
        });

        getProviderWithStore(
            <HomePage />
        )

        expect(screen.getByText(/Лучший чат для/i)).toBeInTheDocument();
    });

    test('рендерит MessageList при наличии данных чата', async () => {

        jest.spyOn(usersApi, 'useGetUsersQuery').mockReturnValue({ refetch: jest.fn() })
        jest.spyOn(citiesApi, 'useGetCitiesQuery').mockReturnValue({ refetch: jest.fn() })

        mockSearchParams = nextNavigation.useSearchParams as unknown as MockValue

        mockSearchParams.mockReturnValue({
            get: jest.fn((key) => {
                if (key === 'user') return 'user1'
                if (key === 'tab') return 'chats'
                return null
            }),
        })

        getProviderWithStore(
            <HomePage />
        )

        expect(screen.getByTestId('message-list')).toBeInTheDocument();
    });
});