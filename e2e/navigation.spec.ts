import { test, expect } from "@playwright/test";

test.describe("Site navigation", () => {
  test("desktop: every primary nav entry is visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");
    const links = [
      "Speakers",
      "Agenda",
      "Sponsors",
      "Sede",
      "Equipo",
      "Voluntarios",
      "Preguntas",
      "CFP",
      "Registrarme",
    ];
    for (const name of links) {
      const link = page.getByRole("link", { name }).first();
      await expect(link).toBeVisible();
    }
  });

  test("tablet: uses the navigation drawer when all links do not fit", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await page.goto("/");

    await expect(
      page.getByRole("button", { name: /abrir menú/i })
    ).toBeVisible();
  });

  test("mobile: opens and closes the navigation drawer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const trigger = page.getByRole("button", { name: /abrir menú/i });
    await expect(trigger).toBeVisible();
    await trigger.click();
    await expect(
      page.getByRole("dialog", { name: /navegación principal/i })
    ).toBeVisible();
    await page.getByRole("button", { name: /cerrar menú/i }).click();
    await expect(
      page.getByRole("dialog", { name: /navegación principal/i })
    ).toBeHidden();
  });
});
