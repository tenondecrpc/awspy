import { test, expect } from "@playwright/test";

test.describe("/speakers", () => {
  test("renders the empty state when deterministic Sessionize access is unavailable", async ({
    page,
  }) => {
    await page.goto("/speakers");
    await expect(
      page.getByRole("heading", { level: 1, name: "Speakers" })
    ).toBeVisible();
    // Local Playwright configuration points Sessionize at a closed loopback
    // port so this failure mode never depends on a live service.
    await expect(
      page.getByText(/pronto anunciamos a los speakers/i)
    ).toBeVisible();
  });
});
