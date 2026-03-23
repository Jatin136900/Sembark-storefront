import { render, screen } from "@testing-library/react";
import App from "./App";
import CartContext from "./context/CartContext";
import CartStore from "./store/CartStore";

const mockProducts = [
  {
    category: "electronics",
    description: "A durable backpack for daily travel.",
    id: 1,
    image: "https://example.com/backpack.png",
    price: 89.99,
    rating: {
      count: 120,
      rate: 4.7,
    },
    title: "Trail Backpack",
  },
  {
    category: "jewelery",
    description: "A refined accessory with a clean silhouette.",
    id: 2,
    image: "https://example.com/necklace.png",
    price: 129.5,
    rating: {
      count: 48,
      rate: 4.5,
    },
    title: "Layered Necklace",
  },
];

describe("App", () => {
  beforeEach(() => {
    window.localStorage.clear();

    global.fetch = jest.fn((input: RequestInfo | URL) => {
      const requestUrl = typeof input === "string" ? input : input.toString();

      if (requestUrl.endsWith("/products/categories")) {
        return Promise.resolve({
          json: async () => ["electronics", "jewelery"],
          ok: true,
        } as Response);
      }

      return Promise.resolve({
        json: async () => mockProducts,
        ok: true,
      } as Response);
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("renders the product listing experience", async () => {
    const cartStore = new CartStore();

    render(
      <CartContext.Provider value={cartStore}>
        <App />
      </CartContext.Provider>
    );

    expect(
      await screen.findByRole("heading", { name: /discover products/i })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("link", { name: /trail backpack/i })
    ).toBeInTheDocument();
  });
});
