import { afterEach, beforeEach, describe, expect, it } from "vitest";
import robots from "@/app/robots";

const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
});

afterEach(() => {
  if (ORIGINAL_SITE_URL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL;
});

describe("robots()", () => {
  it("allows every user-agent to crawl every path", () => {
    const r = robots();
    const rules = Array.isArray(r.rules) ? r.rules : [r.rules];
    expect(rules[0].userAgent).toBe("*");
    expect(rules[0].allow).toBe("/");
  });

  it("references the sitemap on the configured site origin", () => {
    const r = robots();
    expect(r.sitemap).toBe("https://example.test/sitemap.xml");
  });

  it("declares the canonical host", () => {
    const r = robots();
    expect(r.host).toBe("https://example.test");
  });
});
