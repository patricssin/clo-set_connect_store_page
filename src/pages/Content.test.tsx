import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Content } from './Content';

jest.mock('../components/Filters/FilterSection', () => 'filter-section');
jest.mock('../components/Contents/ContentList', () => 'content-list');
jest.mock('../components/Filters/CustomSelect', () => 'custom-select');

jest.mock('../store/hooks', () => ({
  useAppDispatch: () => jest.fn(),
  useAppSelector: jest.fn((selector) => selector({
    filter: {
      searchKeyword: '',
      pricingOptions: { Paid: false, Free: false, ViewOnly: false },
      priceRange: [0, 100],
      sortBy: 'name'
    }
  }))
}));

jest.mock('../hooks/useQueryParams', () => ({
  useQueryParams: () => ({
    params: {}
  })
}));

jest.mock('../store/slices/contentSlice', () => ({
  fetchContents: jest.fn(),
  applyContentFilters: jest.fn()
}));

jest.spyOn(React, 'useEffect').mockImplementation((effect) => {
  if (typeof effect === 'function') {
    effect();
  }
});

const mockStore = configureStore({
  reducer: {
    filter: (state = {}) => state,
    content: (state = {}) => state
  }
});

describe('Content Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('render without error', () => {
    expect(() => {
      render(
        <Provider store={mockStore}>
          <Content />
        </Provider>
      );
    }).not.toThrow();
  });

  test('render container', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <Content />
      </Provider>
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(container.firstChild).toHaveStyle('padding: 20px');
    expect(container.firstChild).toHaveStyle('margin: 0 auto');
  });

  test('render children', () => {
    const { container } = render(
      <Provider store={mockStore}>
        <Content />
      </Provider>
    );

    expect(container.innerHTML).toContain('filter-section');
    expect(container.innerHTML).toContain('content-list');
    expect(container.innerHTML).toContain('custom-select');
  });
});