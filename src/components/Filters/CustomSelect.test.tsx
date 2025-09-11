import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import CustomSelectDropdown from './CustomSelect';
import filterReducer, { initialFilterState } from '../../store/slices/filterSlice';
import { useQueryParams } from '../../hooks/useQueryParams';

// Mock the useQueryParams hook
jest.mock('../../hooks/useQueryParams');

const mockSetParam = jest.fn();
const mockUseQueryParams = useQueryParams as jest.MockedFunction<typeof useQueryParams>;

describe('CustomSelectDropdown', () => {
  const createStore = (initialState = initialFilterState) => {
    return configureStore({
      reducer: {
        filter: filterReducer,
      },
      preloadedState: {
        filter: initialState,
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseQueryParams.mockReturnValue({
      params: {},
      setParam: mockSetParam,
      setMultipleParams: jest.fn(),
      clearParams: jest.fn(),
      hasParams: false,
    });
  });

  const renderComponent = (store = createStore()) => {
    return render(
      <Provider store={store}>
        <CustomSelectDropdown />
      </Provider>
    );
  };

  it('should render with default sort option', () => {
    renderComponent();

    expect(screen.getByText('Sort By')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /item name/i })).toBeInTheDocument();
  });

  it('should display different initial sort option based on store state', () => {
    const store = createStore({...initialFilterState, sortBy: 'price_high' });
    renderComponent(store);

    expect(screen.getByRole('button', { name: /higher price/i })).toBeInTheDocument();
  });

  it('should open dropdown when clicked', async () => {
    renderComponent();

    const dropdownButton = screen.getByRole('button', { name: /item name/i });
    fireEvent.click(dropdownButton);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeVisible();
    });
    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
  });

  it('should close dropdown when clicking outside', async () => {
    renderComponent();

    const dropdownButton = screen.getByRole('button', { name: /item name/i });
    fireEvent.click(dropdownButton);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('should select an option and update store and URL', async () => {
    const store = createStore();
    renderComponent(store);

    const dropdownButton = screen.getByRole('button', { name: /item name/i });
    fireEvent.click(dropdownButton);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    const higherPriceOption = screen.getByRole('option', { name: /higher price/i });
    fireEvent.click(higherPriceOption);

    const state = store.getState();
    expect(state.filter.sortBy).toBe('price_high');

    expect(mockSetParam).toHaveBeenCalledWith('sortBy', 'price_high');
  });

  it('should close dropdown after selecting an option', async () => {
    renderComponent();

    const dropdownButton = screen.getByRole('button', { name: /item name/i });
    fireEvent.click(dropdownButton);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    const lowerPriceOption = screen.getByRole('option', { name: /lower price/i });
    fireEvent.click(lowerPriceOption);

    await waitFor(() => {
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  it('should highlight the selected option in dropdown', async () => {
    const store = createStore({ ...initialFilterState,sortBy: 'price_low' });
    renderComponent(store);

    const dropdownButton = screen.getByRole('button', { name: /lower price/i });
    fireEvent.click(dropdownButton);

    await waitFor(() => {
      expect(screen.getByRole('listbox')).toBeVisible();
    });

    const selectedOption = screen.getByRole('option', { name: /lower price/i, selected: true });
    expect(selectedOption).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderComponent();

    const dropdownButton = screen.getByRole('button', { name: /item name/i });
    expect(dropdownButton).toHaveAttribute('aria-haspopup', 'listbox');
    expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(dropdownButton);

    expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('should update displayed label when store sortBy changes', () => {
    const store = createStore(initialFilterState);
    const { rerender } = render(
      <Provider store={store}>
        <CustomSelectDropdown />
      </Provider>
    );

    expect(screen.getByRole('button', { name: /item name/i })).toBeInTheDocument();

    const updatedStore = createStore({ ...initialFilterState,sortBy: 'price_high' });
    rerender(
      <Provider store={updatedStore}>
        <CustomSelectDropdown />
      </Provider>
    );

    expect(screen.getByRole('button', { name: /higher price/i })).toBeInTheDocument();
  });
});