import React from 'react'

import '@testing-library/jest-dom';

import { screen, fireEvent } from '@testing-library/react'
import UploadMenuWithButtonAction from '@/components/file-upload/UploadMenuWithButtonAction/UploadMenuWithButtonAction'

import * as selectors from '@/selectors/selectors';
import getProviderWithStore from '@/utils/tests-utils/getProviderWithStore';

jest.mock('@/selectors/selectors');

describe('UploadMenuWithButtonAction', () => {
    const setIsFormUploadFade = jest.fn()
    const setFile = jest.fn()
    const setFileSrc = jest.fn()
    const setIsFormUploadFile = jest.fn()

    afterEach(() => {
        jest.resetModules();
        document.body.innerHTML = '';
        jest.useRealTimers()
        jest.restoreAllMocks()
    });


    beforeEach(() => {
        jest.useFakeTimers()
        jest.clearAllMocks()
        jest.spyOn(selectors, 'selectChangeMessageState').mockReturnValue({ isChange: false, message: '' })
        global.URL.createObjectURL = jest.fn((file) => `blob:${file}`)
    })

    test('кнопка 📎 отображается, когда isChange false', () => {
        getProviderWithStore(
            <UploadMenuWithButtonAction
                setIsFormUploadFade={setIsFormUploadFade}
                setFile={setFile}
                setFileSrc={setFileSrc}
                isFormUploadFile={false}
                setIsFormUploadFile={setIsFormUploadFile}
            />)

        expect(screen.getByRole('button', { name: '📎' })).toBeInTheDocument()
    })

    test('при клике на кнопку открывается меню MediaUploadMenu', () => {
        getProviderWithStore(
            <UploadMenuWithButtonAction
                setIsFormUploadFade={setIsFormUploadFade}
                setFile={setFile}
                setFileSrc={setFileSrc}
                isFormUploadFile={false}
                setIsFormUploadFile={setIsFormUploadFile}
            />
        )
        const button = screen.getAllByRole('button', { name: '📎' })[0]
        fireEvent.click(button)

        jest.advanceTimersByTime(100)

        expect(screen.getByTestId('media-upload-menu')).toBeInTheDocument()
    })

    test('при выборе файла срабатывают все колбэки и меняется состояние', () => {
        getProviderWithStore(
            <UploadMenuWithButtonAction
                setIsFormUploadFade={setIsFormUploadFade}
                setFile={setFile}
                setFileSrc={setFileSrc}
                isFormUploadFile={false}
                setIsFormUploadFile={setIsFormUploadFile}
            />)

        fireEvent.click(screen.getAllByRole('button', { name: '📎' })[0])
        jest.advanceTimersByTime(100)

        const file = new File(['file content'], 'test.png', { type: 'image/png' })
        const input = screen.getByTestId('file-input')

        fireEvent.change(input, { target: { files: [file] } })

        expect(setIsFormUploadFile).toHaveBeenCalledWith(true)
        expect(setFile).toHaveBeenCalledWith(file)
        expect(setIsFormUploadFade).not.toHaveBeenCalled()

        jest.advanceTimersByTime(100)

        expect(setIsFormUploadFade).toHaveBeenCalledWith(true)
        expect(setFileSrc).toHaveBeenCalled()
        const url = setFileSrc.mock.calls[0][0]
        expect(typeof url).toBe('string')
        expect(url.startsWith('blob:')).toBe(true)
    })

    test('кнопка не отображается, когда changeMessageState.isChange true', () => {

        jest.spyOn(selectors, 'selectChangeMessageState').mockReturnValue({ isChange: true, message: '' });

        getProviderWithStore(
            <UploadMenuWithButtonAction
                setIsFormUploadFade={setIsFormUploadFade}
                setFile={setFile}
                setFileSrc={setFileSrc}
                isFormUploadFile={false}
                setIsFormUploadFile={setIsFormUploadFile}
            />
        )

        expect(screen.queryByRole('button', { name: '📎' })).toBeNull()
    })
})