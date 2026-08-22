import { test, expect } from "@playwright/test";

// Resilience smoke. Every public route returns 200 and shows its primary
// heading even with the seeded `null` Sessionize/Eventbrite values. This
// validates FR-013 (Sessionize empty), FR-014 (Eventbrite missing), and
// the generic "page never blows up because external service is down"
// behavior.

const ROUTES: Array<{ path: string; heading: RegExp }> = [
  { path: "/", heading: /AWS Community Day Paraguay/i },
  { path: "/speakers", heading: /^speakers$/i },
  { path: "/schedule", heading: /^agenda$/i },
  { path: "/sponsors", heading: /^sponsors$/i },
  { path: "/venue", heading: /^sede$/i },
  { path: "/team", heading: /equipo organizador/i },
  { path: "/faq", heading: /preguntas frecuentes/i },
  { path: "/code-of-conduct", heading: /código de conducta/i },
  { path: "/cfp", heading: /call for papers/i },
  { path: "/register", heading: /^registro$/i },
  { path: "/editions", heading: /ediciones anteriores/i },
];

for (const route of ROUTES) {
  test(`${route.path} renders 200 with its primary heading`, async ({
    page,
  }) => {
    const response = await page.goto(route.path);
    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading })
    ).toBeVisible();
  });
}

test("/sitemap.xml is reachable", async ({ page }) => {
  const response = await page.goto("/sitemap.xml");
  expect(response?.ok()).toBe(true);
});

test("/robots.txt is reachable", async ({ page }) => {
  const response = await page.goto("/robots.txt");
  expect(response?.ok()).toBe(true);
});
