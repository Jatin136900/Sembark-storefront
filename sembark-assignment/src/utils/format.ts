import { ProductSortOption, SortOptionDefinition } from "../types";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

export const SORT_OPTIONS: SortOptionDefinition[] = [
  {
    value: "featured",
    label: "Featured",
    description: "Keep the API order from the selected category feeds.",
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
    description: "Surface the most affordable products first.",
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    description: "Show premium products first.",
  },
  {
    value: "title-asc",
    label: "Name: A to Z",
    description: "Sort alphabetically by product title.",
  },
  {
    value: "rating-desc",
    label: "Top Rated",
    description: "Prioritize products with the strongest ratings.",
  },
];

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatCategoryLabel(category: string): string {
  return category
    .split(" ")
    .filter(Boolean)
    .map((token) => `${token.charAt(0).toUpperCase()}${token.slice(1)}`)
    .join(" ");
}

export function formatSortLabel(value: ProductSortOption): string {
  return (
    SORT_OPTIONS.find((option) => option.value === value)?.label ?? "Featured"
  );
}
