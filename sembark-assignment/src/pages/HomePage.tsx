import React, { ChangeEvent, Component } from "react";
import { fetchCategories, fetchProducts } from "../api/fakeStoreApi";
import ProductCard from "../components/ProductCard";
import StatusView from "../components/StatusView";
import { theme } from "../theme";
import { HomeQueryState, Product, ProductSortOption } from "../types";
import {
  buildHomeQuery,
  DEFAULT_HOME_QUERY_STATE,
  homeQueryStateEquals,
  parseHomeQuery,
} from "../utils/query";
import {
  SORT_OPTIONS,
  formatCategoryLabel,
  formatSortLabel,
} from "../utils/format";
import { WithRouterProps, withRouter } from "../utils/withRouter";

interface HomePageState extends HomeQueryState {
  categories: string[];
  categoriesError: string | null;
  isLoadingCategories: boolean;
  isLoadingProducts: boolean;
  products: Product[];
  productsError: string | null;
}

class HomePage extends Component<WithRouterProps, HomePageState> {
  state: HomePageState = {
    ...parseHomeQuery(this.props.router.location.search),
    categories: [],
    categoriesError: null,
    isLoadingCategories: true,
    isLoadingProducts: true,
    products: [],
    productsError: null,
  };

  private categoriesAbortController?: AbortController;
  private productsAbortController?: AbortController;
  private latestProductsRequest = 0;

  componentDidMount(): void {
    this.loadCategories();
    this.loadProducts();
  }

  componentDidUpdate(prevProps: Readonly<WithRouterProps>): void {
    if (prevProps.router.location.search !== this.props.router.location.search) {
      const nextQueryState = parseHomeQuery(this.props.router.location.search);

      if (!homeQueryStateEquals(nextQueryState, this.getQueryState())) {
        this.setState(nextQueryState, this.loadProducts);
      }
    }
  }

  componentWillUnmount(): void {
    this.categoriesAbortController?.abort();
    this.productsAbortController?.abort();
  }

  private getQueryState(): HomeQueryState {
    return {
      selectedCategories: this.state.selectedCategories,
      sortBy: this.state.sortBy,
    };
  }

  private async loadCategories(): Promise<void> {
    this.categoriesAbortController?.abort();
    this.categoriesAbortController = new AbortController();

    this.setState({
      categoriesError: null,
      isLoadingCategories: true,
    });

    try {
      const categories = await fetchCategories(
        this.categoriesAbortController.signal
      );
      this.setState({
        categories,
        categoriesError: null,
        isLoadingCategories: false,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      this.setState({
        categoriesError:
          "We could not load category filters right now, but the product feed is still available.",
        isLoadingCategories: false,
      });
    }
  }

  private async loadProducts(): Promise<void> {
    this.productsAbortController?.abort();
    this.productsAbortController = new AbortController();
    const requestId = this.latestProductsRequest + 1;
    this.latestProductsRequest = requestId;

    this.setState({
      isLoadingProducts: true,
      productsError: null,
    });

    try {
      const products = await fetchProducts(
        this.getQueryState(),
        this.productsAbortController.signal
      );

      if (requestId !== this.latestProductsRequest) {
        return;
      }

      this.setState({
        isLoadingProducts: false,
        products,
        productsError: null,
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      if (requestId !== this.latestProductsRequest) {
        return;
      }

      this.setState({
        isLoadingProducts: false,
        products: [],
        productsError:
          "We could not refresh the product feed. Please retry the request.",
      });
    }
  }

  private updateQueryState(nextState: HomeQueryState): void {
    const normalizedState: HomeQueryState = {
      selectedCategories: [...nextState.selectedCategories].sort((left, right) =>
        left.localeCompare(right)
      ),
      sortBy: nextState.sortBy,
    };

    this.setState(normalizedState, () => {
      const nextSearch = buildHomeQuery(this.getQueryState());
      const currentSearch = this.props.router.location.search.replace(/^\?/, "");

      if (nextSearch !== currentSearch) {
        this.props.router.navigate({
          pathname: "/",
          search: nextSearch ? `?${nextSearch}` : "",
        });
      }

      this.loadProducts();
    });
  }

  private handleCategoryToggle(category: string): void {
    const nextSelectedCategories = this.state.selectedCategories.includes(category)
      ? this.state.selectedCategories.filter(
          (selectedCategory) => selectedCategory !== category
        )
      : [...this.state.selectedCategories, category];

    this.updateQueryState({
      selectedCategories: nextSelectedCategories,
      sortBy: this.state.sortBy,
    });
  }

  private handleSortChange(event: ChangeEvent<HTMLSelectElement>): void {
    this.updateQueryState({
      selectedCategories: this.state.selectedCategories,
      sortBy: event.target.value as ProductSortOption,
    });
  }

  private handleClearFilters(): void {
    this.updateQueryState(DEFAULT_HOME_QUERY_STATE);
  }

  private renderFilterPanel() {
    const hasSelections = this.state.selectedCategories.length > 0;
    const hasCustomSort =
      this.state.sortBy !== DEFAULT_HOME_QUERY_STATE.sortBy;

    return (
      <aside
        className="filter-panel surface-card sidebar-panel"
        style={{
          alignSelf: "stretch",
          width: "100%",
        }}
      >
        <div style={{ display: "grid", gap: theme.spacing.sm }}>
          <span
            style={{
              color: theme.colors.textMuted,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.3,
              textTransform: "uppercase",
            }}
          >
            Category Filters
          </span>
          <h2
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: "1.3rem",
              margin: 0,
            }}
          >
            Narrow the catalog
          </h2>
          <p
            style={{
              color: theme.colors.textMuted,
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Filters and sorting are synced to the URL, so refresh and shared links
            preserve the same catalog view.
          </p>
          <div className="inline-chip-row">
            <span
              className="pill-chip"
              style={{
                background: hasSelections
                  ? theme.colors.accentSoft
                  : theme.colors.surfaceMuted,
                color: hasSelections ? theme.colors.accent : theme.colors.textMuted,
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              {hasSelections
                ? `${this.state.selectedCategories.length} active categories`
                : "No category filters"}
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
              Sort: {formatSortLabel(this.state.sortBy)}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gap: theme.spacing.md }}>
          <label
            htmlFor="sort-by"
            style={{
              color: theme.colors.text,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            Sort products
          </label>
          <select
            className="sort-select"
            id="sort-by"
            onChange={this.handleSortChange.bind(this)}
            value={this.state.sortBy}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span
            style={{
              color: theme.colors.textMuted,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            {formatSortLabel(this.state.sortBy)} selected.
          </span>
        </div>

        <fieldset
          style={{
            border: "none",
            display: "grid",
            gap: theme.spacing.sm,
            margin: 0,
            padding: 0,
          }}
        >
          <legend
            style={{
              color: theme.colors.text,
              fontSize: 14,
              fontWeight: 700,
              marginBottom: theme.spacing.sm,
            }}
          >
            Categories
          </legend>

          {this.state.isLoadingCategories ? (
            <span style={{ color: theme.colors.textMuted }}>Loading categories...</span>
          ) : null}

          {!this.state.isLoadingCategories && this.state.categoriesError ? (
            <span style={{ color: theme.colors.danger, lineHeight: 1.6 }}>
              {this.state.categoriesError}
            </span>
          ) : null}

          {!this.state.isLoadingCategories &&
          !this.state.categoriesError &&
          this.state.categories.length > 0
            ? this.state.categories.map((category) => (
                <label
                  className={`filter-option ${
                    this.state.selectedCategories.includes(category)
                      ? "filter-option--active"
                      : ""
                  }`}
                  key={category}
                >
                  <input
                    checked={this.state.selectedCategories.includes(category)}
                    onChange={() => this.handleCategoryToggle(category)}
                    type="checkbox"
                  />
                  <span>{formatCategoryLabel(category)}</span>
                </label>
              ))
            : null}
        </fieldset>

        <button
          disabled={!hasSelections && this.state.sortBy === DEFAULT_HOME_QUERY_STATE.sortBy}
          className={hasSelections || hasCustomSort ? "primary-button" : "secondary-button"}
          onClick={this.handleClearFilters.bind(this)}
          style={{
            opacity:
              !hasSelections &&
              this.state.sortBy === DEFAULT_HOME_QUERY_STATE.sortBy
                ? 0.6
                : 1,
          }}
          type="button"
        >
          Reset filters and sort
        </button>
      </aside>
    );
  }

  render() {
    const selectedFilterLabel =
      this.state.selectedCategories.length > 0
        ? `${this.state.selectedCategories.length} categories active`
        : "All categories";

    return (
      <div className="page-stack">
        <section className="hero-panel">
          <div className="hero-grid">
            <div style={{ display: "grid", gap: theme.spacing.md }}>
              <span className="hero-eyebrow">Product listing</span>
              <h1
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: "clamp(2.4rem, 5vw, 4.2rem)",
                  lineHeight: 0.96,
                  margin: 0,
                  maxWidth: 720,
                }}
              >
                Discover products built for everyday adventures.
              </h1>
              <p
                style={{
                  color: "rgba(255, 248, 237, 0.86)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  margin: 0,
                  maxWidth: 680,
                }}
              >
                Browse the Fake Store catalog, refine it with server-backed
                category filters, and keep the exact state of the page shareable
                through the URL.
              </p>

              <div className="inline-chip-row" style={{ marginTop: theme.spacing.sm }}>
                <span
                  className="pill-chip"
                  style={{
                    background: "rgba(255, 255, 255, 0.16)",
                    color: "#fffaf2",
                    fontWeight: 700,
                  }}
                >
                  {selectedFilterLabel}
                </span>
                <span
                  className="pill-chip"
                  style={{
                    background: "rgba(255, 255, 255, 0.16)",
                    color: "#fffaf2",
                    fontWeight: 700,
                  }}
                >
                  Sort: {formatSortLabel(this.state.sortBy)}
                </span>
                <span
                  className="pill-chip"
                  style={{
                    background: "rgba(255, 255, 255, 0.16)",
                    color: "#fffaf2",
                    fontWeight: 700,
                  }}
                >
                  URL synced view
                </span>
              </div>
            </div>

            <div className="hero-stat-grid">
              <div className="hero-stat">
                <span className="hero-eyebrow" style={{ color: "rgba(255, 248, 237, 0.72)" }}>
                  Categories
                </span>
                <strong style={{ fontSize: "1.9rem", lineHeight: 1 }}>
                  {this.state.isLoadingCategories
                    ? "Loading"
                    : this.state.categories.length}
                </strong>
                <span style={{ color: "rgba(255, 248, 237, 0.8)", lineHeight: 1.6 }}>
                  Server-backed filters ready for quick narrowing.
                </span>
              </div>
              <div className="hero-stat">
                <span className="hero-eyebrow" style={{ color: "rgba(255, 248, 237, 0.72)" }}>
                  Results
                </span>
                <strong style={{ fontSize: "1.9rem", lineHeight: 1 }}>
                  {this.state.isLoadingProducts
                    ? "Updating"
                    : this.state.products.length}
                </strong>
                <span style={{ color: "rgba(255, 248, 237, 0.8)", lineHeight: 1.6 }}>
                  Visible products in the current storefront view.
                </span>
              </div>
              <div className="hero-stat hero-stat--wide">
                <span className="hero-eyebrow" style={{ color: "rgba(255, 248, 237, 0.72)" }}>
                  Current mode
                </span>
                <strong style={{ fontSize: "1.3rem", lineHeight: 1.2 }}>
                  {selectedFilterLabel} with {formatSortLabel(this.state.sortBy)}
                </strong>
                <span style={{ color: "rgba(255, 248, 237, 0.8)", lineHeight: 1.6 }}>
                  Refreshing or sharing the page keeps the same catalog state.
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="split-layout">
          {this.renderFilterPanel()}

          <section className="content-column">
            <div className="catalog-toolbar surface-card">
              <div style={{ display: "grid", gap: 6 }}>
                <h2
                  style={{
                    fontFamily: theme.fonts.heading,
                    fontSize: "1.6rem",
                    margin: 0,
                  }}
                >
                  Catalog results
                </h2>
                <span style={{ color: theme.colors.textMuted }}>
                  {this.state.isLoadingProducts
                    ? "Refreshing products..."
                    : `${this.state.products.length} products found`}
                </span>
              </div>

              <div className="inline-chip-row">
                <span
                  className="pill-chip"
                  style={{
                    background: theme.colors.surfaceMuted,
                    color: theme.colors.textMuted,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {selectedFilterLabel}
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
                  Sort: {formatSortLabel(this.state.sortBy)}
                </span>
              </div>
            </div>

            {this.state.productsError ? (
              <StatusView
                actionLabel="Try again"
                eyebrow="Product feed"
                linkLabel="Go home"
                linkTo="/"
                message={this.state.productsError}
                onAction={this.loadProducts.bind(this)}
                title="Something interrupted the catalog refresh."
                tone="error"
              />
            ) : null}

            {!this.state.productsError && this.state.isLoadingProducts ? (
              <StatusView
                eyebrow="Loading"
                message="Fetching products and applying the selected filters."
                title="Updating the storefront"
              />
            ) : null}

            {!this.state.productsError &&
            !this.state.isLoadingProducts &&
            this.state.products.length === 0 ? (
              <StatusView
                actionLabel="Reset the view"
                eyebrow="No matches"
                message="No products matched the active categories. Reset the filters to bring the full catalog back."
                onAction={this.handleClearFilters.bind(this)}
                title="Nothing matched this combination"
              />
            ) : null}

            {!this.state.productsError &&
            !this.state.isLoadingProducts &&
            this.state.products.length > 0 ? (
              <div className="product-grid">
                {this.state.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : null}
          </section>
        </div>
      </div>
    );
  }
}

export default withRouter(HomePage);
