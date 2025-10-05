import React from 'react'

import { screen, fireEvent, act } from '@testing-library/react'
import UploadFile from '@/components/file-upload/UploadFile/UploadFile'
import messagesApi from '@/redux/services/messagesApi'
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore'

describe('UploadFile', () => {
    const defaultProps = {
        isShowUploadForm: true,
        file: new File([''], 'file.png'),
        fileSrc: 'file-src',
        isFormUploadFade: true,
        setIsFormUploadFade: jest.fn(),
        isFormUploadFile: true,
        setIsFormUploadFile: jest.fn(),
        authState: { user: { id: '123' } },
        encFile: new File([''], 'file.png'),
        socket: null,
        publicKeys: ['key1', 'key2']
    }

    afterEach(() => {

        jest.resetModules();
        document.body.innerHTML = '';
    });

    beforeEach(() => {
        jest.clearAllMocks()
    })

    test('рендерит UploadFileForm при isShowUploadForm=true', () => {
        getProviderWithStore(<UploadFile {...defaultProps} />)

        expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    test('не рендерит ничего при isShowUploadForm=false', () => {
        const { container } = getProviderWithStore(
            <UploadFile {...defaultProps} isShowUploadForm={false} />
        )

        expect(container.firstChild).toBeNull()
    })

    test('скрывает форму при успешной загрузке файла', async () => {
        jest.useFakeTimers()

        const setIsFormUploadFade = jest.fn()
        const setIsFormUploadFile = jest.fn()

        const props = {
            ...defaultProps,
            setIsFormUploadFade,
            setIsFormUploadFile,
            isShowUploadForm: true,
        }

        getProviderWithStore(<UploadFile {...props} />)

        const mockUploadButton = screen.getByTestId('mock-upload-button')

        fireEvent.click(mockUploadButton)

        const updateCityMock = jest.fn().mockResolvedValue({ status: 'ok' });

        jest.spyOn(messagesApi, 'useUploadFileWithMessMutation').mockReturnValue([
            updateCityMock,
            { data: { status: 'ok' }, isLoading: false, reset: jest.fn() },
        ]);

        act(() => {
            jest.advanceTimersByTime(100)
        })
        expect(screen.queryByRole('upload-file-form')).toBeNull()
    })


    test('отображает Loader при fallback Suspense', () => {
        getProviderWithStore(
            <UploadFile {...defaultProps} />)

        expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })
})