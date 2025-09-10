import { renderHook, act } from '@testing-library/react';
import { useInfiniteScroll } from './useInfiniteScroll';
import { useAppDispatch } from '../store/hooks';
import { loadMoreItems } from '../store/slices/contentSlice';

// Mock dependencies
jest.mock('../store/hooks', () => ({
  useAppDispatch: jest.fn(),
}));

jest.mock('../store/slices/contentSlice', () => ({
  loadMoreItems: jest.fn(),
}));

// Mock IntersectionObserver
const mockObserve = jest.fn();
const mockDisconnect = jest.fn();
const mockUnobserve = jest.fn();

const mockIntersectionObserver = jest.fn().mockImplementation((callback, options) => ({
  observe: mockObserve,
  disconnect: mockDisconnect,
  unobserve: mockUnobserve,
  root: null,
  rootMargin: '',
  thresholds: [options?.threshold || 0],
}));

describe('useInfiniteScroll', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    global.IntersectionObserver = mockIntersectionObserver;
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockIntersectionObserver.mockClear();
    mockObserve.mockClear();
    mockDisconnect.mockClear();
    mockUnobserve.mockClear();
  });

  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
  });

  it('should return a ref callback function', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: true })
    );

    expect(result.current).toHaveLength(1);
    expect(typeof result.current[0]).toBe('function');
  });

  it('should not create observer when node is null', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: true })
    );

    const lastItemRef = result.current[0];
    
    act(() => {
      lastItemRef(null);
    });

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });

  it('should create observer and observe node when provided', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: true })
    );

    const lastItemRef = result.current[0];
    const mockNode = document.createElement('div');

    act(() => {
      lastItemRef(mockNode);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 1 }
    );
    expect(mockObserve).toHaveBeenCalledWith(mockNode);
  });

  it('should use custom threshold value', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: true, threshold: 0.5 })
    );

    const lastItemRef = result.current[0];
    const mockNode = document.createElement('div');

    act(() => {
      lastItemRef(mockNode);
    });

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0.5 }
    );
  });

  it('should not dispatch when hasMore is false', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: false })
    );

    const lastItemRef = result.current[0];
    const mockNode = document.createElement('div');

    act(() => {
      lastItemRef(mockNode);
    });

    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0];
    
    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should dispatch loadMoreItems when conditions are met', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: true })
    );

    const lastItemRef = result.current[0];
    const mockNode = document.createElement('div');

    act(() => {
      lastItemRef(mockNode);
    });

    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0];
    
    act(() => {
      intersectionCallback([{ isIntersecting: true }]);
    });

    expect(mockDispatch).toHaveBeenCalledWith(loadMoreItems());
  });

  it('should not dispatch when not intersecting', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: true })
    );

    const lastItemRef = result.current[0];
    const mockNode = document.createElement('div');

    act(() => {
      lastItemRef(mockNode);
    });

    const intersectionCallback = mockIntersectionObserver.mock.calls[0][0];
    
    act(() => {
      intersectionCallback([{ isIntersecting: false }]);
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should disconnect existing observer on unmount', () => {
    const { result, unmount } = renderHook(() => 
      useInfiniteScroll({ loading: false, hasMore: true })
    );

    const lastItemRef = result.current[0];
    const mockNode = document.createElement('div');

    act(() => {
      lastItemRef(mockNode);
    });

    unmount();

    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });

  it('should not create observer when loading is true and node is provided', () => {
    const { result } = renderHook(() => 
      useInfiniteScroll({ loading: true, hasMore: true })
    );

    const lastItemRef = result.current[0];
    const mockNode = document.createElement('div');

    act(() => {
      lastItemRef(mockNode);
    });

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });
});