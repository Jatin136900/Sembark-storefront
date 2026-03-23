import React, { Component } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import { fetchProductById } from "../api/fakeStoreApi";
import StatusView from "../components/StatusView";
import CartContext, { getCartStore } from "../context/CartContext";
import { theme } from "../theme";
import { Product } from "../types";
import { formatCategoryLabel, formatCurrency } from "../utils/format";
import { WithRouterProps, withRouter } from "../utils/withRouter";

interface ProductDetailPageState {
  errorMessage: string | null;
  isAddingFeedback: boolean;
  isLoading: boolean;
  product: Product | null;
}

class ProductDetailPage extends Component<
  WithRouterProps,
  ProductDetailPageState
> {
  static contextType = CartContext;

  state: ProductDetailPageState = {
    errorMessage: null,
    isAddingFeedback: false,
    isLoading: true,
    product: null,
  };

  private loadAbortController?: AbortController;
  private addFeedbackTimeoutId?: number;

  componentDidMount(): void {
    this.loadProduct();
  }

  componentDidUpdate(prevProps: Readonly<WithRouterProps>): void {
    if (prevProps.router.params.id !== this.props.router.params.id) {
      this.loadProduct();
    }
  }

  componentWillUnmount(): void {
    this.loadAbortController?.abort();

    if (this.addFeedbackTimeoutId) {
      window.clearTimeout(this.addFeedbackTimeoutId);
    }
  }

  private getProductId(): number | null {
    const rawProductId = this.props.router.params.id;

    if (!rawProductId) {
      return null;
    }

    const parsedProductId = Number(rawProductId);

    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      return null;
    }

    return parsedProductId;
  }

  private async loadProduct(): Promise<void> {
    const productId = this.getProductId();

    if (!productId) {
      this.setState({
        errorMessage: "This product link is invalid.",
        isLoading: false,
        product: null,
      });
      return;
    }

    this.loadAbortController?.abort();
    this.loadAbortController = new AbortController();

    this.setState({
      errorMessage: null,
      isLoading: true,
      product: null,
    });

    try {
      const product = await fetchProductById(
        productId,
        this.loadAbortController.signal
      );

      this.setState({
        errorMessage: null,
        isLoading: false,
        product,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      this.setState({
        errorMessage:
          error instanceof Error
            ? error.message
            : "We could not load that product right now.",
        isLoading: false,
        product: null,
      });
    }
  }

  private handleAddToCart(): void {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );

    if (!this.state.product) {
      return;
    }

    cart.addProduct(this.state.product);

    if (this.addFeedbackTimeoutId) {
      window.clearTimeout(this.addFeedbackTimeoutId);
    }

    this.setState({ isAddingFeedback: true });
    this.addFeedbackTimeoutId = window.setTimeout(() => {
      this.setState({ isAddingFeedback: false });
    }, 320);
  }

  render() {
    const cart = getCartStore(
      this.context as React.ContextType<typeof CartContext>
    );
    const productQuantity =
      this.state.product ? cart.getItemQuantity(this.state.product.id) : 0;

    if (this.state.isLoading) {
      return (
        <StatusView
          eyebrow="Loading"
          message="Fetching product details directly from the API for this route."
          title="Preparing product details"
        />
      );
    }

    if (this.state.errorMessage || !this.state.product) {
      return (
        <StatusView
          actionLabel="Try again"
          eyebrow="Product detail"
          linkLabel="Back to home"
          linkTo="/"
          message={
            this.state.errorMessage ??
            "We were unable to load the requested product."
          }
          onAction={this.loadProduct.bind(this)}
          title="This product is unavailable right now."
          tone="error"
        />
      );
    }

    const { product } = this.state;

    return (
      <div className="page-stack">
        <div className="detail-links">
          <Link className="secondary-button" to="/">
            Back to Home
          </Link>

          <Link className="primary-button" to="/cart">
            Go to Cart ({cart.totalItems})
          </Link>
        </div>

        <section className="detail-layout">
          <div className="detail-media surface-card surface-card--raised">
            <img
              alt={product.title}
              src={product.image}
              style={{
                maxHeight: 360,
                objectFit: "contain",
                width: "min(100%, 420px)",
              }}
            />
          </div>

          <article className="detail-summary surface-card">
            <div style={{ display: "grid", gap: theme.spacing.sm }}>
              <div className="inline-chip-row">
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
                  {product.rating.count} reviews
                </span>
              </div>

              <h1
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  lineHeight: 1.05,
                  margin: 0,
                }}
              >
                {product.title}
              </h1>

              <p
                style={{
                  color: theme.colors.textMuted,
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {product.description}
              </p>
            </div>

            <div className="price-panel">
              <div style={{ display: "grid", gap: 6 }}>
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
                <strong
                  style={{
                    fontFamily: theme.fonts.heading,
                    fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
                    lineHeight: 1,
                  }}
                >
                  {formatCurrency(product.price)}
                </strong>
              </div>
              <span style={{ color: theme.colors.textMuted, lineHeight: 1.7, maxWidth: 320 }}>
                Clean product detail, live cart feedback, and a direct route back
                into browsing.
              </span>
            </div>

            <div className="detail-metric-grid">
              <div className="metric-card">
                <span style={{ color: theme.colors.textMuted, fontSize: 13 }}>
                  Rating
                </span>
                <strong>{product.rating.rate.toFixed(1)}</strong>
                <span style={{ color: theme.colors.textMuted }}>
                  Average customer score
                </span>
              </div>
              <div className="metric-card">
                <span style={{ color: theme.colors.textMuted, fontSize: 13 }}>
                  Reviews
                </span>
                <strong>{product.rating.count}</strong>
                <span style={{ color: theme.colors.textMuted }}>
                  Public review count
                </span>
              </div>
              <div className="metric-card">
                <span style={{ color: theme.colors.textMuted, fontSize: 13 }}>
                  In cart
                </span>
                <strong>{productQuantity}</strong>
                <span style={{ color: theme.colors.textMuted }}>
                  Items currently saved
                </span>
              </div>
            </div>

            <div className="detail-actions">
              <button
                className="primary-button"
                onClick={this.handleAddToCart.bind(this)}
                style={{
                  animation: this.state.isAddingFeedback
                    ? "pulseGlow 320ms ease"
                    : "none",
                }}
                type="button"
              >
                {productQuantity > 0 ? "Add another to cart" : "Add to Cart"}
              </button>

              <span
                aria-live="polite"
                style={{
                  color: this.state.isAddingFeedback
                    ? theme.colors.success
                    : theme.colors.textMuted,
                  fontWeight: 700,
                }}
              >
                {this.state.isAddingFeedback
                  ? "Added to cart."
                  : "Ready to add this product to your cart."}
              </span>
            </div>
          </article>
        </section>
      </div>
    );
  }
}

export default withRouter(observer(ProductDetailPage));
