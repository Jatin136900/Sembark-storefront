import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CartContext from "./context/CartContext";
import "./index.css";
import CartStore from "./store/CartStore";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The root element could not be found.");
}

const cartStore = new CartStore();
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <CartContext.Provider value={cartStore}>
      <App />
    </CartContext.Provider>
  </React.StrictMode>
);
