import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import SearchInput from './SearchInput';
import { updateSearchKeyword } from '../../store/slices/filterSlice';
import { useDebouncedCallback } from '../../hooks/useDebouncedCallback';
import { useQueryParams } from '../../hooks/useQueryParams';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../../App';

// Mock dependencies
jest.mock('../../store/slices/filterSlice', () => ({
  updateSearchKeyword: jest.fn(),
}));

jest.mock('../../hooks/useDebouncedCallback', () => ({
  useDebouncedCallback: jest.fn(),
}));

jest.mock('../../hooks/useQueryParams', () => ({
  useQueryParams: jest.fn(),
}));

const mockUpdateSearchKeyword = updateSearchKeyword as jest.MockedFunction<typeof updateSearchKeyword>;
const mockUseDebouncedCallback = useDebouncedCallback as jest.MockedFunction<typeof useDebouncedCallback>;
const mockUseQueryParams = useQueryParams as jest.MockedFunction<typeof useQueryParams>;
const mockSetParam = jest.fn();
const mockDebouncedCallback = jest.fn();

describe('SearchInput', () => {
  const createStore = (searchKeyword = '') => {
    return configureStore({
      reducer: {
        filter: () => ({
          pricingOptions: { Paid: false, Free: false, ViewOnly: false },
          searchKeyword,
          sortBy: 'name',
          priceRange: [0, 999],
        }),
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    
    mockUseQueryParams.mockReturnValue({
      params: {},
      setParam: mockSetParam,
      setMultipleParams: jest.fn(),
      clearParams: jest.fn(),
      hasParams: false,
    });

    mockUseDebouncedCallback.mockImplementation((callback) => {
      mockDebouncedCallback.mockImplementation(callback);
      return mockDebouncedCallback;
    });

    mockUpdateSearchKeyword.mockReturnValue({
      type: 'filter/updateSearchKeyword',
      payload: '',
    });
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  const renderComponent = (store = createStore()) => {
    return render(
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <SearchInput />
        </Provider>
      </ThemeProvider>
    );
  };

  it('should render search input with placeholder', () => {
    renderComponent();

    expect(screen.getByPlaceholderText("Find the items you're looking for")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('should display initial search keyword from store', () => {
    const store = createStore('initial search');
    renderComponent(store);

    const input = screen.getByPlaceholderText("Find the items you're looking for") as HTMLInputElement;
    expect(input.value).toBe('initial search');
  });

  it('should call debounced callback on input change', () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Find the items you're looking for");
    fireEvent.change(input, { target: { value: 'test search' } });

    expect(mockDebouncedCallback).toHaveBeenCalledWith('test search');
  });

  it('should dispatch action and set param when debounced callback is called', async () => {
    renderComponent();

    mockDebouncedCallback('test search');

    expect(mockUpdateSearchKeyword).toHaveBeenCalledWith('test search');
    expect(mockSetParam).toHaveBeenCalledWith('searchKeyword', 'test%20search');
  });

  it('should handle empty search value', () => {
    renderComponent();

    mockDebouncedCallback('   ');

    expect(mockUpdateSearchKeyword).toHaveBeenCalledWith('');
    expect(mockSetParam).toHaveBeenCalledWith('searchKeyword', '');
  });

  it('should handle search button click', () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Find the items you're looking for");
    const searchButton = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'button search' } });

    fireEvent.click(searchButton);

    expect(mockUpdateSearchKeyword).toHaveBeenCalledWith('button search');
  });

  it('should handle Enter key press', () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Find the items you're looking for");

    fireEvent.change(input, { target: { value: 'enter search' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(mockUpdateSearchKeyword).toHaveBeenCalledWith('enter search');
  });

  it('should not trigger search on other key presses', () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Find the items you're looking for");

    fireEvent.change(input, { target: { value: 'other key' } });

    expect(mockDebouncedCallback).toHaveBeenCalledWith('other key');
    expect(mockUpdateSearchKeyword).toHaveBeenCalledTimes(1);
  
    mockUpdateSearchKeyword.mockClear();
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });
    expect(mockUpdateSearchKeyword).toHaveBeenCalledTimes(0); 
  });

  it('should trim search values', () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Find the items you're looking for");
    fireEvent.change(input, { target: { value: '  trimmed  ' } });

    mockDebouncedCallback('  trimmed  ');

    expect(mockUpdateSearchKeyword).toHaveBeenCalledWith('trimmed');
    expect(mockSetParam).toHaveBeenCalledWith('searchKeyword', 'trimmed');
  });

  it('should handle special characters in search', () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Find the items you're looking for");
    fireEvent.change(input, { target: { value: 'test@domain.com #special' } });

    mockDebouncedCallback('test@domain.com #special');

    expect(mockUpdateSearchKeyword).toHaveBeenCalledWith('test@domain.com #special');
    expect(mockSetParam).toHaveBeenCalledWith('searchKeyword', 'test%40domain.com%20%23special');
  });

  it('should have proper accessibility attributes', () => {
    renderComponent();

    const input = screen.getByPlaceholderText("Find the items you're looking for");
    const searchButton = screen.getByRole('button', { name: /search/i });

    expect(input).toHaveAttribute('type', 'text');
    expect(searchButton).toHaveAttribute('aria-label', 'Search');
  });

  it('should use debounce with correct delay', () => {
    renderComponent();

    expect(mockUseDebouncedCallback).toHaveBeenCalledWith(expect.any(Function), 500);
  });
});