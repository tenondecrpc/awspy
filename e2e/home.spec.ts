import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders the hero, countdown, and primary navigation", async ({ page }) => {
    await page.goto("/");

    // Hero
    await expect(
      page.getByRole("heading", { level: 1, name: /AWS Community Day Paraguay/i })
    ).toBeVisible();

    // Countdown
    await expect(page.getByText("días")).toBeVisible();
    await expect(page.getByText("hs")).toBeVisible();
    await expect(page.getByText("min")).toBeVisible();

    // Footer privacy notice
    await expect(page.getByText(/no recopila datos personales/i)).toBeVisible();
  });

  test("offers a primary register CTA pointing to /register", async ({ page }) => {
    await page.goto("/");
    // The hero renders "Avisame del registro" while registrationStatus is
    // "upcoming"; once the seeded status flips to "open" the copy becomes
    // "Registrarme" and lives in the same hero slot. Either way the primary
    // CTA points at /register. We scope to the main content area to avoid
    // matching the header/footer nav entries.
    const main = page.locator("main");
    const cta = main.getByRole("link", { name: /^(Registrarme|Avisame del registro)$/i }).first();
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/register");
  });

  test("has a working skip link", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: /saltar al contenido/i });
    await expect(skip).toHaveAttribute("href", "#contenido-principal");
  });
});
