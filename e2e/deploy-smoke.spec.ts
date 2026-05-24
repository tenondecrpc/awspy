import { test, expect } from "@playwright/test";

// Deploy smoke run. Set `BASE_URL=https://<deployed-preview-url>` (e.g. an
// AWS Amplify preview branch URL) when running this against a deployed
// preview to verify every public route is reachable and renders its primary
// heading. The site is cloud-agnostic; the only assumption here is that
// `BASE_URL` resolves to a working Next.js deployment.

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

const BASE = process.env.BASE_URL ?? "";

for (const route of ROUTES) {
  test(`deploy smoke ${route.path}`, async ({ page }) => {
    const url = BASE ? `${BASE}${route.path}` : route.path;
    const response = await page.goto(url);
    expect(response?.ok()).toBe(true);
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading })
    ).toBeVisible();
  });
}

test("deploy smoke /sitemap.xml is reachable", async ({ page }) => {
  const url = BASE ? `${BASE}/sitemap.xml` : "/sitemap.xml";
  const response = await page.goto(url);
  expect(response?.ok()).toBe(true);
});

test("deploy smoke /opengraph-image is reachable", async ({ page }) => {
  const url = BASE ? `${BASE}/opengraph-image` : "/opengraph-image";
  const response = await page.goto(url);
  expect(response?.ok()).toBe(true);
});
