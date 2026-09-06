import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders the hero, countdown, and primary navigation", async ({
    page,
  }) => {
    await page.goto("/");

    // Hero
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /AWS Community Day Paraguay/i,
      })
    ).toBeVisible();

    // Countdown
    await expect(page.getByText("días")).toBeVisible();
    await expect(page.getByText("hs")).toBeVisible();
    await expect(page.getByText("min")).toBeVisible();

    // Footer privacy notice
    await expect(page.getByText(/no recopila datos personales/i)).toBeVisible();
  });

  test("offers a primary register CTA pointing to /register", async ({
    page,
  }) => {
    await page.goto("/");
    const main = page.locator("main");
    await expect(
      main.getByText("Registro abierto", { exact: true })
    ).toBeVisible();
    const cta = main.getByRole("link", { name: "Registrarme", exact: true });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/register");
    await cta.click();
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: "Registrarme", exact: true })
    ).toBeVisible();
  });

  test("has a working skip link", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: /saltar al contenido/i });
    await expect(skip).toHaveAttribute("href", "#contenido-principal");
  });
});
