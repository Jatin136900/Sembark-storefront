import { HomeQueryState, ProductSortOption } from "../types";

const VALID_SORT_OPTIONS: ProductSortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "title-asc",
  "rating-desc",
];

export const DEFAULT_HOME_QUERY_STATE: HomeQueryState = {
  selectedCategories: [],
  sortBy: "featured",
};

function sanitizeCategories(categories: string[]): string[] {
  return Array.from(new Set(categories.filter(Boolean))).sort((left, right) =>
    left.localeCompare(right)
  );
}

function isSortOption(value: string | null): value is ProductSortOption {
  return Boolean(value && VALID_SORT_OPTIONS.includes(value as ProductSortOption));
}

export function parseHomeQuery(search: string): HomeQueryState {
  const params = new URLSearchParams(search);
  const selectedCategories = sanitizeCategories(params.getAll("category"));
  const sort = params.get("sort");

  return {
    selectedCategories,
    sortBy: isSortOption(sort) ? sort : DEFAULT_HOME_QUERY_STATE.sortBy,
  };
}

export function buildHomeQuery(state: HomeQueryState): string {
  const params = new URLSearchParams();
  sanitizeCategories(state.selectedCategories).forEach((category) => {
    params.append("category", category);
  });

  if (state.sortBy !== DEFAULT_HOME_QUERY_STATE.sortBy) {
    params.set("sort", state.sortBy);
  }

  return params.toString();
}

export function homeQueryStateEquals(
  left: HomeQueryState,
  right: HomeQueryState
): boolean {
  if (left.sortBy !== right.sortBy) {
    return false;
  }

  if (left.selectedCategories.length !== right.selectedCategories.length) {
    return false;
  }

  return left.selectedCategories.every(
    (category, index) => category === right.selectedCategories[index]
  );
}
