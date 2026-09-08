import { test, expect } from "@playwright/test";

test.describe("/register and /cfp", () => {
  test("/register opens official Paraguay registration in Eventbrite", async ({
    page,
  }) => {
    await page.goto("/register");
    await expect(
      page.getByRole("heading", { level: 1, name: "Registro" })
    ).toBeVisible();
    await expect(
      page.getByText(/El acceso al evento es gratuito/)
    ).toBeVisible();
    const registration = page
      .locator("main")
      .getByRole("link", { name: "Registrarme", exact: true });
    await expect(registration).toBeVisible();
    await expect(registration).toHaveAttribute(
      "href",
      "https://www.eventbrite.com/e/aws-community-day-paraguay-2026-tickets-1999945984276"
    );
    await expect(registration).toHaveAttribute("target", "_blank");
    await expect(registration).toHaveAttribute("rel", "noopener noreferrer");
    await registration.focus();
    await expect(registration).toBeFocused();
    await expect(
      page.getByRole("link", { name: /avisame por mail/i })
    ).toHaveCount(0);
    await expect(
      page.getByText(/Registro próximamente|Ejemplo temporal/)
    ).toHaveCount(0);
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
      page.getByRole("heading", { level: 1, name: "Proponé una charla" })
    ).toBeVisible();
    await expect(page.getByText(/convocatoria abierta/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /enviar propuesta en sessionize/i })
    ).toHaveAttribute(
      "href",
      "https://sessionize.com/aws-community-day-paraguay-2026"
    );
  });
});
