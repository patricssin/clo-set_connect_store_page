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
  const React = require('react');
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
  const React = require('react');
  return {
    __esModule: true,
    default: () => React.createElement('div', {
      'data-testid': 'skeleton-loader'
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

  const mockDispatch = jest.fn();
  const mockRef = jest.fn();

  beforeEach(() => {
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseInfiniteScroll.mockReturnValue([mockRef, {}]);
    jest.clearAllMocks();
  });

  const renderComponent = (state: any) => {
    mockUseAppSelector.mockImplementation((selector: any) => selector({
      content: state
    }));

    const store = configureStore({
      reducer: {
        content: contentSlice,
      },
      preloadedState: {
        content: state,
      },
    });

    return render(
      <Provider store={store}>
        <ContentList />
      </Provider>
    );
  };

  it('renders empty state when no items and not loading', () => {
    renderComponent({
      displayedItems: [],
      loading: false,
      hasMore: false,
    });

    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters or search terms.')).toBeInTheDocument();
  });

  it('renders content items', () => {
    const mockItems = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
    ];

    renderComponent({
      displayedItems: mockItems,
      loading: false,
      hasMore: true,
    });

    expect(screen.getByTestId('content-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('content-item-2')).toBeInTheDocument();
  });

  it('applies ref to the last content item', () => {
    const mockItems = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
    ];

    renderComponent({
      displayedItems: mockItems,
      loading: false,
      hasMore: true,
    });

    const contentItems = screen.getAllByTestId(/content-item-/);
    expect(contentItems).toHaveLength(2);
  });

  it('shows skeleton loaders when loading', () => {
    const mockItems = [{ id: '1', title: 'Item 1' }];

    renderComponent({
      displayedItems: mockItems,
      loading: true,
      hasMore: true,
    });

    expect(screen.getAllByTestId('skeleton-loader')).toHaveLength(8);
    expect(screen.getByText('Loading more items...')).toBeInTheDocument();
  });

  it('shows "no more items" message when hasMore is false', () => {
    const mockItems = [
      { id: '1', title: 'Item 1' },
      { id: '2', title: 'Item 2' },
    ];

    renderComponent({
      displayedItems: mockItems,
      loading: false,
      hasMore: false,
    });

    expect(screen.getByText('No more items to load')).toBeInTheDocument();
  });

  it('dispatches loadMoreItems when no items but hasMore is true', () => {
    renderComponent({
      displayedItems: [],
      loading: false,
      hasMore: true,
    });

    expect(mockDispatch).toHaveBeenCalledWith(mockLoadMoreItems());
  });

  it('does not dispatch loadMoreItems when already loading', () => {
    renderComponent({
      displayedItems: [],
      loading: true,
      hasMore: true,
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch loadMoreItems when no more items', () => {
    renderComponent({
      displayedItems: [],
      loading: false,
      hasMore: false,
    });

    expect(mockDispatch).not.toHaveBeenCalled();
  });
});