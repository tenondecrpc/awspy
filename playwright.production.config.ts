import { defineConfig, devices } from "@playwright/test";

const deployedBaseUrl = process.env.BASE_URL;
const localBaseUrl = "http://localhost:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: deployedBaseUrl ?? localBaseUrl,
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chrome", use: { ...devices["Pixel 7"] } },
  ],
  webServer: deployedBaseUrl
    ? undefined
    : {
        command: "npm start",
        url: localBaseUrl,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          CURRENT_EDITION: "2026",
          NEXT_PUBLIC_SITE_URL: localBaseUrl,
          NEXT_PUBLIC_SESSIONIZE_BASE_URL: "http://127.0.0.1:1/sessionize",
        },
      },
});
