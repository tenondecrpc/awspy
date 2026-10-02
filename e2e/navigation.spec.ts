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
  "Voluntarios",
  "Preguntas",
];
const FOOTER_ONLY_NAV = ["Proponer charla"];

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

  test("footer links the official social accounts in a new tab", async ({
    page,
  }) => {
    await page.goto("/");

    const footer = page.getByRole("contentinfo");
    for (const [name, href] of [
      ["Instagram", "https://www.instagram.com/awscommunitydaypy/"],
      [
        "LinkedIn",
        "https://www.linkedin.com/company/aws-community-day-paraguay",
      ],
    ]) {
      const link = footer.getByRole("link", { name, exact: true });
      await expect(link).toHaveAttribute("href", href);
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    await expect(footer.getByText("Próximamente en redes")).toHaveCount(0);
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

  test("mobile: registration action stays inside the drawer", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 720 });
    await page.goto("/");

    const header = page.getByRole("banner");
    await expect(
      header.getByRole("link", { name: "Registrarme", exact: true })
    ).toBeHidden();
    // The page is server-rendered, so the button exists before React has
    // hydrated, and a click in that window does nothing. Under load (parallel
    // workers on a dev server) it landed there. Retry the click until the
    // drawer is open instead of assuming hydration is already done.
    const drawer = page.getByRole("dialog", { name: "Navegación principal" });
    await expect(async () => {
      if (!(await drawer.isVisible())) {
        await page.getByRole("button", { name: "Abrir menú" }).click();
      }
      await expect(drawer).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await expect(
      drawer.getByRole("link", { name: "Registrarme" })
    ).toBeVisible();
  });

  // Reported from a Galaxy S22 (360x780). `toBeVisible` passed while the
  // drawer was broken: the header's `backdrop-filter` made it the containing
  // block of the drawer's `position: fixed`, so the panel was 64px tall and
  // its links spilled, unbacked, over the hero. Only geometry catches that.
  test("mobile: the open drawer covers the full viewport height", async ({
    page,
  }) => {
    const viewport = { width: 360, height: 780 };
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.getByRole("button", { name: /abrir menú/i }).click();

    const drawer = page.getByRole("dialog", { name: /navegación principal/i });
    await expect(drawer).toBeVisible();
    const box = await drawer.boundingBox();
    expect(box).toMatchObject({ y: 0, height: viewport.height });
    expect(box!.x + box!.width).toBe(viewport.width);

    // The last entry must sit on the panel, not below it.
    const cta = drawer.getByRole("link", { name: "Registrarme" });
    const ctaBox = await cta.boundingBox();
    expect(ctaBox!.y + ctaBox!.height).toBeLessThanOrEqual(box!.height);
  });
});
