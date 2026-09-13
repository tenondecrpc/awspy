import { test, expect, type Page } from "@playwright/test";

// A scroll gesture that starts inside the chat must stay inside the chat: the
// transcript scrolls on its own, and the regions that do not scroll absorb the
// gesture instead of passing it to the page behind the panel.
//
// These assertions must settle before reading `window.scrollY`. Scrolling is
// asynchronous, so `expect.poll(...).toBe(before)` would pass on its first
// sample — taken before any scroll could have applied — and would therefore
// never catch the leak.
const SETTLE_MS = 400;

async function wheelAndSettle(page: Page, delta = 600) {
  await page.mouse.wheel(0, delta);
  await page.waitForTimeout(SETTLE_MS);
}

async function askEveryQuestion(page: Page) {
  // The greeting alone does not overflow the transcript; a full conversation
  // does, which is what makes the "reaches its end" case meaningful.
  for (;;) {
    const buttons = page.getByRole("dialog").getByRole("button");
    // Index 0 is the close control; the rest are suggested questions.
    if ((await buttons.count()) <= 1) return;
    await buttons.nth(1).click();
  }
}

test.describe("Kiro chat scroll containment", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Abrir chat de Kiro" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await askEveryQuestion(page);
    await page.evaluate(() => window.scrollTo(0, 0));
  });

  test("the page does not move when scrolling over the chat header", async ({
    page,
  }) => {
    await page
      .getByRole("dialog")
      .getByText("Preguntas frecuentes", { exact: true })
      .hover();
    await wheelAndSettle(page);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("the page does not move when scrolling over the suggestions", async ({
    page,
  }) => {
    await page.getByRole("dialog").getByRole("button").last().hover();
    await wheelAndSettle(page);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("the page does not move when the transcript reaches its end", async ({
    page,
  }) => {
    const log = page.locator(".kiro-chat-scroll");
    await log.hover();
    // Well past the transcript's own height, so it bottoms out and, without
    // `overscroll-behavior: contain`, would chain to the document.
    await wheelAndSettle(page, 4000);

    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("the transcript still scrolls internally", async ({ page }) => {
    const log = page.locator(".kiro-chat-scroll");
    await log.evaluate((el) => {
      el.scrollTop = 0;
    });
    await log.hover();
    await wheelAndSettle(page, 300);

    expect(await log.evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test("the page still scrolls when the pointer is outside the chat", async ({
    page,
  }) => {
    // Top-left of the viewport: the panel is anchored bottom-right, and on a
    // phone it is wide enough to sit under a mid-screen pointer.
    await page.mouse.move(40, 120);
    await wheelAndSettle(page);

    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  });
});
