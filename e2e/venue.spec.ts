import { expect, test } from "@playwright/test";

test.describe("/venue", () => {
  test("shows the whole facade photo, without cropping it", async ({
    page,
  }) => {
    await page.goto("/venue");

    const photo = page.getByRole("img", { name: /^Fachada de / });
    await photo.scrollIntoViewIfNeeded();
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => img.naturalWidth))
      .toBeGreaterThan(0);

    // The optimizer keeps the source ratio in every width it serves, so the
    // loaded file's ratio is the photo's. A frame with another ratio crops it.
    const { frameRatio, photoRatio } = await photo.evaluate(
      (img: HTMLImageElement) => {
        const box = img.parentElement!.getBoundingClientRect();
        return {
          frameRatio: box.width / box.height,
          photoRatio: img.naturalWidth / img.naturalHeight,
        };
      }
    );
    expect(Math.abs(frameRatio - photoRatio) / photoRatio).toBeLessThan(0.01);
  });
});
