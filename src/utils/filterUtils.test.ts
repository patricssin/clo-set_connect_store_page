import { ContentItem, FilterState } from '../types';
import { applyFilters, getFilterFromParams, princinOptMapping } from './filterUtils';

describe('Filter Functions', () => {
  const mockItems: ContentItem[] = [
    { id: '1', title: 'Paid Course', creator: 'John', pricingOption: 0, price: 50, imagePath: '' },
    { id: '2', title: 'Free Tutorial', creator: 'Jane', pricingOption: 1, price: 0, imagePath: '' },
    { id: '3', title: 'View Only', creator: 'Bob', pricingOption: 2, price: 99, imagePath: '' },
    { id: '4', title: 'Another Paid', creator: 'John', pricingOption: 0, price: 30, imagePath: '' },
  ];

  describe('applyFilters', () => {
    it('returns all items when no filters applied', () => {
      const filters: FilterState = {
        searchKeyword: '',
        pricingOptions: { Paid: false, Free: false, ViewOnly: false },
        priceRange: [0, 100],
        sortBy: 'name'
      };

      const result = applyFilters(mockItems, filters);
      expect(result.length).toBe(4);
    });

    it('filters by Paid pricing option', () => {
      const filters: FilterState = {
        searchKeyword: '',
        pricingOptions: { Paid: true, Free: false, ViewOnly: false },
        priceRange: [0, 100],
        sortBy: 'name'
      };

      const result = applyFilters(mockItems, filters);
      expect(result.length).toBe(2);
      expect(result.every(item => item.pricingOption === 0)).toBe(true);
    });

    it('filters by search keyword in title', () => {
      const filters: FilterState = {
        searchKeyword: 'Paid',
        pricingOptions: { Paid: false, Free: false, ViewOnly: false },
        priceRange: [0, 100],
        sortBy: 'name'
      };

      const result = applyFilters(mockItems, filters);
      expect(result.length).toBe(2);
      expect(result.every(item => item.title.includes('Paid'))).toBe(true);
    });

    it('filters by search keyword in creator', () => {
      const filters: FilterState = {
        searchKeyword: 'John',
        pricingOptions: { Paid: false, Free: false, ViewOnly: false },
        priceRange: [0, 100],
        sortBy: 'name'
      };

      const result = applyFilters(mockItems, filters);
      expect(result.length).toBe(2);
      expect(result.every(item => item.creator === 'John')).toBe(true);
    });

    it('combines pricing and search filters', () => {
      const filters: FilterState = {
        searchKeyword: 'John',
        pricingOptions: { Paid: true, Free: false, ViewOnly: false },
        priceRange: [0, 100],
        sortBy: 'name'
      };

      const result = applyFilters(mockItems, filters);
      expect(result.length).toBe(2);
    });

    it('sort by name', () => {
      const filters: FilterState = {
        searchKeyword: '',
        pricingOptions: { Paid: false, Free: false, ViewOnly: false },
        priceRange: [0, 999],
        sortBy: 'name'
      };
      
      const result = applyFilters(mockItems, filters);
      expect(result.map(item => item.creator)).toEqual(['Bob', 'Jane', 'John', 'John']);
    });
  
    it('sort from high to low', () => {
      const filters: FilterState = {
        searchKeyword: '',
        pricingOptions: { Paid: true, Free: false, ViewOnly: false },
        priceRange: [0, 49],
        sortBy: 'price_high'
      };
      
      const result = applyFilters(mockItems, filters);
      expect(result.map(item => item.price)).toEqual([30]);
    });
  
    it('sort low to high', () => {
      const filters: FilterState = {
        searchKeyword: '',
        pricingOptions: { Paid: true, Free: false, ViewOnly: false },
        priceRange: [0, 150],
        sortBy: 'price_low'
      };
      
      const result = applyFilters(mockItems, filters);
      expect(result.map(item => item.price)).toEqual([30, 50]);
    });
  });

  describe('getFilterFromParams', () => {
    it('returns default state for empty params', () => {
      const result = getFilterFromParams({});
      
      expect(result).toEqual({
        searchKeyword: '',
        pricingOptions: { Paid: false, Free: false, ViewOnly: false },
        priceRange: [0, 999],
        sortBy: 'name'
      });
    });

    it('parses search keyword from params', () => {
      const result = getFilterFromParams({ searchKeyword: 'test' });
      expect(result.searchKeyword).toBe('test');
    });

    it('parses single pricing option', () => {
      const result = getFilterFromParams({ pricingOptions: '0' });
      expect(result.pricingOptions.Paid).toBe(true);
      expect(result.pricingOptions.Free).toBe(false);
    });

    it('parses multiple pricing options', () => {
      const result = getFilterFromParams({ pricingOptions: '0+1' });
      expect(result.pricingOptions.Paid).toBe(true);
      expect(result.pricingOptions.Free).toBe(true);
      expect(result.pricingOptions.ViewOnly).toBe(false);
    });

    describe('sortBy parsing', () => {
      it('should parse valid sortBy value "name"', () => {
        const result = getFilterFromParams({ sortBy: 'name' });
        expect(result.sortBy).toBe('name');
      });
  
      it('should parse valid sortBy value "price_high"', () => {
        const result = getFilterFromParams({ sortBy: 'price_high' });
        expect(result.sortBy).toBe('price_high');
      });
  
      it('should parse valid sortBy value "price_low"', () => {
        const result = getFilterFromParams({ sortBy: 'price_low' });
        expect(result.sortBy).toBe('price_low');
      });
  
      it('should handle URL encoded sortBy value', () => {
        const result = getFilterFromParams({ sortBy: encodeURIComponent('price_high') });
        expect(result.sortBy).toBe('price_high');
      });
  
      it('should ignore invalid sortBy value', () => {
        const result = getFilterFromParams({ sortBy: 'invalid' });
        expect(result.sortBy).toBe('name');
      });
    });
  });

  describe('princinOptMapping', () => {
    it('has correct mapping values', () => {
      expect(princinOptMapping).toEqual(['Paid', 'Free', 'ViewOnly']);
    });
  });
});