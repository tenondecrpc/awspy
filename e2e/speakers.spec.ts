import { test, expect } from "@playwright/test";

test.describe("/speakers", () => {
  // Sessionize is pointed at a closed loopback port here, so the live view is
  // empty and the placeholder speakers stand in for it, the same way the
  // agenda does. See lib/api/sessionize-preview.ts.
  test("falls back to the placeholder speakers when the live view is empty", async ({
    page,
  }) => {
    await page.goto("/speakers");
    await expect(
      page.getByRole("heading", { level: 1, name: "Speakers" })
    ).toBeVisible();
    await expect(
      page.getByText(/pronto anunciamos a los speakers/i)
    ).toHaveCount(0);
    await expect(
      page.getByRole("link", { name: "Ana Demo" }).first()
    ).toBeVisible();
  });
});
