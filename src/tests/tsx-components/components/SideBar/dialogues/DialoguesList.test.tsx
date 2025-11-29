import React from 'react'
import { screen } from '@testing-library/react'
import DialoguesList from '@/components/SideBar/dialogues/DialoguesList/DialoguesList'
import * as useSelector from '@/hooks/useTypedSelector'
import * as authApi from '@/redux/services/authApi'
import * as nextNavigation from 'next/navigation'
import * as cacheUser from '@/cashe/userCache'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore'

jest.mock('@/hooks/useTypedSelector')
jest.mock('next/navigation')
jest.mock('@/cashe/userCache')

type MockValue = {
    mockReturnValue: jest.Mock
    mockResolvedValue: jest.Mock
}

declare global {
    interface ResizeObserver {
        observe(element: Element): void;
        unobserve(element: Element): void;
        disconnect(): void;
    }

    interface ResizeObserverEntry {
        readonly target: Element;
        readonly contentRect: DOMRectReadOnly;
    }
}

global.ResizeObserver = class ResizeObserver implements globalThis.ResizeObserver {
    private callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;

    constructor(callback: (entries: ResizeObserverEntry[], observer: ResizeObserver) => void) {
        this.callback = callback;
    }

    observe(element: Element) {
        const entry: ResizeObserverEntry = {
            target: element,
            contentRect: element.getBoundingClientRect() as DOMRectReadOnly,
            borderBoxSize: [],
            contentBoxSize: [],
            devicePixelContentBoxSize: []
        };

        this.callback([entry], this);
    }

    unobserve() { }
    disconnect() { }
};

describe('DialoguesList', () => {
    const searchParamsMock = nextNavigation.useSearchParams as unknown as MockValue
    const getCachedUserMock = cacheUser.getCachedUser as unknown as MockValue

    beforeEach(() => {
        jest.clearAllMocks()
        const useSelectorMock = jest.spyOn(useSelector, 'useSelector')
        useSelectorMock.mockImplementation((selector) => {
            if (selector.name === 'selectTokenState') {
                return { token: 'token123' }
            }
            return null
        })
    })

    test('рендерит список диалогов с правильными пропсами UserItem', async () => {
        jest.spyOn(authApi, 'useCheckAuthQuery').mockReturnValue({
            data: {
                user: {
                    id: 'user-id',
                    city: '',
                },
            },
            isLoading: false,
            refetch: jest.fn(),
        });

        searchParamsMock.mockReturnValue({
            get: jest.fn((key) => (key === 'user' ? 'user2' : null))
        })

        getCachedUserMock.mockResolvedValue([{ id: 'user1', name: 'Cached User' }])

        const dialoguesData = [
            {
                userId: 'user2',
                sender_id: 'user1',
                recipient_id: 'user2',
                nameSender: 'User Two',
                lengthMessages: 5,
                lastMessage: 'Hello!',
                status: false,
                colorProfile: 'blue'
            },
            {
                userId: 'user3',
                sender_id: 'user3',
                recipient_id: 'user1',
                nameSender: 'User Three',
                lengthMessages: 2,
                lastMessage: 'Hi there!',
                status: false,
                colorProfile: 'green'
            }
        ]

        getProviderWithStore(
            <DialoguesList dialoguesData={dialoguesData} />
        )

        const list = screen.getByTestId('dialogues-list')

        expect(list).toBeInTheDocument()

        const userItem = screen.getAllByTestId('dialogues-item')

        expect(userItem[0]).toHaveTextContent('UUser TwoHello!5')

        expect(userItem[1]).toHaveTextContent('UUser ThreeHi there!2')
    })

    test('рендерит пустой список, если dialoguesData пуст', () => {
        jest.spyOn(authApi, 'useCheckAuthQuery').mockReturnValue({
            data: {
                user: {
                    id: 'user-id',
                    city: '',
                },
            },
            isLoading: false,
            refetch: jest.fn(),
        });

        searchParamsMock.mockReturnValue({
            get: jest.fn(() => null)
        })

        getCachedUserMock.mockResolvedValue([{ id: 'user1' }])

        getProviderWithStore(
            <DialoguesList dialoguesData={[]} />
        )

        expect(screen.getAllByTestId('dialogues-list')[0]).toBeTruthy()
        expect(screen.queryByTestId(/^user-item-/)).not.toBeInTheDocument()
    })
})