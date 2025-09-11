import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem, FilterState } from '../../types';
import { applyFilters, getFilterFromParams } from '../../utils/filterUtils';
import { RootState } from '../index';
import axios from 'axios';
import { initialFilterState, updateMultipleFilters } from './filterSlice';

export interface ContentState {
  items: ContentItem[];
  filteredItems: ContentItem[];
  displayedItems: ContentItem[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: ContentState = {
  items: [],
  filteredItems: [],
  displayedItems: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

const ITEMS_PER_PAGE = 12;

export const fetchContents = createAsyncThunk<ContentItem[], Record<string, string>>(
  'content/fetchContents',
  async (args, {dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get('https://closet-recruiting-api.azurewebsites.net/api/data');
      if (Object.keys(args).length !== 0) {
        setTimeout(() => {
          dispatch(updateMultipleFilters(getFilterFromParams(args)));
        }, 100);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch content');
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    applyContentFilters: (state, action: PayloadAction<FilterState>) => {
      state.filteredItems = applyFilters(state.items, action.payload);
      state.displayedItems = state.filteredItems.slice(0, ITEMS_PER_PAGE);
      state.page = 1;
      state.hasMore = state.filteredItems.length > ITEMS_PER_PAGE;
    },
    loadMoreItems: (state) => {
      state.loading = true;
      const nextPage = state.page + 1;
      const startIndex = (nextPage - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      
      if (startIndex >= state.filteredItems.length) {
        state.hasMore = false;
        return;
      }
      
      state.displayedItems = [
        ...state.displayedItems,
        ...state.filteredItems.slice(startIndex, endIndex)
      ];
      state.page = nextPage;
      state.hasMore = endIndex < state.filteredItems.length;
    },
    mockLoadingForDelay: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.filteredItems = applyFilters(action.payload, initialFilterState);
        state.displayedItems =  state.filteredItems.slice(0, ITEMS_PER_PAGE);
        state.hasMore = action.payload.length > ITEMS_PER_PAGE;
      })
      .addCase(fetchContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { applyContentFilters, loadMoreItems, clearError, mockLoadingForDelay } = contentSlice.actions;
export default contentSlice.reducer;