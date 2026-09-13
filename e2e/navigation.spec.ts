import { test, expect } from "@playwright/test";

// The header nav is condensed (lib/nav PRIMARY_NAV); the destinations it drops
// stay reachable in the footer. Each list is asserted against its own landmark
// so a link that silently moves between them cannot pass unnoticed.
const HEADER_NAV = [
  "Agenda",
  "Speakers",
  "Sede",
  "Sponsors",
  "Equipo",
  "Preguntas",
];
const FOOTER_ONLY_NAV = ["Proponer charla", "Voluntarios"];

test.describe("Site navigation", () => {
  test("desktop: every primary nav entry is visible", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const header = page.getByRole("banner");
    for (const name of HEADER_NAV) {
      await expect(
        header.getByRole("link", { name, exact: true })
      ).toBeVisible();
    }
    await expect(
      header.getByRole("link", { name: "Registrarme", exact: true })
    ).toBeVisible();
  });

  test("desktop: the links the header drops stay in the footer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    for (const name of FOOTER_ONLY_NAV) {
      await expect(
        footer.getByRole("link", { name, exact: true })
      ).toBeVisible();
    }
  });

  test("defaults to light and persists a manual color theme across reloads", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    const toggle = page.getByRole("button", {
      name: /cambiar entre modo claro y oscuro/i,
    });
    await expect(toggle).toBeVisible();

    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
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
