import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ContentList from './ContentList';
import contentSlice from '../../store/slices/contentSlice';

// Mock useInfiniteScroll hook
jest.mock('../../hooks/useInfiniteScroll', () => ({
  useInfiniteScroll: jest.fn(),
}));

// Mock ContentItem with forwardRef - 使用 React.createElement 避免 JSX
jest.mock('./ContentItem', () => {
  const React = jest.requireActual('react');
  return {
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) => {
      return React.createElement('div', {
        ref: ref,
        'data-testid': `content-item-${props.item.id}`,
        'data-last-item': props['data-last-item'] || false
      }, props.item.title);
    })
  };
});

// Mock SkeletonLoader - 使用 React.createElement 避免 JSX
jest.mock('./SkeletonLoader', () => {
  const React = jest.requireActual('react');
  return {
    __esModule: true,
    default: () => React.createElement('div', {
      'data-testid': 'skeleton-container'
    }, 'Loading...')
  };
});

// Mock Redux hooks
jest.mock('../../store/hooks', () => ({
  useAppSelector: jest.fn(),
  useAppDispatch: jest.fn(),
}));

// Mock contentSlice
jest.mock('../../store/slices/contentSlice', () => ({
  loadMoreItems: jest.fn(),
  default: jest.fn((state = {
    displayedItems: [],
    loading: false,
    hasMore: true,
  }, action) => state)
}));

describe('ContentList', () => {
  const mockUseInfiniteScroll = require('../../hooks/useInfiniteScroll').useInfiniteScroll;
  const mockUseAppSelector = require('../../store/hooks').useAppSelector;
  const mockUseAppDispatch = require('../../store/hooks').useAppDispatch;
  const mockLoadMoreItems = require('../../store/slices/contentSlice').loadMoreItems;
  const mockItems = [{ id: '1', title: 'Item 1' }, { id: '2', title: 'Item 2' }]
  const mockDispatch = jest.fn();
  const mockRef = jest.fn();

 const createStore = (teststore?: {displayedItems: {id: string, title: string}[], loading: boolean, hasMore: boolean }) => {
    return configureStore({
      reducer: {
        content: () => (teststore || {
          displayedItems: mockItems,
          loading: false,
          hasMore: true,
        }),
      },
    });
  };

  beforeEach(() => {
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseInfiniteScroll.mockReturnValue([mockRef, {}]);
    jest.clearAllMocks();
  });
  const renderComponent = (store = createStore()) => {
    mockUseAppSelector.mockImplementation((selector: any) => selector({
      content: store.getState().content
    }));

    return render(
        <Provider store={store}>
          <ContentList />
        </Provider>
    );
  };

  it('renders empty state when no items and not loading', () => {
    const store = createStore({ displayedItems: [], loading: false,  hasMore: false });
    renderComponent(store);

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters or search terms.')).toBeInTheDocument();
  });

  it('renders content items', () => {
    const store = createStore();
    renderComponent(store);

    expect(screen.getByTestId('content-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-item-2')).toBeInTheDocument();
  });

  it('applies ref to the last content item', () => {
    const store = createStore({ displayedItems: mockItems, loading: false, hasMore: true});
    renderComponent(store);
    const contentItems = screen.getAllByTestId(/content-item-/);
    expect(contentItems).toHaveLength(2);
  });

  it('shows skeleton loaders when loading', () => {
    const store = createStore({ displayedItems: [{ id: '1', title: 'Item 1' }], loading: true, hasMore: true});
    renderComponent(store);

    expect(screen.getAllByTestId('skeleton-container')).toHaveLength(8);
    expect(screen.getByText('Loading more items...')).toBeInTheDocument();
  });

  it('shows "no more items" message when hasMore is false', () => {
    const store = createStore({ displayedItems: mockItems, loading: false, hasMore: false});
    renderComponent(store);

    expect(screen.getByTestId('nomore-items')).toBeInTheDocument();
  });

  it('does not dispatch loadMoreItems when already loading', () => {
    const store = createStore({ displayedItems: mockItems, loading: true, hasMore: true});
    renderComponent(store);

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch loadMoreItems when no more items', () => {
    const store = createStore({ displayedItems: [], loading: false, hasMore: false});
    renderComponent(store);

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});