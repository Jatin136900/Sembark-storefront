import React from "react";
import CartStore from "../store/CartStore";

const CartContext = React.createContext<CartStore | null>(null);

export function getCartStore(store: CartStore | null): CartStore {
  if (!store) {
    throw new Error("CartContext provider is missing.");
  }

  return store;
}

export default CartContext;
