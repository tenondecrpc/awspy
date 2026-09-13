import { test, expect } from "@playwright/test";

test.describe("/schedule", () => {
  // Playwright points Sessionize at a closed loopback port, so the live view
  // always comes back empty here. With CONTENT_PREVIEW on - the default - that
  // is exactly the case the placeholder agenda covers, so the page renders a
  // full day rather than the empty state. See lib/api/sessionize-preview.ts.
  test("falls back to the placeholder agenda when the live view is empty", async ({
    page,
  }) => {
    await page.goto("/schedule");
    await expect(
      page.getByRole("heading", { level: 1, name: "Agenda" })
    ).toBeVisible();
    await expect(page.getByText(/agenda próximamente/i)).toHaveCount(0);
    await expect(
      page.getByText("Keynote de apertura: la nube que construye la comunidad")
    ).toBeVisible();
  });

  test("lists the placeholder rooms", async ({ page }) => {
    await page.goto("/schedule");
    await expect(page.getByText("Sala Guaraní").first()).toBeVisible();
  });

  test("filters sessions by room and can restore all rooms", async ({
    page,
  }) => {
    await page.goto("/schedule");
    await page
      .getByRole("navigation", { name: "Filtrar agenda por sala" })
      .getByRole("link", { name: "Sala Ñandútí" })
      .click();

    await expect(page).toHaveURL(/room=Sala/);
    await expect(
      page.getByRole("heading", {
        name: "Observabilidad en EKS con OpenTelemetry",
      })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: "Arquitecturas serverless que escalan sin sorpresas",
      })
    ).toHaveCount(0);

    await page
      .getByRole("navigation", { name: "Filtrar agenda por sala" })
      .getByRole("link", { name: "Todas las salas" })
      .click();
    await expect(page).toHaveURL(/\/schedule$/);
    await expect(
      page.getByRole("heading", {
        name: "Arquitecturas serverless que escalan sin sorpresas",
      })
    ).toBeVisible();
  });
});
