import { renderHook, act } from '@testing-library/react';
import { useDebouncedCallback } from './useDebouncedCallback';

jest.useFakeTimers();

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should called after delay', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 100));

    act(() => {
      result.current('test');
    });

    // not called yet
    expect(mockCallback).not.toHaveBeenCalled();

    // advance time
    act(() => {
      jest.advanceTimersByTime(99);
    });

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('test');
  });

  it('showld call once after multiple calls', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 100));

    act(() => {
      result.current('first');
      result.current('second');
      result.current('third');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('third');
  });

  it('clear prev if new call come in', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 100));

    act(() => {
      result.current('first');
    });

    act(() => {
      jest.advanceTimersByTime(50);
    });

    act(() => {
      result.current('second');
    });

    // 快进99毫秒（总共149毫秒，但距离第二次调用只有49毫秒）
    act(() => {
      jest.advanceTimersByTime(99);
    });

    // 还不应该被调用
    expect(mockCallback).not.toHaveBeenCalled();

    // 再快进1毫秒（距离第二次调用50毫秒）
    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('second');
  });

  it('multiple params', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 100));

    act(() => {
      result.current('arg1', 'arg2', 123);
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockCallback).toHaveBeenCalledWith('arg1', 'arg2', 123);
  });


  it('0 delay', () => {
    const mockCallback = jest.fn();
    const { result } = renderHook(() => useDebouncedCallback(mockCallback, 0));

    act(() => {
      result.current('test');
    });

    act(() => {
      jest.advanceTimersByTime(0);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('test');
  });

  it('use new callback if updated', () => {
    const mockCallback1 = jest.fn();
    const mockCallback2 = jest.fn();

    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { callback: mockCallback1, delay: 100 },
      }
    );

    act(() => {
      result.current('test1');
    });

    // udpate
    rerender({ callback: mockCallback2, delay: 100 });

    act(() => {
      result.current('test2');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalledWith('test2');
  });

  it('use new time if udpated', () => {
    const mockCallback = jest.fn();
    const { result, rerender } = renderHook(
      ({ callback, delay }) => useDebouncedCallback(callback, delay),
      {
        initialProps: { callback: mockCallback, delay: 100 },
      }
    );

    act(() => {
      result.current('test');
    });

    // update
    rerender({ callback: mockCallback, delay: 200 });

    act(() => {
      result.current('test2');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockCallback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockCallback).toHaveBeenCalledTimes(1);
    expect(mockCallback).toHaveBeenCalledWith('test2');
  });
});