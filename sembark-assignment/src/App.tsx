import React, { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import { theme } from "./theme";

class App extends Component {
  render() {
    return (
      <BrowserRouter
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <div className="app-shell" style={{ color: theme.colors.text }}>
          <Header />
          <main className="app-main" style={{ maxWidth: theme.maxWidth }}>
            <Routes>
              <Route element={<HomePage />} path="/" />
              <Route element={<ProductDetailPage />} path="/product/:id" />
              <Route element={<ProductDetailPage />} path="/product/:id/details" />
              <Route element={<CartPage />} path="/cart" />
              <Route element={<NotFoundPage />} path="*" />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
