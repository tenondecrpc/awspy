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
      .getByRole("link", { name: /Reservar en Eventbrite/i });
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

  test("ticket action fills the card and stays compact on a narrow phone", async ({
    page,
  }) => {
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/register");

      const action = page.getByRole("link", {
        name: /reservar en eventbrite/i,
      });
      const helper = page.getByText("Se abre en una pestaña nueva");
      const card = action.locator("xpath=..");
      const [actionBox, helperBox, cardBox] = await Promise.all([
        action.boundingBox(),
        helper.boundingBox(),
        card.boundingBox(),
      ]);

      expect(actionBox).not.toBeNull();
      expect(helperBox).not.toBeNull();
      expect(cardBox).not.toBeNull();
      expect(actionBox!.width).toBeCloseTo(cardBox!.width - 66, 0);
      expect(actionBox!.x + actionBox!.width / 2).toBeCloseTo(
        helperBox!.x + helperBox!.width / 2,
        0
      );
      if (width === 320) expect(actionBox!.height).toBeLessThanOrEqual(80);
    }
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
