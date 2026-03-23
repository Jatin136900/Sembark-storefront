import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Product } from "../types";
import { theme } from "../theme";
import { formatCategoryLabel, formatCurrency } from "../utils/format";

interface ProductCardProps {
  product: Product;
}

class ProductCard extends Component<ProductCardProps> {
  render() {
    const { product } = this.props;

    return (
      <article
        className="product-card surface-card"
        style={{
          height: "100%",
        }}
      >
        <Link
          aria-label={`Open ${product.title} details`}
          className="product-card__link"
          to={`/product/${product.id}/details`}
        >
          <div className="product-card__media">
            <img
              alt={product.title}
              src={product.image}
              style={{
                height: "100%",
                maxHeight: 220,
                objectFit: "contain",
                width: "100%",
              }}
            />
          </div>

          <div className="product-card__copy">
            <div className="product-card__meta">
              <span
                className="pill-chip"
                style={{
                  background: theme.colors.accentSoft,
                  color: theme.colors.accent,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {formatCategoryLabel(product.category)}
              </span>
              <span
                className="pill-chip"
                style={{
                  background: theme.colors.surfaceMuted,
                  color: theme.colors.textMuted,
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                {product.rating.rate.toFixed(1)} rating
              </span>
            </div>

            <h2
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: "1.22rem",
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              {product.title}
            </h2>

            <p
              style={{
                color: theme.colors.textMuted,
                display: "-webkit-box",
                lineHeight: 1.6,
                margin: 0,
                minHeight: 52,
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 2,
              }}
            >
              {product.description}
            </p>

            <div className="product-card__footer">
              <div style={{ display: "grid", gap: 4 }}>
                <span
                  style={{
                    color: theme.colors.textMuted,
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 0.24,
                    textTransform: "uppercase",
                  }}
                >
                  Price
                </span>
                <strong style={{ fontSize: "1.28rem" }}>
                  {formatCurrency(product.price)}
                </strong>
              </div>
              <span className="card-cta">View details</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }
}

export default ProductCard;
