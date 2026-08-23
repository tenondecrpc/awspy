import { describe, expect, it } from "vitest";
import {
  HttpUrlSchema,
  HttpsUrlSchema,
  RemoteImageUrlSchema,
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

  it("rejects embedded credentials from every web URL policy", () => {
    const credentialUrl = new URL("https://example.test/path");
    credentialUrl.username = "user";
    credentialUrl.password = "pass";
    const value = credentialUrl.toString();

    expect(HttpUrlSchema.safeParse(value).success).toBe(false);
    expect(HttpsUrlSchema.safeParse(value).success).toBe(false);
    expect(RemoteImageUrlSchema.safeParse(value).success).toBe(false);
    expect(isSafeMarkdownHref(value)).toBe(false);
  });

  it.each([
    "https://sessionize.com/image/speaker.jpg",
    "https://img.evbuc.com/banner.png",
    "https://cdn.evbuc.com/logo.svg",
  ])("allows configured remote image host %s", (url) => {
    expect(RemoteImageUrlSchema.safeParse(url).success).toBe(true);
  });

  it("rejects an HTTPS image host that Next Image cannot optimize", () => {
    expect(
      RemoteImageUrlSchema.safeParse("https://images.example.test/logo.svg")
        .success
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
