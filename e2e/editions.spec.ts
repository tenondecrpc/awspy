import { test, expect } from "@playwright/test";

test.describe("editions", () => {
  test("/editions renders the empty state when only the current edition exists", async ({
    page,
  }) => {
    await page.goto("/editions");
    await expect(
      page.getByRole("heading", { level: 1, name: /ediciones anteriores/i })
    ).toBeVisible();
    await expect(
      page.getByText(/aún no hay ediciones anteriores/i)
    ).toBeVisible();
  });

  test("/editions/2026 mirrors the home page (current edition deep-link)", async ({
    page,
  }) => {
    await page.goto("/editions/2026");
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /AWS Community Day Paraguay/i,
      })
    ).toBeVisible();
  });

  // The speakers preview streams in behind a Suspense boundary, so the unit
  // suite cannot see it: React DOM does not resume a `use()` promise under
  // jsdom. This is the assertion that moved here, and it is the stronger
  // version of it - a real server, really streaming.
  test("/editions/2026 keeps the streamed speaker links inside the edition", async ({
    page,
  }) => {
    await page.goto("/editions/2026");
    const section = page.locator("#speakers");
    await expect(section.getByRole("link").first()).toBeVisible();

    const hrefs = await section
      .getByRole("link")
      .evaluateAll((links) =>
        links
          .map((link) => link.getAttribute("href") ?? "")
          .filter((href) => href.startsWith("/"))
      );
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((href) => !href.startsWith("/editions/2026"))).toEqual(
      []
    );
  });

  test("/editions/2026/cfp shows the archived notice", async ({ page }) => {
    await page.goto("/editions/2026/cfp");
    await expect(page.getByText(/esta edición ya finalizó/i)).toBeVisible();
  });

  test("/editions/2026/register shows the archived notice", async ({
    page,
  }) => {
    await page.goto("/editions/2026/register");
    await expect(page.getByText(/esta edición ya finalizó/i)).toBeVisible();
  });

  test("/editions/2026/volunteers shows the archived notice", async ({
    page,
  }) => {
    await page.goto("/editions/2026/volunteers");
    await expect(page.getByText(/esta edición ya finalizó/i)).toBeVisible();
  });

  test("/editions/9999 returns a 404", async ({ page }) => {
    const response = await page.goto("/editions/9999");
    expect(response?.status()).toBe(404);
  });
});
