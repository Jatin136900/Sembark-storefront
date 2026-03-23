import { makeAutoObservable } from "mobx";
import { CartItem, Product } from "../types";

const STORAGE_KEY = "sembark-storefront-cart";

function canUseStorage(): boolean {
  return (
    typeof window !== "undefined" && typeof window.localStorage !== "undefined"
  );
}

function readStoredCart(): CartItem[] {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawCart = window.localStorage.getItem(STORAGE_KEY);

    if (!rawCart) {
      return [];
    }

    const parsedCart = JSON.parse(rawCart);

    if (!Array.isArray(parsedCart)) {
      return [];
    }

    return parsedCart
      .filter(
        (item) =>
          item &&
          typeof item.productId === "number" &&
          typeof item.title === "string" &&
          typeof item.price === "number" &&
          typeof item.image === "string" &&
          typeof item.category === "string" &&
          typeof item.quantity === "number"
      )
      .map((item) => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        image: item.image,
        category: item.category,
        quantity: Math.max(1, item.quantity),
      }));
  } catch {
    return [];
  }
}

export default class CartStore {
  items: CartItem[] = readStoredCart();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  addProduct(product: Product): void {
    const existingItem = this.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        productId: product.id,
        title: product.title,
        price: Number(product.price),
        image: product.image,
        category: product.category,
        quantity: 1,
      });
    }

    this.persist();
  }

  removeProduct(productId: number): void {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.persist();
  }

  getItemQuantity(productId: number): number {
    return this.items.find((item) => item.productId === productId)?.quantity ?? 0;
  }

  get totalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get uniqueItemsCount(): number {
    return this.items.length;
  }

  get totalPrice(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  get isEmpty(): boolean {
    return this.items.length === 0;
  }

  private persist(): void {
    if (!canUseStorage()) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }
}
