export interface ContentItem {
  id: string,
  creator: string,
  title: string,
  pricingOption: 0|1|2,
  imagePath: string,
  price: number
}

export enum PricingOption {
  PAID = 0,
  FREE = 1,
  VIEW_ONLY = 2
}

export interface FilterState {
  pricingOptions: {
    Paid: boolean;
    Free: boolean;
    ViewOnly: boolean;
  };
  searchKeyword: string;
  sortBy: 'name' | 'price_high' | 'price_low';
  priceRange: [number, number];
}