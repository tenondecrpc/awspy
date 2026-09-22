import { test, expect } from "@playwright/test";

// Phone layout guard. Two failures are invisible from a desktop browser and
// had reached production together:
//
//   1. A `repeat(auto-fit, minmax(<N>px, 1fr))` grid whose px minimum exceeds
//      the column the gutters leave. At 320px the content box is 264px, so any
//      grid asking for 280px or more pushes the whole page sideways.
//   2. A fixed multi-column row with no breakpoint. The agenda rows resolved
//      their title cell to 12px against 100px of text, which paints as
//      overlapping words rather than as a scrollbar.
//
// The first shows up as horizontal page scroll, the second as a box narrower
// than the content it holds, so both checks are needed — neither catches the
// other. `document.body.scrollWidth` is the reading that matters:
// `documentElement.scrollWidth` is inflated by any `overflow-x: auto`
// descendant, such as the sponsor benefits table, which scrolls by design.

const ROUTES = [
  "/",
  "/schedule",
  "/speakers",
  "/sponsors",
  "/team",
  "/venue",
  "/faq",
  "/register",
  "/cfp",
  "/volunteers",
  "/code-of-conduct",
  "/editions",
];

// 320 is the narrowest viewport worth supporting (iPhone SE, a folded Galaxy
// Fold); 390 is the common modern phone.
const VIEWPORTS = [
  { width: 320, height: 720 },
  { width: 390, height: 844 },
];

type Overflow = {
  selector: string;
  box: number;
  content: number;
  text: string;
};

for (const viewport of VIEWPORTS) {
  for (const path of ROUTES) {
    test(`${path} fits a ${viewport.width}px viewport`, async ({ page }) => {
      await page.setViewportSize(viewport);
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);

      const result = await page.evaluate(() => {
        const inScroller = (el: Element) => {
          let ancestor = el.parentElement;
          while (ancestor && ancestor !== document.documentElement) {
            if (
              /(auto|scroll|hidden)/.test(getComputedStyle(ancestor).overflowX)
            )
              return true;
            ancestor = ancestor.parentElement;
          }
          return false;
        };

        const overflowing: Overflow[] = [];
        for (const el of document.querySelectorAll("body *")) {
          const style = getComputedStyle(el);
          if (style.display === "none" || style.visibility === "hidden")
            continue;
          if (/(auto|scroll|hidden)/.test(style.overflowX)) continue;
          if (el.closest("[aria-hidden='true']")) continue;
          if (inScroller(el)) continue;
          const box = el.clientWidth;
          if (box < 8) continue;
          // 15% of slack absorbs sub-pixel rounding and the odd glyph that
          // sits a hair outside its box without being a layout failure.
          if (el.scrollWidth > box * 1.15 + 2) {
            const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
            if (!text) continue;
            const classes = (el.getAttribute("class") ?? "")
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .join(".");
            overflowing.push({
              selector:
                el.tagName.toLowerCase() + (classes ? `.${classes}` : ""),
              box,
              content: el.scrollWidth,
              text: text.slice(0, 40),
            });
          }
        }
        return { bodyWidth: document.body.scrollWidth, overflowing };
      });

      expect(
        result.bodyWidth,
        `${path} scrolls sideways at ${viewport.width}px`
      ).toBeLessThanOrEqual(viewport.width + 1);

      expect(
        result.overflowing,
        `${path} has boxes narrower than their content at ${viewport.width}px:\n` +
          result.overflowing
            .map(
              (o) =>
                `  ${o.selector} box=${o.box}px content=${o.content}px "${o.text}"`
            )
            .join("\n")
      ).toEqual([]);
    });
  }
}
