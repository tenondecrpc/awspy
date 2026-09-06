import { test, expect } from "@playwright/test";

test.describe("/register and /cfp", () => {
  test("/register shows the 'registro próximamente' alternative for the seeded null URL", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { level: 1, name: "Registro" })
    ).toBeVisible();
    // With the seed event.json registrationStatus: "upcoming", the alternative
    // pathway is rendered.
    await expect(page.getByText(/aún no abrimos el registro/i)).toBeVisible();
    // The alt CTA is a mailto link, not the Eventbrite event URL.
    const mailto = page.getByRole("link", { name: /avisame por mail/i });
    await expect(mailto).toBeVisible();
    await expect(mailto).toHaveAttribute("href", /^mailto:/);
  });

  test("/register does not load the Eventbrite widget script (C1: link-only)", async ({
    page,
  }) => {
    await page.goto("/register");
    // No <script> tag should reference eb_widgets.js. The site delegates
    // registration to Eventbrite via an external link only.
    const widgetScripts = await page
      .locator('script[src*="eb_widgets.js"]')
      .count();
    expect(widgetScripts).toBe(0);
  });

  test("/cfp shows the open callout with the official Sessionize URL", async ({
    page,
  }) => {
    await page.goto("/cfp");
    await expect(
      page.getByRole("heading", { level: 1, name: "Call for papers" })
    ).toBeVisible();
    await expect(page.getByText(/CFP abierto/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /enviar propuesta en sessionize/i })
    ).toHaveAttribute(
      "href",
      "https://sessionize.com/aws-community-day-paraguay-2026"
    );
  });
});
