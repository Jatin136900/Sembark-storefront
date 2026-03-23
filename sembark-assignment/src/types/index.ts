export interface ProductRating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: ProductRating;
}

export interface CartItem {
  productId: number;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
}

export type ProductSortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "title-asc"
  | "rating-desc";

export interface HomeQueryState {
  selectedCategories: string[];
  sortBy: ProductSortOption;
}

export interface ProductFetchOptions extends HomeQueryState {}

export interface SortOptionDefinition {
  value: ProductSortOption;
  label: string;
  description: string;
}
