import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FilterSection from './FilterSection';
import { ThemeProvider } from '@emotion/react';
import { theme } from '../../App';

jest.mock('./SearchInput', () => {
  const React = jest.requireActual('react');

  return function SearchInput() {
    return React.createElement('div', { 'data-testid': 'search-input' }, 'SearchInput');
  };
});

jest.mock('./PricingFilter', () => {
  const React = jest.requireActual('react');

  return function PricingFilter() {
    return React.createElement('div', { 'data-testid': 'pricing-filter' }, 'PricingFilter');
  };
});

jest.mock('../../store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn(() => ({
    searchKeyword: '',
    pricingOptions: { Paid: false, Free: false, ViewOnly: false },
    priceRange: [0, 100],
    sortBy: 'name'
  }))
}));

jest.mock('../../hooks/useQueryParams', () => ({
  useQueryParams: () => ({
    setMultipleParams: jest.fn()
  })
}));

// Mock store
const mockStore = configureStore({
  reducer: {
    filter: (state = {
      searchKeyword: '',
      pricingOptions: { Paid: false, Free: false, ViewOnly: false },
      priceRange: [0, 100],
      sortBy: 'name'
    }) => state
  }
});

describe('FilterSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    render(
        <ThemeProvider theme={theme}>
          <Provider store={mockStore}>
            <FilterSection />
          </Provider>
        </ThemeProvider>
    );
  });

  test('render', () => {
    expect(screen.getByText('SearchInput')).toBeInTheDocument();
    expect(screen.getByText('PricingFilter')).toBeInTheDocument();
    expect(screen.getByText('RESET')).toBeInTheDocument();
  });

  test('reset button', () => {
    const resetButton = screen.getByRole('button', { name: /reset/i });
    expect(resetButton).toBeInTheDocument();
    expect(resetButton).toHaveTextContent('RESET');
  });
});