import { act, renderHook } from '@testing-library/react';
import { useDebounce } from '../src/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('возвращает начальное значение сразу', () => {
    const { result } = renderHook(() => useDebounce('initial', 300));
    expect(result.current).toBe('initial');
  });

  it('не обновляет значение немедленно при изменении', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });

    expect(result.current).toBe('initial');
  });

  it('обновляет значение после задержки', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    act(() => jest.advanceTimersByTime(300));

    expect(result.current).toBe('updated');
  });

  it('сбрасывает таймер при быстром изменении значения', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    );

    rerender({ value: 'b' });
    act(() => jest.advanceTimersByTime(200));

    rerender({ value: 'c' });
    act(() => jest.advanceTimersByTime(200));

    // Таймер был сброшен, значение не изменилось
    expect(result.current).toBe('a');

    act(() => jest.advanceTimersByTime(100));

    // Теперь таймер для 'c' сработал
    expect(result.current).toBe('c');
  });

  it('не обновляет значение после размонтирования', () => {
    const { result, rerender, unmount } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    rerender({ value: 'updated' });
    unmount();

    act(() => jest.advanceTimersByTime(300));

    // Значение остаётся прежним — таймер был очищен при размонтировании
    expect(result.current).toBe('initial');
  });

  it('работает с числовым типом', () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: 0 } }
    );

    rerender({ value: 42 });
    act(() => jest.advanceTimersByTime(100));

    expect(result.current).toBe(42);
  });
});
