import { FilterState } from '../../types';
import filterReducer, {
  updatePricingOption,
  updateSearchKeyword,
  updateSortBy,
  updatePriceRange,
  updateMultipleFilters,
  resetFilters,
} from './filterSlice';

describe('filterSlice', () => {
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

  it('should return the initial state', () => {
    expect(filterReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('updatePricingOption', () => {
    it('should update a single pricing option to true', () => {
      const action = updatePricingOption({ option: 'Paid', value: true });
      const state = filterReducer(initialState, action);
      
      expect(state.pricingOptions.Paid).toBe(true);
      expect(state.pricingOptions.Free).toBe(false);
      expect(state.pricingOptions.ViewOnly).toBe(false);
    });

    it('should update a single pricing option to false', () => {
      const state1 = filterReducer(initialState, updatePricingOption({ option: 'Free', value: true }));
      expect(state1.pricingOptions.Free).toBe(true);

      const action = updatePricingOption({ option: 'Free', value: false });
      const state2 = filterReducer(state1, action);
      
      expect(state2.pricingOptions.Free).toBe(false);
    });

    it('should update multiple pricing options independently', () => {
      let state = initialState;
      
      state = filterReducer(state, updatePricingOption({ option: 'Paid', value: true }));
      expect(state.pricingOptions.Paid).toBe(true);
      expect(state.pricingOptions.Free).toBe(false);

      state = filterReducer(state, updatePricingOption({ option: 'Free', value: true }));
      expect(state.pricingOptions.Paid).toBe(true);
      expect(state.pricingOptions.Free).toBe(true);
      expect(state.pricingOptions.ViewOnly).toBe(false);

      state = filterReducer(state, updatePricingOption({ option: 'Paid', value: false }));
      expect(state.pricingOptions.Paid).toBe(false);
      expect(state.pricingOptions.Free).toBe(true);
    });

    it('should handle all pricing option types', () => {
      const paidAction = updatePricingOption({ option: 'Paid', value: true });
      const freeAction = updatePricingOption({ option: 'Free', value: true });
      const viewOnlyAction = updatePricingOption({ option: 'ViewOnly', value: true });

      let state = filterReducer(initialState, paidAction);
      expect(state.pricingOptions.Paid).toBe(true);

      state = filterReducer(state, freeAction);
      expect(state.pricingOptions.Free).toBe(true);

      state = filterReducer(state, viewOnlyAction);
      expect(state.pricingOptions.ViewOnly).toBe(true);
    });
  });

  describe('updateSearchKeyword', () => {
    it('should update search keyword with empty string', () => {
      const action = updateSearchKeyword('');
      const state = filterReducer(initialState, action);
      
      expect(state.searchKeyword).toBe('');
    });

    it('should update search keyword with non-empty string', () => {
      const action = updateSearchKeyword('test keyword');
      const state = filterReducer(initialState, action);
      
      expect(state.searchKeyword).toBe('test keyword');
    });

    it('should update search keyword multiple times', () => {
      let state = initialState;
      
      state = filterReducer(state, updateSearchKeyword('first'));
      expect(state.searchKeyword).toBe('first');

      state = filterReducer(state, updateSearchKeyword('second'));
      expect(state.searchKeyword).toBe('second');

      state = filterReducer(state, updateSearchKeyword(''));
      expect(state.searchKeyword).toBe('');
    });
  });

  describe('updateSortBy', () => {
    it('should update sortBy to name', () => {
      const action = updateSortBy('name');
      const state = filterReducer(initialState, action);
      
      expect(state.sortBy).toBe('name');
    });

    it('should update sortBy to price_high', () => {
      const action = updateSortBy('price_high');
      const state = filterReducer(initialState, action);
      
      expect(state.sortBy).toBe('price_high');
    });

    it('should update sortBy to price_low', () => {
      const action = updateSortBy('price_low');
      const state = filterReducer(initialState, action);
      
      expect(state.sortBy).toBe('price_low');
    });

    it('should change sortBy multiple times', () => {
      let state = initialState;
      
      state = filterReducer(state, updateSortBy('price_high'));
      expect(state.sortBy).toBe('price_high');

      state = filterReducer(state, updateSortBy('price_low'));
      expect(state.sortBy).toBe('price_low');

      state = filterReducer(state, updateSortBy('name'));
      expect(state.sortBy).toBe('name');
    });
  });

  describe('updatePriceRange', () => {
    it('should update price range with new values', () => {
      const action = updatePriceRange([10, 100]);
      const state = filterReducer(initialState, action);
      
      expect(state.priceRange).toEqual([10, 100]);
    });

    it('should update price range multiple times', () => {
      let state = initialState;
      
      state = filterReducer(state, updatePriceRange([5, 50]));
      expect(state.priceRange).toEqual([5, 50]);

      state = filterReducer(state, updatePriceRange([0, 200]));
      expect(state.priceRange).toEqual([0, 200]);

      state = filterReducer(state, updatePriceRange([999, 9999]));
      expect(state.priceRange).toEqual([999, 9999]);
    });

    it('should handle minimum and maximum values', () => {
      const minAction = updatePriceRange([0, 0]);
      const maxAction = updatePriceRange([9999, 9999]);

      const state1 = filterReducer(initialState, minAction);
      expect(state1.priceRange).toEqual([0, 0]);

      const state2 = filterReducer(initialState, maxAction);
      expect(state2.priceRange).toEqual([9999, 9999]);
    });
  });

  describe('updateMultipleFilters', () => {
    it('should update multiple filters at once', () => {
      const newFilters = {
        searchKeyword: 'multiple test',
        sortBy: 'price_high' as const,
        priceRange: [50, 200] as [number, number],
      };

      const action = updateMultipleFilters(newFilters);
      const state = filterReducer(initialState, action);
      
      expect(state.searchKeyword).toBe('multiple test');
      expect(state.sortBy).toBe('price_high');
      expect(state.priceRange).toEqual([50, 200]);
      expect(state.pricingOptions).toEqual(initialState.pricingOptions);
    });

    it('should update pricing options with multiple filters', () => {
      const newFilters = {
        pricingOptions: {
          Paid: true,
          Free: false,
          ViewOnly: true,
        },
        searchKeyword: 'test',
      };

      const action = updateMultipleFilters(newFilters);
      const state = filterReducer(initialState, action);
      
      expect(state.pricingOptions.Paid).toBe(true);
      expect(state.pricingOptions.Free).toBe(false);
      expect(state.pricingOptions.ViewOnly).toBe(true);
      expect(state.searchKeyword).toBe('test');
    });

    it('should handle partial updates', () => {
      const action = updateMultipleFilters({ searchKeyword: 'partial' });
      const state = filterReducer(initialState, action);
      
      expect(state.searchKeyword).toBe('partial');
      expect(state.sortBy).toBe(initialState.sortBy);
      expect(state.priceRange).toEqual(initialState.priceRange);
      expect(state.pricingOptions).toEqual(initialState.pricingOptions);
    });

    it('should handle empty object update', () => {
      const action = updateMultipleFilters({});
      const state = filterReducer(initialState, action);
      
      expect(state).toEqual(initialState);
    });
  });

  describe('resetFilters', () => {
    it('should reset pricing options to initial state', () => {
      let state = filterReducer(initialState, updatePricingOption({ option: 'Paid', value: true }));
      state = filterReducer(state, updateSearchKeyword('test'));
      state = filterReducer(state, updateSortBy('price_high'));
      state = filterReducer(state, updatePriceRange([100, 200]));

      const action = resetFilters();
      const resetState = filterReducer(state, action);

      expect(resetState.pricingOptions).toEqual(initialState.pricingOptions);
      expect(resetState.searchKeyword).toBe('test'); 
      expect(resetState.sortBy).toBe('price_high'); 
      expect(resetState.priceRange).toEqual([0, 999]); 
    });

    it('should reset from various states', () => {
      let state = initialState;
      state = filterReducer(state, updatePricingOption({ option: 'Paid', value: true }));
      state = filterReducer(state, updatePricingOption({ option: 'Free', value: true }));
      state = filterReducer(state, updatePricingOption({ option: 'ViewOnly', value: true }));

      const action = resetFilters();
      const resetState = filterReducer(state, action);

      expect(resetState.pricingOptions).toEqual(initialState.pricingOptions);
    });
  });
});