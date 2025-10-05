import React from 'react'

import '@testing-library/jest-dom';

import { screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormSendMessages from '@/components/FormSendMessages/FormSendMessages'
import * as messagesApi from '@/redux/services/messagesApi'
import * as selectors from '@/selectors/selectors'
import { encryptText } from '@/utils/encryption/encryptText'
import * as encryption from '@/utils/encryption/encryptText'
import { useSearchParams } from 'next/navigation'
import authApi from '@/redux/services/authApi'

import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore'

jest.mock('@/selectors/selectors')
jest.mock('@/utils/encryption/encryptText')
jest.mock('next/navigation', () => ({
    useSearchParams: jest.fn(),
}))

describe('FormSendMessages', () => {
    const mockEncryptText = encryptText as jest.Mock
    const mockUseSearchParams = useSearchParams as jest.Mock
    const mockUseUpdateMessageMutation = jest.spyOn(messagesApi, 'useUpdateMessageMutation')
    const mockUseSendMessageToBotMutation = jest.spyOn(messagesApi, 'useSendMessageToBotMutation')
    const mockUseSendMessageMutation = jest.spyOn(messagesApi, 'useSendMessageMutation')

    let selectorsAll: { selectTokenState: () => object, selectChangeMessageState: () => object };

    const defaultProps = {
        message: '', socket: null, name: '',
        currentUserid: '', setMessage: jest.fn(), messageId: '',
        publicKeys: ['1', '2']
    }

    afterEach(() => {
        jest.resetModules();
        jest.clearAllMocks()
        jest.restoreAllMocks()
        document.body.innerHTML = '';
        jest.clearAllMocks()
    });

    beforeEach(() => {

        const mockUseCheckAuthQuery = jest.spyOn(authApi, 'useCheckAuthQuery')

        selectorsAll = selectors as unknown as { selectTokenState: () => object, selectChangeMessageState: () => object };

        selectorsAll.selectTokenState = jest.fn().mockReturnValue({ token: 'token123' })

        mockUseCheckAuthQuery.mockReturnValue({ data: { user: { id: 'user123' } }, refetch: jest.fn() })

        mockUseSearchParams.mockReturnValue({
            get: jest.fn().mockImplementation((key) => (key === 'user' ? 'userId123' : null)),
        })

        mockEncryptText.mockResolvedValue(new ArrayBuffer(8))
    })

    test('рендерит input и кнопку', () => {

        getProviderWithStore(
            <FormSendMessages {...defaultProps} />)

        expect(screen.getAllByPlaceholderText(/сообщение/i)[0]).toBeInTheDocument()
        expect(screen.getByRole('button')).toBeInTheDocument()
    })

    test('вызывает setMessage при вводе текста', async () => {

        getProviderWithStore(
            <FormSendMessages {...defaultProps} />)

        const input = screen.getAllByPlaceholderText(/сообщение/i)[0]
        await userEvent.type(input, 'test message')

        expect(defaultProps.setMessage).toHaveBeenCalled()
    })

    test('при отправке формы вызывает encryptText', async () => {

        const encryptionText = jest.spyOn(encryption, 'encryptText')

        const setMessageMock = jest.fn()
        const sendMessageMock = jest.fn().mockResolvedValue({})
        const sendMessageToBotMock = jest.fn().mockResolvedValue({})
        const updateMessageMock = jest.fn().mockResolvedValue({ status: 'ok' })

        mockUseUpdateMessageMutation.mockReturnValue([updateMessageMock, { isLoading: false, data: null, reset: jest.fn() }])
        mockUseSendMessageMutation.mockReturnValue([sendMessageMock, { isLoading: false, reset: jest.fn() }])
        mockUseSendMessageToBotMutation.mockReturnValue([sendMessageToBotMock, { isLoading: false, reset: jest.fn() }])

        selectorsAll.selectChangeMessageState = jest.fn().mockReturnValue({ isChange: false })

        getProviderWithStore(
            <FormSendMessages {...defaultProps} setMessage={setMessageMock} name="User" />
        )
        const input = screen.getByPlaceholderText(/сообщение/i)
        const button = screen.getByRole('button', { name: /➤/i })

        await userEvent.type(input, 'Hello world')

        fireEvent.submit(button.closest('form')!)

        await waitFor(() => {
            expect(encryptionText).toHaveBeenCalled()
        })
    })

    test('при изменении updateMessageData диспатчит resetDataChangeMessage', async () => {

        const updateMessageMock = jest.fn()
        const updateMessageData = { status: 'ok' }

        mockUseUpdateMessageMutation.mockReturnValue([updateMessageMock, { isLoading: true, data: updateMessageData, reset: jest.fn() }])

        getProviderWithStore(
            <FormSendMessages {...defaultProps} />
        )

        const { getByText } = within(await screen.findByPlaceholderText('Сообщение...'))
        expect(getByText('')).toBeInTheDocument()
    })
})