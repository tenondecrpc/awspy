import { expect, test } from "@playwright/test";

test("home exposes a concise event card and a reachable image", async ({
  page,
  request,
}) => {
  await page.goto("/");

  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    "AWS Community Day Paraguay 2026"
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
    "content",
    /17 de octubre de 2026.*Servicio Nacional de Promoción Profesional/
  );

  const imageUrl = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(imageUrl).toBeTruthy();
  const image = await request.get(imageUrl!);
  expect(image.ok()).toBeTruthy();
  expect(image.headers()["content-type"]).toContain("image/png");
});

test("contact email fits on one line in the desktop footer", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "chromium");
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto("/");

  const link = page.getByRole("contentinfo").getByRole("link", {
    name: "awscommunitydayparaguay@gmail.com",
  });
  const lineTops = await link.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return [...range.getClientRects()]
      .filter((rect) => rect.width > 0)
      .map((rect) => Math.round(rect.top));
  });
  expect(new Set(lineTops).size).toBe(1);
});
