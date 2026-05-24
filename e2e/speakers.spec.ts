import { test, expect } from "@playwright/test";

test.describe("/speakers", () => {
  test("renders the empty state when no Sessionize event id is configured", async ({ page }) => {
    await page.goto("/speakers");
    await expect(
      page.getByRole("heading", { level: 1, name: "Speakers" })
    ).toBeVisible();
    // With the seed event.json sessionizeEventId is null, so the empty state
    // should be shown.
    await expect(page.getByText(/pronto anunciamos a los speakers/i)).toBeVisible();
  });
});
