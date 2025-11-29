import React from 'react'
import { screen } from '@testing-library/react'
import SideBar from '@/components/SideBar/SideBar'
import * as nextNavigation from 'next/navigation'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore'

jest.mock('next/navigation')

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

describe('SideBar', () => {
    const searchParamsMock = nextNavigation.useSearchParams as unknown as MockValue

    beforeEach(() => {
        jest.clearAllMocks()
    })


    afterEach(() => {
        jest.resetModules();
        document.body.innerHTML = '';
    });

    test('рендерит заголовок и список диалогов при tab=chats и наличии dialoguesData', () => {

        searchParamsMock.mockReturnValue({
            get: jest.fn((key) => (key === 'tab' ? 'chats' : null))
        })

        const props = {
            findUsers: [],
            dialoguesData: [
                { id: 1, recipient_id: '1', sender_id: '2', userId: '3', nameSender: '4', lengthMessages: 0, lastMessage: 'message', status: false, colorProfile: '' },
                { id: 2, recipient_id: '1', sender_id: '2', userId: '3', nameSender: '4', lengthMessages: 0, lastMessage: 'message', status: false, colorProfile: '' }],
            onSearchUsers: jest.fn(),
            searchUsers: 'test',
            isDisableFindUsers: false,
            isListInfoDialoguesLoading: false,
            children: <span />
        }

        getProviderWithStore(
            <SideBar {...props} />
        )

        expect(screen.getByText('Все ваши сообщения:')).toBeInTheDocument()

        expect(screen.getByTestId('dialogues-list')).toBeTruthy()

        expect(screen.queryByTestId('sidebar-input-search')).not.toBeInTheDocument()
        expect(screen.queryByTestId('search-users-list')).not.toBeInTheDocument()
        expect(screen.queryByText('У вас нет сообщений(')).not.toBeInTheDocument()
    })

    test('рендерит сообщение "У вас нет сообщений" при tab=chats и отсутствии dialoguesData', () => {

        searchParamsMock.mockReturnValue({
            get: jest.fn((key) => (key === 'tab' ? 'chats' : null))
        })

        const props = {
            findUsers: [],
            dialoguesData: [],
            onSearchUsers: jest.fn(),
            searchUsers: '',
            isDisableFindUsers: false,
            isListInfoDialoguesLoading: false,
            children: <span />
        }

        getProviderWithStore(<SideBar {...props} />)

        expect(screen.getByText('Все ваши сообщения:')).toBeInTheDocument()

        expect(screen.getByText('У вас нет сообщений(')).toBeInTheDocument()

        expect(screen.queryByTestId('dialogues-list')).not.toBeInTheDocument()
    })

    test('рендерит заголовок, поиск и список пользователей при tab=users и наличии findUsers', () => {
        searchParamsMock.mockReturnValue({
            get: jest.fn((key) => (key === 'tab' ? 'users' : null))
        })

        const props = {
            findUsers: [
                { id: '1', name: 'name', email: 'email@', city: 'city', color_profile: '' },
                { id: '2', name: 'name', email: 'email@', city: 'city', color_profile: '' },
                { id: '3', name: 'name', email: 'email@', city: 'city', color_profile: '' }],
            dialoguesData: [],
            onSearchUsers: jest.fn(),
            searchUsers: 'user',
            isDisableFindUsers: false,
            isListInfoDialoguesLoading: false,
            children: <span />
        }

        getProviderWithStore(<SideBar {...props} />)

        expect(screen.getByText('Всего найдено пользователей 3:')).toBeInTheDocument()

        expect(screen.getAllByTestId('search-input')[0]).toBeInTheDocument()

        expect(screen.getAllByTestId('search-users-title')[0]).toHaveTextContent('Всего найдено пользователей 3:')

        expect(screen.queryAllByTestId('dialogues-list')[0]).toBeFalsy()
        expect(screen.queryByText('У вас нет сообщений(')).toBeFalsy()
    })

    test('рендерит заголовок "Пользователи не найдены" при tab=users и отсутствии findUsers', () => {
        searchParamsMock.mockReturnValue({
            get: jest.fn((key) => (key === 'tab' ? 'users' : null))
        })

        const props = {
            findUsers: [],
            dialoguesData: [],
            onSearchUsers: jest.fn(),
            searchUsers: '',
            isDisableFindUsers: false,
            isListInfoDialoguesLoading: false,
            children: <span />
        }

        getProviderWithStore(<SideBar {...props} />)

        expect(screen.getByText('Пользователи не найдены')).toBeInTheDocument()

        expect(screen.getAllByTestId('search-input')[0]).toBeInTheDocument()

        expect(screen.queryByTestId('search-users-list')).not.toBeInTheDocument()
    })

    test('рендерит Suspense fallback при загрузке', () => {

        searchParamsMock.mockReturnValue({
            get: jest.fn((key) => (key === 'tab' ? 'chats' : null))
        })

        const props = {
            findUsers: [],
            dialoguesData: [],
            onSearchUsers: jest.fn(),
            searchUsers: '',
            isDisableFindUsers: false,
            isListInfoDialoguesLoading: false,
            children: <span />
        }

        getProviderWithStore(<SideBar {...props} />)

        expect(screen.getAllByTestId('sidebar')[0]).toBeInTheDocument()
    })
})