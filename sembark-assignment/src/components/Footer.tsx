import React, { Component } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import CartContext, { getCartStore } from "../context/CartContext";
import { theme } from "../theme";
import { formatCurrency } from "../utils/format";

interface FooterState {
  isHighlighted: boolean;
}

class Footer extends Component<unknown, FooterState> {
  static contextType = CartContext;

  state: FooterState = {
    isHighlighted: false,
  };

  private previousTotalItems = 0;
  private highlightTimeoutId?: number;

  componentDidMount(): void {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );
    this.previousTotalItems = cart.totalItems;
  }

  componentDidUpdate(): void {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );

    if (cart.totalItems !== this.previousTotalItems) {
      this.previousTotalItems = cart.totalItems;

      if (this.highlightTimeoutId) {
        window.clearTimeout(this.highlightTimeoutId);
      }

      this.setState({ isHighlighted: true });
      this.highlightTimeoutId = window.setTimeout(() => {
        this.setState({ isHighlighted: false });
      }, 320);
    }
  }

  componentWillUnmount(): void {
    if (this.highlightTimeoutId) {
      window.clearTimeout(this.highlightTimeoutId);
    }
  }

  render() {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );

    return (
      <footer className="site-footer">
        <div
          aria-live="polite"
          className="site-footer__inner"
          style={{
            animation: this.state.isHighlighted ? "pulseGlow 320ms ease" : "none",
            color: theme.colors.footerText,
            maxWidth: theme.maxWidth,
          }}
        >
          <div className="site-footer__stats">
            <strong>Items in cart: {cart.totalItems}</strong>
            <span>Unique products: {cart.uniqueItemsCount}</span>
            <span>Total: {formatCurrency(cart.totalPrice)}</span>
            <span style={{ color: "rgba(255, 248, 237, 0.74)" }}>
              Stored locally between refreshes
            </span>
          </div>

          <Link
            aria-label="View cart"
            className="primary-button"
            to="/cart"
          >
            View Cart
          </Link>
        </div>
      </footer>
    );
  }
}

export default observer(Footer);
