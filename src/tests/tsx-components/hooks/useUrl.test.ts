import { renderHook } from '@testing-library/react';
import useUrl from '../../../hooks/useUrl';

describe('Тест хука useUrl', () => {
    let originalHistory: History;

    beforeAll(() => {
        originalHistory = window.history;
    });

    beforeEach(() => {

        window.history = {
            pushState: jest.fn(),
            replaceState: jest.fn(),
            state: null
        } as unknown as History;
    });

    afterEach(() => {
        window.history = originalHistory;
    });

    it('должен корректно инициализировать URL на клиенте', async () => {
        const { result } = renderHook(() => useUrl());

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(result.current.url).toBeInstanceOf(URL);
        expect(result.current.url?.href).toBe('http://localhost/');
    });

    it('должен корректно обрабатывать изменение URL', async () => {
        const { result } = renderHook(() => useUrl());

        await new Promise(resolve => setTimeout(resolve, 0));

        window.history.pushState({}, '', '/new-path?query=456');
        window.dispatchEvent(new HashChangeEvent('hashchange'));

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(result.current.url?.href).toBe('http://localhost/new-path?query=456');
    });
});