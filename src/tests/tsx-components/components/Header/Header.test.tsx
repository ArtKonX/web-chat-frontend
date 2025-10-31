import React from 'react'

import { screen, fireEvent, waitFor } from '@testing-library/react'
import Header from '@/components/Header/Header'
import * as selectors from '@/selectors/selectors'
import * as authApi from '@/redux/services/authApi'
import * as usersApi from '@/redux/services/usersApi'
import * as nextNavigation from 'next/navigation'
import * as useUrlHook from '@/hooks/useUrl'
import { getCachedUser } from '@/cashe/userCache'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore'

import '@testing-library/jest-dom';
import { URL } from 'node:url'

jest.mock('@/selectors/selectors')
jest.mock('next/navigation')
jest.mock('@/hooks/useUrl')
jest.mock('@/cashe/userCache')

type MockValue = {
  mockReturnValue: jest.Mock
  mockResolvedValue: jest.Mock
}

describe('Header', () => {

  const mockToggleSideBarAction = jest.fn()

  let selectorsAll: { selectTokenState: () => object, selectChangeMessageState: () => object };

  const router = nextNavigation.useRouter as unknown as MockValue
  const defaultUrlHook = useUrlHook.default as unknown as MockValue;

  jest.mock('@/redux/slices/sideBarSlice', () => ({
    toggleSideBar: () => mockToggleSideBarAction(),
  }))

  afterEach(() => {
    jest.clearAllMocks()
    jest.resetModules();
    document.body.innerHTML = '';
  });

  beforeEach(() => {
    jest.clearAllMocks()

    selectorsAll = selectors as unknown as { selectTokenState: () => object, selectChangeMessageState: () => object };

    selectorsAll.selectTokenState = jest.fn().mockReturnValue({ token: 'token123' })

    const checkAuth = jest.spyOn(authApi, 'useCheckAuthQuery')

    checkAuth.mockReturnValue({
      data: { user: { id: 'user1', city: 'TestCity', color_profile: 'blue', name: 'Test User' } },
      refetch: jest.fn(),
      isLoading: false,
    })

    const users = jest.spyOn(usersApi, 'useGetUsersQuery')

    users.mockReturnValue({
      data: { users: [{ id: 'user1', name: 'Test User From Query' }] },
      isLoading: false,
      refetch: jest.fn()
    })

    const searchParams = nextNavigation.useSearchParams as unknown as MockValue

    searchParams.mockReturnValue({
      get: jest.fn((key) => {
        if (key === 'user') return 'user1'
        if (key === 'tab') return 'chats'
        if (key === 'settings') return null
        return null
      }),
    })

    router.mockReturnValue({
      push: jest.fn(),
    })

    defaultUrlHook.mockReturnValue({
      url: new URL('http://localhost/?tab=chats&user=user1'),
    })

    const cachedUser = getCachedUser as unknown as MockValue;;

    cachedUser.mockResolvedValue([{ id: 'cachedUser', city: 'CachedCity', color_profile: 'red', name: 'Cached User' }])
  })

  test('рендерит компоненты и отображает имя пользователя', async () => {
    getProviderWithStore(
      <Header isDemoHeader={false} isWelcomePage={false} />
    )

    await waitFor(() => {
      expect(screen.getByText('T')).toBeInTheDocument()
    })

    expect(screen.getByTestId('header-logo')).toBeInTheDocument()
    expect(screen.getByTestId('header-burger-button')).toBeInTheDocument()
  })

  test('при отсутствии userName не отображает имя', () => {

    const getUsersQuery = usersApi.useGetUsersQuery as unknown as MockValue;

    getUsersQuery.mockReturnValue({
      data: { users: [{ name: '123' }] },
      isLoading: false,
    })

    getProviderWithStore(
      <Header isDemoHeader={false} isWelcomePage={false} />
    )

    expect(screen.queryByText(/T/)).not.toBeInTheDocument()
  })

  test('клик по кнопке настроек вызывает router.push с правильным url', async () => {
    const routerPushMock = jest.fn();
    const mockUrl = new URL('http://localhost/?tab=chats&user=user1');

    // Моки
    (nextNavigation.useRouter as jest.Mock).mockReturnValue({ push: routerPushMock });
    (useUrlHook.default as jest.Mock).mockReturnValue({ url: mockUrl });

    getProviderWithStore(
      <Header isDemoHeader={false} isWelcomePage={false} />
    );

    const settingsButton = screen.getByTestId('settings-button');
    fireEvent.click(settingsButton);

    await waitFor(() => {
      // Проверяем относительный URL
      expect(routerPushMock).toHaveBeenCalledWith('/?settings=true');
    });
  });

  test('отображает HeaderMenu на странице приветствия', () => {
    getProviderWithStore(
      <Header isDemoHeader={false} isWelcomePage={true} />
    )

    expect(screen.getByTestId('header-menu')).toBeInTheDocument()
  })

  test('отображает статус онлайн/оффлайн', () => {

    Object.defineProperty(window.navigator, 'onLine', {
      value: false,
      configurable: true,
    })

    getProviderWithStore(
      <Header isDemoHeader={false} isWelcomePage={false} />
    )

    expect(screen.getByText(/Нет соединения с интернетом/)).toBeInTheDocument()
  })
})