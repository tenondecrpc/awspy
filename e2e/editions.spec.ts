import { test, expect } from "@playwright/test";

test.describe("editions", () => {
  test("/editions renders the empty state when only the current edition exists", async ({
    page,
  }) => {
    await page.goto("/editions");
    await expect(
      page.getByRole("heading", { level: 1, name: /ediciones anteriores/i })
    ).toBeVisible();
    await expect(
      page.getByText(/aún no hay ediciones anteriores/i)
    ).toBeVisible();
  });

  test("/editions/2026 mirrors the home page (current edition deep-link)", async ({
    page,
  }) => {
    await page.goto("/editions/2026");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /AWS Community Day Paraguay/i,
      })
    ).toBeVisible();
  });

  test("/editions/2026/cfp shows the archived notice", async ({ page }) => {
    await page.goto("/editions/2026/cfp");
    await expect(page.getByText(/esta edición ya finalizó/i)).toBeVisible();
  });

  test("/editions/2026/register shows the archived notice", async ({
    page,
  }) => {
    await page.goto("/editions/2026/register");
    await expect(page.getByText(/esta edición ya finalizó/i)).toBeVisible();
  });

  test("/editions/9999 returns a 404", async ({ page }) => {
    const response = await page.goto("/editions/9999");
    expect(response?.status()).toBe(404);
  });
});
