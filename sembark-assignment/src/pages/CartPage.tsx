import React, { Component } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import CartItemCard from "../components/CartItemCard";
import StatusView from "../components/StatusView";
import CartContext, { getCartStore } from "../context/CartContext";
import { theme } from "../theme";
import { formatCurrency } from "../utils/format";

interface CartPageState {
  removingProductIds: number[];
}

class CartPage extends Component<unknown, CartPageState> {
  static contextType = CartContext;

  state: CartPageState = {
    removingProductIds: [],
  };

  private removalTimeoutIds = new Map<number, number>();

  componentWillUnmount(): void {
    this.removalTimeoutIds.forEach((timeoutId) => {
      window.clearTimeout(timeoutId);
    });
  }

  private handleRemove(productId: number): void {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );

    if (this.state.removingProductIds.includes(productId)) {
      return;
    }

    this.setState((currentState) => ({
      removingProductIds: [...currentState.removingProductIds, productId],
    }));

    const timeoutId = window.setTimeout(() => {
      cart.removeProduct(productId);
      this.removalTimeoutIds.delete(productId);
      this.setState((currentState) => ({
        removingProductIds: currentState.removingProductIds.filter(
          (currentProductId) => currentProductId !== productId
        ),
      }));
    }, 180);

    this.removalTimeoutIds.set(productId, timeoutId);
  }

  render() {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );

    if (cart.isEmpty) {
      return (
        <StatusView
          eyebrow="Cart"
          linkLabel="Browse products"
          linkTo="/"
          message="Add a few products from the detail page and they will appear here with their totals."
          title="Your cart is empty"
        />
      );
    }

    return (
      <div className="page-stack">
        <section className="hero-panel">
          <div className="hero-grid">
            <div style={{ display: "grid", gap: theme.spacing.md }}>
              <span className="hero-eyebrow">Cart overview</span>
              <h1
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: "clamp(2.3rem, 4vw, 3.5rem)",
                  lineHeight: 0.96,
                  margin: 0,
                }}
              >
                Your cart
              </h1>
              <p
                style={{
                  color: "rgba(255, 248, 237, 0.84)",
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: 620,
                }}
              >
                Review quantities, remove anything you no longer need, and keep
                track of the current total without losing the broader storefront
                context.
              </p>

              <div className="inline-chip-row">
                <span
                  className="pill-chip"
                  style={{
                    background: "rgba(255, 255, 255, 0.16)",
                    color: "#fffaf2",
                    fontWeight: 700,
                  }}
                >
                  {cart.totalItems} total items
                </span>
                <span
                  className="pill-chip"
                  style={{
                    background: "rgba(255, 255, 255, 0.16)",
                    color: "#fffaf2",
                    fontWeight: 700,
                  }}
                >
                  {cart.uniqueItemsCount} unique products
                </span>
              </div>

              <div>
                <Link className="secondary-button" to="/">
                  Continue shopping
                </Link>
              </div>
            </div>

            <div className="hero-stat-grid">
              <div className="hero-stat">
                <span className="hero-eyebrow" style={{ color: "rgba(255, 248, 237, 0.72)" }}>
                  Order total
                </span>
                <strong style={{ fontSize: "1.9rem", lineHeight: 1 }}>
                  {formatCurrency(cart.totalPrice)}
                </strong>
                <span style={{ color: "rgba(255, 248, 237, 0.8)", lineHeight: 1.6 }}>
                  Live sum across all line items.
                </span>
              </div>
              <div className="hero-stat">
                <span className="hero-eyebrow" style={{ color: "rgba(255, 248, 237, 0.72)" }}>
                  Cart memory
                </span>
                <strong style={{ fontSize: "1.4rem", lineHeight: 1.1 }}>
                  Local storage
                </strong>
                <span style={{ color: "rgba(255, 248, 237, 0.8)", lineHeight: 1.6 }}>
                  Refresh-safe until you remove items.
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="cart-layout">
          <section className="cart-list">
            {cart.items.map((item) => (
              <CartItemCard
                isRemoving={this.state.removingProductIds.includes(item.productId)}
                item={item}
                key={item.productId}
                onRemove={this.handleRemove.bind(this)}
              />
            ))}
          </section>

          <aside className="cart-summary surface-card">
            <div style={{ display: "grid", gap: theme.spacing.sm }}>
              <h2
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: "1.35rem",
                  margin: 0,
                }}
              >
                Cart totals
              </h2>
              <p
                style={{
                  color: theme.colors.textMuted,
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Review your line items, remove anything you no longer need, and
                keep an eye on the totals from both the cart page and footer.
              </p>
            </div>

            <dl
              style={{
                display: "grid",
                gap: theme.spacing.md,
                margin: 0,
              }}
            >
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <dt>Total items</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>{cart.totalItems}</dd>
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <dt>Unique products</dt>
                <dd style={{ margin: 0, fontWeight: 700 }}>
                  {cart.uniqueItemsCount}
                </dd>
              </div>
              <div
                style={{
                  alignItems: "center",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <dt>Order total</dt>
                <dd style={{ margin: 0, fontWeight: 800 }}>
                  {formatCurrency(cart.totalPrice)}
                </dd>
              </div>
            </dl>

            <div
              style={{
                background: theme.colors.surfaceMuted,
                borderRadius: theme.radii.md,
                lineHeight: 1.7,
                padding: theme.spacing.md,
              }}
            >
              Cart data is stored in local storage, so a refresh keeps your
              selections intact until you remove them.
            </div>
          </aside>
        </div>
      </div>
    );
  }
}

export default observer(CartPage);
