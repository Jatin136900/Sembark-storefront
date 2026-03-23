import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  expect: {
    timeout: 5_000,
  },
  fullyParallel: true,
  testDir: "./e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "set PORT=3100&& npm.cmd start",
    reuseExistingServer: false,
    timeout: 120_000,
    url: "http://127.0.0.1:3100",
  },
  projects: [
    {
      name: "desktop-edge",
      use: {
        browserName: "chromium",
        channel: "msedge",
        viewport: { height: 900, width: 1280 },
      },
    },
    {
      name: "mobile-edge",
      use: {
        ...devices["Pixel 7"],
        browserName: "chromium",
        channel: "msedge",
      },
    },
  ],
});
