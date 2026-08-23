import { describe, expect, it } from "vitest";
import {
  HttpUrlSchema,
  HttpsUrlSchema,
  isSafeMarkdownHref,
} from "@/lib/validation/urls";

describe("URL policies", () => {
  it("allows HTTP and HTTPS navigation URLs", () => {
    expect(HttpUrlSchema.safeParse("http://example.test").success).toBe(true);
    expect(HttpUrlSchema.safeParse("https://example.test").success).toBe(true);
  });

  it("requires HTTPS for protected resource URLs", () => {
    expect(
      HttpsUrlSchema.safeParse("https://example.test/image.png").success
    ).toBe(true);
    expect(
      HttpsUrlSchema.safeParse("http://example.test/image.png").success
    ).toBe(false);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,attack",
    "ftp://example.test/file",
    "//example.test/path",
  ])("rejects unsafe Markdown href %s", (href) => {
    expect(isSafeMarkdownHref(href)).toBe(false);
  });

  it.each([
    "https://example.test",
    "http://example.test",
    "/local",
    "#section",
  ])("allows safe Markdown href %s", (href) => {
    expect(isSafeMarkdownHref(href)).toBe(true);
  });
});
