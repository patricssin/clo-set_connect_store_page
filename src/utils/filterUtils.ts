import { ContentItem, FilterState } from '../types';

export const applyFilters = (items: ContentItem[], filters: FilterState): ContentItem[] => {
  let filteredItems = [...items];
  
  // pricing option filter
  const { Paid, Free, ViewOnly } = filters.pricingOptions;
  const hasPricingFilter = Paid || Free || ViewOnly;
  
  if (hasPricingFilter) {
    filteredItems = filteredItems.filter(item => {
      if (Paid && item.pricingOption === 0) return true;
      if (Free && item.pricingOption === 1) return true;
      if (ViewOnly && item.pricingOption === 2) return true;
      return false;
    });
  }
  
  // TODO price range filter (only applies if Paid is selected)
  // if (Paid) {
  //   const [minPrice, maxPrice] = filters.priceRange;
  //   filteredItems = filteredItems.filter(item => {
  //     if (item.pricingOption !== 0) return true;
  //     return item.price !== undefined && item.price >= minPrice && item.price <= maxPrice;
  //   });
  // }
  
  // search keyword filter
  if (filters.searchKeyword) {
    const keyword = filters.searchKeyword.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.creator.toLowerCase().includes(keyword) || 
      item.title.toLowerCase().includes(keyword)
    );
  }
  
  // sort
  return sortItems(filteredItems, filters.sortBy);
};

const sortItems = (items: ContentItem[], sortBy: string): ContentItem[] => {
  const sortedItems = [...items];
  
  switch (sortBy) {
    case 'price_high':
      return sortedItems.sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceB - priceA;
      });
      
    case 'price_low':
      return sortedItems.sort((a, b) => {
        const priceA = a.price || 0;
        const priceB = b.price || 0;
        return priceA - priceB;
      });
      
    case 'name':
    default:
      return sortedItems.sort((a, b) => a.id.localeCompare(b.id));
  }
};