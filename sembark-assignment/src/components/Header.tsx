import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";
import { observer } from "mobx-react";
import CartContext, { getCartStore } from "../context/CartContext";
import { theme } from "../theme";

class Header extends Component {
  static contextType = CartContext;

  private getLinkStyle(isActive: boolean): React.CSSProperties {
    return {
      alignItems: "center",
      background: isActive
        ? "linear-gradient(135deg, rgba(23, 58, 89, 0.98), rgba(15, 110, 140, 0.92))"
        : "rgba(255, 255, 255, 0.76)",
      border: `1px solid ${
        isActive ? "rgba(23, 58, 89, 0.2)" : theme.colors.line
      }`,
      borderRadius: theme.radii.pill,
      color: isActive ? "#ffffff" : theme.colors.text,
      display: "inline-flex",
      fontSize: 14,
      fontWeight: 700,
      gap: 8,
      padding: "11px 16px",
      boxShadow: isActive ? theme.shadows.soft : "none",
      textDecoration: "none",
      transition: theme.transitions.standard,
    };
  }

  render() {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );
    const cartLabel = `My Cart (${cart.totalItems})`;

    return (
      <header className="site-header">
        <div className="site-header__inner" style={{ maxWidth: theme.maxWidth }}>
          <Link aria-label="Go to the Sembark Storefront home page" className="site-brand" to="/">
            <span className="site-brand__eyebrow">Sembark tech assignment</span>
            <span className="site-brand__title">Sembark Storefront</span>
            <span className="site-brand__subtitle">
              Curated catalog browsing with cart sync that stays usable on every
              screen size.
            </span>
          </Link>

          <nav aria-label="Primary navigation" className="site-nav">
            <NavLink style={({ isActive }) => this.getLinkStyle(isActive)} to="/">
              Browse Products
            </NavLink>
            <NavLink
              aria-label={`Open cart with ${cart.totalItems} items`}
              style={({ isActive }) => this.getLinkStyle(isActive)}
              to="/cart"
            >
              {cartLabel}
            </NavLink>
          </nav>
        </div>
      </header>
    );
  }
}

export default observer(Header);
