import { expect, test, type Page } from "@playwright/test";

const categories = ["electronics", "jewelery", "men's clothing"];

const products = [
  {
    category: "electronics",
    description: "Wireless headphones with all-day battery life and active noise cancellation.",
    id: 1,
    image: "https://example.com/headphones.png",
    price: 199.99,
    rating: {
      count: 228,
      rate: 4.8,
    },
    title: "Aurora Headphones",
  },
  {
    category: "electronics",
    description: "A compact smart speaker that fits neatly into any room.",
    id: 2,
    image: "https://example.com/speaker.png",
    price: 89.0,
    rating: {
      count: 94,
      rate: 4.4,
    },
    title: "Echo Mini Speaker",
  },
  {
    category: "jewelery",
    description: "A polished necklace with a lightweight, layered profile.",
    id: 3,
    image: "https://example.com/necklace.png",
    price: 145.5,
    rating: {
      count: 37,
      rate: 4.6,
    },
    title: "Layered Necklace",
  },
];

async function mockFakeStoreApi(page: Page): Promise<void> {
  await page.route("https://fakestoreapi.com/**", async (route) => {
    const url = new URL(route.request().url());

    if (url.pathname === "/products/categories") {
      await route.fulfill({
        body: JSON.stringify(categories),
        contentType: "application/json",
      });
      return;
    }

    if (url.pathname === "/products") {
      await route.fulfill({
        body: JSON.stringify(products),
        contentType: "application/json",
      });
      return;
    }

    const categoryMatch = url.pathname.match(/^\/products\/category\/(.+)$/);
    if (categoryMatch) {
      const requestedCategory = decodeURIComponent(categoryMatch[1]);
      const filteredProducts = products.filter(
        (product) => product.category === requestedCategory
      );

      await route.fulfill({
        body: JSON.stringify(filteredProducts),
        contentType: "application/json",
      });
      return;
    }

    const productMatch = url.pathname.match(/^\/products\/(\d+)$/);
    if (productMatch) {
      const requestedProduct = products.find(
        (product) => product.id === Number(productMatch[1])
      );

      await route.fulfill({
        body: JSON.stringify(requestedProduct ?? { message: "Not found" }),
        contentType: "application/json",
        status: requestedProduct ? 200 : 404,
      });
      return;
    }

    await route.fulfill({
      body: JSON.stringify({ message: "Not found" }),
      contentType: "application/json",
      status: 404,
    });
  });
}

test("persists filter state in the URL and restores it after refresh", async ({
  page,
}) => {
  await mockFakeStoreApi(page);
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /discover products/i })
  ).toBeVisible();

  await page.getByLabel("Electronics").check();

  await expect(page).toHaveURL(/category=electronics/);
  await expect(page.getByText("2 products found")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /aurora headphones/i })
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /layered necklace/i })
  ).toHaveCount(0);

  await page.reload();

  await expect(page).toHaveURL(/category=electronics/);
  await expect(page.getByText("2 products found")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /aurora headphones/i })
  ).toBeVisible();
});

test("loads product detail by id and supports add and remove cart actions", async ({
  page,
}) => {
  await mockFakeStoreApi(page);
  await page.goto("/");

  await page.getByRole("link", { name: /aurora headphones/i }).click();

  await expect(page).toHaveURL(/\/product\/1\/details$/);
  await expect(
    page.getByRole("heading", { name: /aurora headphones/i })
  ).toBeVisible();

  await page.getByRole("button", { name: /add to cart/i }).click();

  await expect(page.getByText("Items in cart: 1")).toBeVisible();
  await page.getByRole("link", { name: /view cart/i }).click();

  await expect(page.getByRole("heading", { name: /your cart/i })).toBeVisible();
  await page
    .getByRole("button", { name: /remove aurora headphones from cart/i })
    .click();

  await expect(page.getByText(/your cart is empty/i)).toBeVisible();
});
