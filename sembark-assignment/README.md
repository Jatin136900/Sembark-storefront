# Sembark Storefront

A production-minded CRA application built from the Sembark Tech assignment PDF. The app uses React class components, TypeScript, React Router, MobX, and Context API to deliver a responsive storefront with API-backed filtering, dynamic product pages, and a persistent cart.

## Approach

The build was delivered in four phases:

1. Planning and gap analysis against the PDF requirements.
2. Architecture and TypeScript migration for a maintainable class-component codebase.
3. Feature development for products, filters, cart flows, navigation, persistence, animations, and accessibility.
4. Verification through unit and Playwright end-to-end coverage.

## Features

- Home page with API-driven product listing, category filters, and sorting.
- URL-synced filter and sort state so refresh, back navigation, and shared links preserve the selected view.
- Dynamic product detail pages that fetch by product id.
- Cart management powered by MobX and Context API with add and remove flows.
- Persistent cart state stored in `localStorage`.
- Footer cart summary available across the application.
- Dedicated cart page with totals and removal controls.
- Responsive layouts, semantic markup, and lightweight motion polish.
- Playwright coverage for the primary user journeys.

## Tech Stack

- Create React App
- React 19
- TypeScript
- React Router DOM
- MobX + Context API
- Playwright
- Fake Store API

## Project Structure

```text
src/
  api/         API layer for Fake Store requests
  components/  Reusable class-based UI building blocks
  context/     MobX store context
  pages/       Route-level screens
  store/       Cart store
  types/       Shared TypeScript contracts
  utils/       Formatting, query-string, and router helpers
```

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open `http://localhost:3000`.

## Available Scripts

- `npm start` starts the CRA development server.
- `npm run build` creates a production build.
- `npm run test:unit` runs the React Testing Library suite once.
- `npm run test:e2e` runs the Playwright tests.

## Assumptions

- The assignment PDF was treated as the source of truth. The home page preserves filter and sort selections in the URL so shared links restore the same view.
- Fake Store API supports server-side category filtering but not rich server-side price sorting, so category filtering is always API-driven and sorting is applied to the fetched result set before rendering.
- The cart models quantity per product so repeated adds remain easy to understand and manage.
- Playwright is configured to use the locally installed Microsoft Edge browser channel to avoid a separate browser download during setup.

## Notes and Limitations

- The app depends on `https://fakestoreapi.com/` being available at runtime.
- End-to-end tests stub the Fake Store API responses for deterministic execution.
- Before submission, push this repository to GitHub and share the repository link as requested in the assignment.
