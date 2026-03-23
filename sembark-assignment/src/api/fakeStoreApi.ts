import { Product, ProductFetchOptions, ProductSortOption } from "../types";

const API_BASE_URL = "https://fakestoreapi.com";

async function requestJson<T>(
  path: string,
  signal?: AbortSignal
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("The requested product could not be found.");
    }

    throw new Error("We could not load data from Fake Store API.");
  }

  return (await response.json()) as T;
}

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: Number(product.price),
    rating: product.rating ?? {
      rate: 0,
      count: 0,
    },
  };
}

function dedupeProducts(products: Product[]): Product[] {
  const productsById = new Map<number, Product>();

  products.forEach((product) => {
    productsById.set(product.id, normalizeProduct(product));
  });

  return Array.from(productsById.values());
}

function sortProducts(
  products: Product[],
  sortBy: ProductSortOption
): Product[] {
  const items = [...products];

  switch (sortBy) {
    case "price-asc":
      return items.sort((left, right) => left.price - right.price);
    case "price-desc":
      return items.sort((left, right) => right.price - left.price);
    case "title-asc":
      return items.sort((left, right) => left.title.localeCompare(right.title));
    case "rating-desc":
      return items.sort((left, right) => right.rating.rate - left.rating.rate);
    case "featured":
    default:
      return items;
  }
}

export async function fetchCategories(signal?: AbortSignal): Promise<string[]> {
  const categories = await requestJson<string[]>("/products/categories", signal);

  return Array.from(new Set(categories)).sort((left, right) =>
    left.localeCompare(right)
  );
}

export async function fetchProducts(
  options: ProductFetchOptions,
  signal?: AbortSignal
): Promise<Product[]> {
  let products: Product[];

  if (options.selectedCategories.length === 0) {
    products = await requestJson<Product[]>("/products", signal);
  } else {
    const responses = await Promise.all(
      options.selectedCategories.map((category) =>
        requestJson<Product[]>(
          `/products/category/${encodeURIComponent(category)}`,
          signal
        )
      )
    );

    products = responses.flat();
  }

  return sortProducts(dedupeProducts(products), options.sortBy);
}

export async function fetchProductById(
  productId: number,
  signal?: AbortSignal
): Promise<Product> {
  const product = await requestJson<Product>(`/products/${productId}`, signal);
  return normalizeProduct(product);
}
