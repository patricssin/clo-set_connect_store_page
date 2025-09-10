import { configureStore } from '@reduxjs/toolkit';
import contentReducer, {
  fetchContents,
  applyContentFilters,
  loadMoreItems,
  clearError,
  ContentState,
} from './contentSlice';
import { updateMultipleFilters } from './filterSlice';
import { applyFilters, getFilterFromParams } from '../../utils/filterUtils';
import axios from 'axios';
import { ContentItem, FilterState } from '../../types';

// Mock dependencies
jest.mock('axios');
jest.mock('../../utils/filterUtils');
jest.mock('./filterSlice');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedApplyFilters = applyFilters as jest.MockedFunction<typeof applyFilters>;
const mockedGetFilterFromParams = getFilterFromParams as jest.MockedFunction<typeof getFilterFromParams>;
const mockedUpdateMultipleFilters = updateMultipleFilters as jest.MockedFunction<typeof updateMultipleFilters>;

describe('contentSlice', () => {
  const mockItems: ContentItem[] = [
    { id: '1', title: 'Item 1', creator: 'Creator 1', pricingOption: 0, price: 10 ,imagePath:''},
    { id: '2', title: 'Item 2', creator: 'Creator 2', pricingOption: 1, price: 0  ,imagePath:''},
    { id: '3', title: 'Item 3', creator: 'Creator 3', pricingOption: 2, price: 5 ,imagePath:'' },
  ];

  const initialState: ContentState = {
    items: [],
    filteredItems: [],
    displayedItems: [],
    loading: false,
    error: null,
    hasMore: true,
    page: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockedApplyFilters.mockImplementation((items) => items);
    mockedGetFilterFromParams.mockReturnValue({
      pricingOptions: { Paid: false, Free: false, ViewOnly: false },
      searchKeyword: '',
      sortBy: 'name',
      priceRange: [0, 999],
    });
  });

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(contentReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    describe('applyContentFilters', () => {
      it('should apply filters and reset pagination', () => {
        const stateWithItems: ContentState = {
          ...initialState,
          items: mockItems,
          filteredItems: mockItems,
          displayedItems: mockItems.slice(0, 2),
          page: 2,
          hasMore: true,
        };

        const mockFilterState: FilterState = {
          pricingOptions: { Paid: true, Free: false, ViewOnly: false },
          searchKeyword: '',
          sortBy: 'name',
          priceRange: [0, 999],
        };

        const filteredItems = [mockItems[0]];
        mockedApplyFilters.mockReturnValue(filteredItems);

        const action = applyContentFilters(mockFilterState);
        const newState = contentReducer(stateWithItems, action);

        expect(mockedApplyFilters).toHaveBeenCalled();
        expect(newState.filteredItems).toEqual(filteredItems);
        expect(newState.displayedItems).toEqual(filteredItems.slice(0, 12));
        expect(newState.page).toBe(1);
        expect(newState.hasMore).toBe(false);
      });
    });

    describe('loadMoreItems', () => {
      it('should load more items when hasMore is true', () => {
        const manyItems = Array.from({ length: 25 }, (_, i) => ({
          id: `${i + 1}`,
          title: `Item ${i + 1}`,
          creator: `Creator ${i + 1}`,
          pricingOption: 1 as 0 | 1 | 2,
          price: i * 10,
          imagePath: ''
        }));

        const state: ContentState = {
          ...initialState,
          items: manyItems,
          filteredItems: manyItems,
          displayedItems: manyItems.slice(0, 12),
          page: 1,
          hasMore: true,
        };

        const action = loadMoreItems();
        const newState = contentReducer(state, action);

        expect(newState.displayedItems).toHaveLength(24);
        expect(newState.page).toBe(2);
        expect(newState.hasMore).toBe(true);
      });

      it('should not load more items when hasMore is false', () => {
        const state: ContentState = {
          ...initialState,
          items: mockItems,
          filteredItems: mockItems,
          displayedItems: mockItems,
          page: 1,
          hasMore: false,
        };

        const action = loadMoreItems();
        const newState = contentReducer(state, action);

        expect(newState.displayedItems).toEqual(mockItems);
        expect(newState.page).toBe(1);
        expect(newState.hasMore).toBe(false);
      });

      it('should set hasMore to false when no more items', () => {
        const exactly12Items = Array.from({ length: 12 }, (_, i) => ({
          id: `${i + 1}`,
          title: `Item ${i + 1}`,
          creator: `Creator ${i + 1}`,
          pricingOption: 1 as 0 | 1 | 2,
          price: i * 10,
          imagePath: ''
        }));

        const state: ContentState = {
          ...initialState,
          items: exactly12Items,
          filteredItems: exactly12Items,
          displayedItems: exactly12Items.slice(0, 12),
          page: 1,
          hasMore: true,
        };

        const action = loadMoreItems();
        const newState = contentReducer(state, action);

        expect(newState.displayedItems).toHaveLength(12);
        expect(newState.hasMore).toBe(false);
      });
    });

    describe('clearError', () => {
      it('should clear error', () => {
        const stateWithError: ContentState = {
          ...initialState,
          error: 'Some error',
        };

        const action = clearError();
        const newState = contentReducer(stateWithError, action);

        expect(newState.error).toBeNull();
      });
    });
  });

  describe('extraReducers', () => {
    describe('fetchContents', () => {
      it('should handle pending state', () => {
        const action = { type: fetchContents.pending.type };
        const state = contentReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it('should handle fulfilled state', async () => {
        mockedAxios.get.mockResolvedValue({ data: mockItems });

        const action = {
          type: fetchContents.fulfilled.type,
          payload: mockItems,
        };
        const state = contentReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.items).toEqual(mockItems);
        expect(state.filteredItems).toEqual(mockItems);
        expect(state.displayedItems).toEqual(mockItems.slice(0, 12));
        expect(state.hasMore).toBe(mockItems.length > 12);
      });

      it('should handle fulfilled state with empty args', async () => {
        const store = configureStore({
          reducer: {
            content: contentReducer,
          },
        });

        await store.dispatch(fetchContents({}));

        expect(mockedUpdateMultipleFilters).not.toHaveBeenCalled();
      });

      it('should handle rejected state', () => {
        const errorMessage = 'Network error';
        const action = {
          type: fetchContents.rejected.type,
          payload: errorMessage,
        };
        const state = contentReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe(errorMessage);
      });

      it('should handle rejected state with error object', () => {
        const error = new Error('Network error');
        const action = {
          type: fetchContents.rejected.type,
          payload: error.message,
        };
        const state = contentReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe('Network error');
      });
    });
  });

  describe('fetchContents async thunk', () => {

    it('should handle API error', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();

      const error = new Error('API error');
      mockedAxios.get.mockRejectedValue(error);

      const result = await fetchContents({})(dispatch, getState, undefined);

      expect(result.payload).toBe('API error');
    });

    it('should handle unknown error', async () => {
      const dispatch = jest.fn();
      const getState = jest.fn();

      mockedAxios.get.mockRejectedValue('Unknown error');

      const result = await fetchContents({})(dispatch, getState, undefined);

      expect(result.payload).toBe('Failed to fetch content');
    });
  });

  describe('edge cases', () => {
    it('should handle exactly ITEMS_PER_PAGE items', () => {
      const exactly12Items = Array.from({ length: 12 }, (_, i) => ({
        id: `${i + 1}`,
        title: `Item ${i + 1}`,
        creator: `Creator ${i + 1}`,
        pricingOption: i % 3,
        price: i * 10,
      }));

      const action = {
        type: fetchContents.fulfilled.type,
        payload: exactly12Items,
      };
      const state = contentReducer(initialState, action);

      expect(state.displayedItems).toHaveLength(12);
      expect(state.hasMore).toBe(false);
    });

    it('should handle less than ITEMS_PER_PAGE items', () => {
      const action = {
        type: fetchContents.fulfilled.type,
        payload: mockItems,
      };
      const state = contentReducer(initialState, action);

      expect(state.displayedItems).toHaveLength(3);
      expect(state.hasMore).toBe(false);
    });

    it('should handle empty items array', () => {
      const action = {
        type: fetchContents.fulfilled.type,
        payload: [],
      };
      const state = contentReducer(initialState, action);

      expect(state.displayedItems).toHaveLength(0);
      expect(state.hasMore).toBe(false);
    });
  });
});