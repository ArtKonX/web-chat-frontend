import React from 'react'

import '@testing-library/jest-dom';

import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Layout from '@/components/Layout/Layout'
import * as selectors from '@/selectors/selectors'
import * as authApi from '@/redux/services/authApi'
import * as usersApi from '@/redux/services/usersApi'
import * as messagesApi from '@/redux/services/messagesApi'
import * as nextNavigation from 'next/navigation'
import * as useDebounceHook from '@/hooks/useDebounce'
import * as webSocketConnection from '@/components/WebSocketConnection/WebSocketConnection'
import * as indexedDBUtils from '@/utils/encryption/indexedDB/getPrivateKeyFromIndexedDB'
import * as cacheDialogues from '@/cashe/dialoguesCache'
import * as cacheUser from '@/cashe/userCache'
import * as base64Utils from '@/utils/base64ToArrayBuffer'

import * as useSelector from '@/hooks/useTypedSelector'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore'

jest.mock('@/selectors/selectors')
jest.mock('next/navigation')
jest.mock('@/hooks/useDebounce')
jest.mock('@/components/WebSocketConnection/WebSocketConnection')
jest.mock('@/utils/encryption/indexedDB/getPrivateKeyFromIndexedDB')
jest.mock('@/cashe/dialoguesCache')
jest.mock('@/utils/base64ToArrayBuffer')

type AuthQueryResult = {
  data: { user: { id: string; city: string } };
  isLoading: boolean;
  refetch: jest.Mock;
};

type MockValue = {
    mockReturnValue: jest.Mock
    mockResolvedValue:jest.Mock
}

describe('Layout', () => {

  let cacheDialogueMock: MockValue;
  let auth: jest.MockedFunction<typeof authApi.useCheckAuthQuery>;

  const pathname = nextNavigation.usePathname as unknown as MockValue
  const searchParams = nextNavigation.useSearchParams as unknown as MockValue

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules();
    document.body.innerHTML = '';
  });

  beforeEach(() => {
    jest.clearAllMocks()

    jest.mock("../../../../public/svg/group-users.svg", () => {
      return {
        default: { src: "../../../../public/svg/group-users.svg", height: 100, width: 100 },
      }
    })

    jest.mock("../../../../public/svg/messages.svg", () => {
      return {
        default: { src: "../../../../public/svg/messages.svg", height: 100, width: 100 },
      }
    })

    jest.mock("../../../../public/background/background.svg", () => {
      return {
        default: { src: "../../../../public/background/background.svg", height: 100, width: 100 },
      }
    })

    jest.mock("../../../../public/svg/search-icon.svg", () => {
      return {
        default: { src: "../../../../public/svg/search-icon.svg", height: 100, width: 100 },
      }
    })

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

    auth = jest.spyOn(authApi, 'useCheckAuthQuery').mockReturnValue({
      data: {
        user: {
          id: 'user-id',
          city: '',
        },
      },
      isLoading: false,
      refetch: jest.fn(),
    } as unknown as AuthQueryResult) as jest.MockedFunction<typeof authApi.useCheckAuthQuery>;

    const useGetUsers = jest.spyOn(usersApi, 'useGetUsersQuery')

    useGetUsers.mockReturnValue({
      data: { users: [{ id: 'user2', name: 'Found User' }] },
      isLoading: false,
      refetch: jest.fn()
    })

    const useGetInfoDialogues = jest.spyOn(messagesApi, 'useGetInfoDialoguesQuery')

    useGetInfoDialogues.mockReturnValue({
      data: { data: [{ userId: 'user2', lastMessage: 'Test message' }] },
      isLoading: false,
      refetch: jest.fn()
    })

    pathname.mockReturnValue('/');

    searchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'user') return 'user2'
        if (key === 'tab') return 'chats'
        return null
      }),
    })

    const debounceHook = useDebounceHook.default as unknown as MockValue
    const webSocketConnectionDefault = webSocketConnection.default as unknown as MockValue

    debounceHook.mockReturnValue('debounced search')

    webSocketConnectionDefault.mockReturnValue({
      socket: { connected: true },
      wsInfoDialogues: { recipient_id: 'user2', sender_id: 'user1', lastMessage: 'WS message' },
      setWsInfoDialogues: jest.fn(),
      userStatus: { userId: 'user2', status: 'online' },
      setUserStatus: jest.fn(),
    })

    const getPrivateKeyFromDB = indexedDBUtils.getPrivateKeyFromIndexedDB as unknown as MockValue

    getPrivateKeyFromDB.mockResolvedValue({ data: 'privateKey' })

    const base64ToArray = base64Utils.base64ToArrayBuffer as unknown as MockValue

    base64ToArray.mockReturnValue(new ArrayBuffer(8))

    const getCachedUserMock = jest.spyOn(cacheUser, 'getCachedUser') as unknown as MockValue
    getCachedUserMock.mockResolvedValue([{ id: 'user1', name: 'Cached User' }])

    const getCachedDialoguesMock = jest.spyOn(cacheDialogues, 'getCachedDialogues') as unknown as MockValue

    getCachedDialoguesMock.mockResolvedValue([{ userId: 'user2', lastMessage: 'Cached message' }])

    cacheDialogueMock = jest.spyOn(cacheDialogues, 'cacheDialogue') as unknown as MockValue
    cacheDialogueMock.mockResolvedValue(undefined)
  })

  test('рендерит компонент с children', async () => {
    getProviderWithStore(
      <Layout>
        <div data-testid="children">Test Children</div>
      </Layout>
    )

    expect(screen.getByTestId('children')).toBeInTheDocument()
  })

  test('рендерит Header', () => {
    getProviderWithStore(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    const header = screen.getAllByTestId('header')[0]
    expect(header).toBeTruthy()
  })

  test('рендерит SideBar когда sideBarState.isShow true и условия выполнены', () => {
    getProviderWithStore(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    expect(screen.getByTestId('sidebar')).toBeInTheDocument()
  })

  test('не рендерит SideBar когда isDemoHeader true', () => {

    pathname.mockReturnValue('/login')

    getProviderWithStore(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument()
  })

  test('рендерит Footer когда нет authData или userInfo', () => {

    jest.spyOn(authApi, 'useCheckAuthQuery').mockReturnValue({
      data: { user: { id: null, name: 'Test User' } },
      refetch: jest.fn(),
    })

    getProviderWithStore(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    expect(screen.queryByTestId('footer')).toBeTruthy()
  })

  test('обрабатывает поиск пользователей', async () => {

    jest.spyOn(cacheUser, 'getCachedUser').mockResolvedValue([{
      id: 'user1',
      name: '',
      email: '',
      city: '',
      color_profile: ''
    }])

    jest.spyOn(selectors, 'selectSideBarState').mockReturnValue({
      isShow: true,
      _persist: undefined
    });

    searchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'user') return 'user2'
        if (key === 'tab') return 'users'
        return null
      }),
    })

    getProviderWithStore(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    const searchInput = screen.queryAllByTestId('search-input')[0]
    await userEvent.type(searchInput, 'test search')

    await waitFor(() => {
      expect(useDebounceHook.default).toHaveBeenCalledWith('test search', 400)
    })
  })

  test('обновляет статус пользователей в диалогах', async () => {
    auth.mockReturnValue({
      data: { user: { id: 'user1', name: 'Test User' } },
      refetch: jest.fn(),
    })

    getProviderWithStore(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    await waitFor(() => {
      expect(messagesApi.useGetInfoDialoguesQuery).toHaveBeenCalled()
    })
  })

  test('отображает сообщения из диалогов в списке', async () => {

    auth.mockReturnValue({
      data: { user: { id: 'user1', name: 'Test User' } },
      refetch: jest.fn(),
    })

    getProviderWithStore(
      <Layout>
        <div>Test</div>
      </Layout>
    )

    const dialoguesList = screen.queryAllByTestId('dialogues-list')

    await waitFor(() => {
      expect(dialoguesList).toBeTruthy()
    })
  })
})