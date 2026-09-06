import { test, expect } from "@playwright/test";

test.describe("/volunteers", () => {
  test("opens the official volunteer form in a new tab", async ({ page }) => {
    await page.goto("/volunteers");

    await expect(
      page.getByRole("heading", { level: 1, name: "Voluntariado" })
    ).toBeVisible();
    await expect(page.getByText("Convocatoria abierta")).toBeVisible();

    const registration = page.getByRole("link", {
      name: "Completar formulario de voluntariado",
    });
    await expect(registration).toBeVisible();
    await expect(registration).toHaveAttribute(
      "href",
      "https://docs.google.com/forms/d/1GIKrU2urGvaUg-CixQY3PknkdhSIZo2hSKm3PQZhlEc/viewform"
    );
    await expect(registration).toHaveAttribute("target", "_blank");
    await expect(registration).toHaveAttribute("rel", "noopener noreferrer");
    await registration.focus();
    await expect(registration).toBeFocused();
  });

  test("does not embed Google Forms scripts or frames", async ({ page }) => {
    await page.goto("/volunteers");

    await expect(
      page.locator('iframe[src*="docs.google.com/forms"]')
    ).toHaveCount(0);
    await expect(
      page.locator('script[src*="docs.google.com/forms"]')
    ).toHaveCount(0);
  });
});
