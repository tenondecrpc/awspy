import { test, expect } from "@playwright/test";

test.describe("/schedule", () => {
  test("renders the empty state when no Sessionize event id is configured", async ({ page }) => {
    await page.goto("/schedule");
    await expect(
      page.getByRole("heading", { level: 1, name: "Agenda" })
    ).toBeVisible();
    await expect(page.getByText(/agenda próximamente/i)).toBeVisible();
  });
});
