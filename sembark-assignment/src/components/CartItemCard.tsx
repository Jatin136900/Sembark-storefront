import React, { Component } from "react";
import { CartItem } from "../types";
import { theme } from "../theme";
import { formatCategoryLabel, formatCurrency } from "../utils/format";

interface CartItemCardProps {
  isRemoving: boolean;
  item: CartItem;
  onRemove: (productId: number) => void;
}

class CartItemCard extends Component<CartItemCardProps> {
  render() {
    const { isRemoving, item, onRemove } = this.props;
    const subtotal = item.price * item.quantity;

    return (
      <article
        className="cart-item-card surface-card"
        style={{
          animation: isRemoving ? "none" : "floatIn 280ms ease",
          opacity: isRemoving ? 0 : 1,
          transform: isRemoving ? "translateX(18px)" : "translateX(0)",
          transition: `opacity ${theme.transitions.fast}, transform ${theme.transitions.fast}`,
        }}
      >
        <div className="cart-item-card__media">
          <img
            alt={item.title}
            src={item.image}
            style={{
              height: "100%",
              objectFit: "contain",
              width: "100%",
            }}
          />
        </div>

        <div className="cart-item-card__content">
          <div className="cart-item-card__header">
            <div style={{ display: "grid", gap: 6 }}>
              <span
                style={{
                  color: theme.colors.textMuted,
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 0.3,
                  textTransform: "uppercase",
                }}
              >
                {formatCategoryLabel(item.category)}
              </span>
              <h2
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: "1.1rem",
                  margin: 0,
                }}
              >
                {item.title}
              </h2>
            </div>

            <strong style={{ fontSize: "1.1rem" }}>
              {formatCurrency(subtotal)}
            </strong>
          </div>

          <div className="cart-item-card__footer">
            <div style={{ display: "flex", flexWrap: "wrap", gap: theme.spacing.sm }}>
              <span
                className="pill-chip"
                style={{
                  background: theme.colors.surfaceMuted,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {formatCurrency(item.price)} each
              </span>
              <span
                className="pill-chip"
                style={{
                  background: theme.colors.accentSoft,
                  color: theme.colors.accent,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Qty {item.quantity}
              </span>
            </div>

            <button
              aria-label={`Remove ${item.title} from cart`}
              className="secondary-button"
              onClick={() => onRemove(item.productId)}
              style={{
                border: `1px solid ${theme.colors.danger}`,
                color: theme.colors.danger,
              }}
              type="button"
            >
              Remove item
            </button>
          </div>
        </div>
      </article>
    );
  }
}

export default CartItemCard;
