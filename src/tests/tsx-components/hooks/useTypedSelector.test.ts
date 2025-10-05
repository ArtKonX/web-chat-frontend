jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn(),
}));

import { renderHook } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { useSelector } from '../../../hooks/useTypedSelector';
import { selectImageState } from '@/selectors/selectors';

const useSelectorMock = reactRedux.useSelector as unknown as jest.Mock;

interface TestState {
    url: string;
}

describe('Тест обёртки хука useTypedSelector', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('должен вызывать react-redux useSelector с переданным селектором и возвращать его результат', () => {
        const fakeState: TestState = { url: '123' };
        const selector = jest.fn().mockReturnValue('selected');

        useSelectorMock.mockImplementation((sel) => sel(fakeState));

        const { result } = renderHook(() => useSelector(selector));

        expect(selector).toHaveBeenCalledWith(fakeState);
        expect(result.current).toBe('selected');
        expect(useSelectorMock).toHaveBeenCalledWith(selector);
    });

    it('должен корректно обрабатывать селекторы с разными типами', () => {
        useSelectorMock.mockImplementation((sel) => {
            if (sel === selectImageState) {
                return { url: '123' };
            }
            return undefined;
        });

        const { result } = renderHook(() => useSelector(selectImageState));

        expect(result.current.url).toBe('123');
    });

    it('должен обрабатывать селекторы без аргументов', () => {
        useSelectorMock.mockImplementation(() => 'default');

        const { result } = renderHook(() => useSelector(() => 'default'));

        expect(result.current).toBe('default');
    });
});