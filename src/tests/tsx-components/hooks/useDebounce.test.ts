import { act, renderHook, waitFor } from '@testing-library/react';
import useDebounce from '../../../hooks/useDebounce';

describe('Тест хука useDebounce', () => {
    test('Должен возвращать начальное значение', () => {
        const { result } = renderHook((value) => useDebounce(value, 1000), {
            initialProps: 'start',
        });
        expect(result.current).toBe('start');
    });

    test('Должен обновлять значение после задержки', async () => {
        const { result, rerender } = renderHook(
            (value) => useDebounce(value, 1000),
            { initialProps: 'start' }
        );

        act(() => {
            rerender('new start');
        });

        await waitFor(() => {
            expect(result.current).toBe('new start');
        }, { timeout: 2000 });
    });

    test('Не должен обновлять значение при частых изменениях до истечения задержки', async () => {
        const { result, rerender } = renderHook(
            (value) => useDebounce(value, 1000),
            { initialProps: 'start' }
        );

        act(() => {
            rerender('first start');
            rerender('second start');
        });

        await waitFor(() => {
            expect(result.current).toBe('second start');
        }, { timeout: 1100 });
    });

    test('Должен корректно работать с разными задержками', async () => {
        const { result, rerender } = renderHook(
            (value) => useDebounce(value, 500),
            { initialProps: 'start' }
        );

        act(() => {
            rerender('new start');
        });

        await waitFor(() => {
            expect(result.current).toBe('new start');
        }, { timeout: 1100 });
    });

    test('Должен очищать таймер при размонтировании компонента', () => {
        const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

        const { unmount } = renderHook((value) => useDebounce(value, 1000), {
            initialProps: 'start',
        });

        unmount();

        expect(clearTimeoutSpy).toHaveBeenCalled();

        clearTimeoutSpy.mockRestore();
    });
});