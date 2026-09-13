import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test("renders the hero, countdown, and primary navigation", async ({
    page,
  }) => {
    await page.goto("/");

    // Hero. The headline is broken across lines and keeps "Community Day"
    // together with a non-breaking space, so match on flexible whitespace.
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /AWS\s+Community\s+Day\s+Paraguay/i,
      })
    ).toBeVisible();

    // Countdown. The hero uses the inline variant ("Faltan N días"); the
    // días/hs/min grid is the other variant of the same organism.
    await expect(
      page.getByText(/Faltan \d+ días|El evento ya comenzó/)
    ).toBeVisible();

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
    const cta = main.getByRole("link", {
      name: "Registrarme gratis",
      exact: true,
    });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", "/register");
    await cta.click();
    await expect(
      page
        .locator("main")
        .getByRole("link", { name: /Reservar mi lugar en Eventbrite/i })
    ).toBeVisible();
  });

  test("has a working skip link", async ({ page }) => {
    await page.goto("/");
    const skip = page.getByRole("link", { name: /saltar al contenido/i });
    await expect(skip).toHaveAttribute("href", "#contenido-principal");
  });

  test("links the volunteer invitation to the dedicated section", async ({
    page,
  }) => {
    await page.goto("/");

    // The invitation is one of the three "formas de ser parte" cards, whose
    // accessible name concatenates the eyebrow, the title and the blurb.
    const invitation = page
      .locator("main")
      .getByRole("link", { name: /Ser voluntario\/a/ });
    await expect(invitation).toBeVisible();
    await expect(invitation).toHaveAttribute("href", "/volunteers");
  });
});
