import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FilterState } from '../../types';



const initialState: FilterState = {
  pricingOptions: {
    Paid: false,
    Free: false,
    ViewOnly: false,
  },
  searchKeyword: '',
  sortBy: 'name',
  priceRange: [0, 999],
};

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    updatePricingOption: (state, action: PayloadAction<{ option: keyof FilterState['pricingOptions']; value: boolean }>) => {
      const { option, value } = action.payload;
      state.pricingOptions[option] = value;
    },
    updateSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchKeyword = action.payload;
    },
    updateSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    updatePriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.priceRange = action.payload;
    },
    updateMultipleFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      Object.assign(state, action.payload);
    },
    resetFilters: (state) => {
      state.pricingOptions = initialState.pricingOptions;
      // state.searchKeyword = initialState.searchKeyword;
      // state.priceRange = initialState.priceRange;
    },
  },
});

export const {
  updatePricingOption,
  updateSearchKeyword,
  updateSortBy,
  updatePriceRange,
  updateMultipleFilters,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;