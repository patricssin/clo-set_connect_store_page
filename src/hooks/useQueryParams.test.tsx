import { renderHook, act } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { useQueryParams } from './useQueryParams';

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  useSearchParams: jest.fn(),
}));

describe('useQueryParams', () => {
  const mockSetSearchParams = jest.fn();
  const mockSearchParams = new URLSearchParams();

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue([mockSearchParams, mockSetSearchParams]);
  });

  it('should return empty params object when no search params exist', () => {
    const { result } = renderHook(() => useQueryParams<{ searchKeyword: string; filter: string }>());

    expect(result.current.params).toEqual({});
    expect(result.current.hasParams).toBe(false);
  });

  it('should return correct params object when search params exist', () => {
    mockSearchParams.set('searchKeyword', '1');
    mockSearchParams.set('filter', 'active');

    const { result } = renderHook(() => useQueryParams<{ searchKeyword: string; filter: string }>());

    expect(result.current.params).toEqual({
      searchKeyword: '1',
      filter: 'active',
    });
    expect(result.current.hasParams).toBe(true);
  });

  it('should set a single parameter with setParam', () => {
    const { result } = renderHook(() => useQueryParams());

    act(() => {
      result.current.setParam('searchKeyword', '2');
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(expect.any(Function));
    
    const updateFunction = mockSetSearchParams.mock.calls[0][0];
    const newParams = updateFunction(mockSearchParams);
    
    expect(newParams.get('searchKeyword')).toBe('2');
  });

  it('should remove parameter when setting empty value with setParam', () => {
    mockSearchParams.set('searchKeyword', '1');
    
    const { result } = renderHook(() => useQueryParams());

    act(() => {
      result.current.setParam('searchKeyword', '');
    });

    const updateFunction = mockSetSearchParams.mock.calls[0][0];
    const newParams = updateFunction(mockSearchParams);
    
    expect(newParams.get('searchKeyword')).toBeNull();
  });

  it('should set multiple parameters with setMultipleParams', () => {
    const { result } = renderHook(() => useQueryParams());

    act(() => {
      result.current.setMultipleParams({
        searchKeyword: '1',
        filter: 'active',
        sort: 'name',
      });
    });

    const updateFunction = mockSetSearchParams.mock.calls[0][0];
    const newParams = updateFunction(mockSearchParams);
    
    expect(newParams.get('searchKeyword')).toBe('1');
    expect(newParams.get('filter')).toBe('active');
    expect(newParams.get('sort')).toBe('name');
  });

  it('should remove parameters when setting empty values with setMultipleParams', () => {
    mockSearchParams.set('searchKeyword', '1');
    mockSearchParams.set('filter', 'active');

    const { result } = renderHook(() => useQueryParams());

    act(() => {
      result.current.setMultipleParams({
        searchKeyword: '',
        filter: 'inactive',
      });
    });

    const updateFunction = mockSetSearchParams.mock.calls[0][0];
    const newParams = updateFunction(mockSearchParams);
    
    expect(newParams.get('searchKeyword')).toBeNull();
    expect(newParams.get('filter')).toBe('inactive');
  });

  it('should clear all parameters with clearParams', () => {
    mockSearchParams.set('searchKeyword', '1');
    mockSearchParams.set('filter', 'active');

    const { result } = renderHook(() => useQueryParams());

    act(() => {
      result.current.clearParams();
    });

    expect(mockSetSearchParams).toHaveBeenCalledWith(new URLSearchParams());
  });
});