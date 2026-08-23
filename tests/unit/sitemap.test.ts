import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/api/sessionize", () => ({
  listSpeakers: vi.fn(async () => [
    {
      id: "speaker-1",
      firstName: "Ada",
      lastName: "Lovelace",
      fullName: "Ada Lovelace",
      slug: "ada-lovelace",
      links: [],
      sessions: [],
    },
  ]),
}));

import sitemap from "@/app/sitemap";
import { listSpeakers } from "@/lib/api/sessionize";

const ORIGINAL_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const ORIGINAL_CURRENT = process.env.CURRENT_EDITION;

beforeEach(() => {
  process.env.NEXT_PUBLIC_SITE_URL = "https://example.test";
  process.env.CURRENT_EDITION = "2026";
});

afterEach(() => {
  if (ORIGINAL_SITE_URL === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
  else process.env.NEXT_PUBLIC_SITE_URL = ORIGINAL_SITE_URL;
  if (ORIGINAL_CURRENT === undefined) delete process.env.CURRENT_EDITION;
  else process.env.CURRENT_EDITION = ORIGINAL_CURRENT;
});

describe("sitemap()", () => {
  it("includes the home and every top-level route", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://example.test/");
    expect(urls).toContain("https://example.test/speakers");
    expect(urls).toContain("https://example.test/schedule");
    expect(urls).toContain("https://example.test/sponsors");
    expect(urls).toContain("https://example.test/venue");
    expect(urls).toContain("https://example.test/team");
    expect(urls).toContain("https://example.test/faq");
    expect(urls).toContain("https://example.test/code-of-conduct");
    expect(urls).toContain("https://example.test/cfp");
    expect(urls).toContain("https://example.test/register");
    expect(urls).toContain("https://example.test/editions");
  });

  it("includes every edition mirror route per existing edition", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://example.test/editions/2026");
    expect(urls).toContain("https://example.test/editions/2026/speakers");
    expect(urls).toContain("https://example.test/editions/2026/schedule");
    expect(urls).toContain("https://example.test/editions/2026/sponsors");
    expect(urls).toContain("https://example.test/editions/2026/venue");
    expect(urls).toContain("https://example.test/editions/2026/team");
    expect(urls).toContain("https://example.test/editions/2026/faq");
    expect(urls).toContain(
      "https://example.test/editions/2026/code-of-conduct"
    );
    expect(urls).toContain("https://example.test/editions/2026/cfp");
    expect(urls).toContain("https://example.test/editions/2026/register");
  });

  it("includes current and edition-scoped speaker detail routes", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(urls).toContain("https://example.test/speakers/ada-lovelace");
    expect(urls).toContain(
      "https://example.test/editions/2026/speakers/ada-lovelace"
    );
  });

  it("keeps static routes when the tolerant speaker source is empty", async () => {
    vi.mocked(listSpeakers).mockResolvedValueOnce([]);

    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain("https://example.test/speakers");
    expect(urls).toContain("https://example.test/editions/2026/speakers");
    expect(urls).not.toContain("https://example.test/speakers/ada-lovelace");
  });

  it("gives the home the highest priority", async () => {
    const entries = await sitemap();
    const home = entries.find((e) => e.url === "https://example.test/");
    expect(home?.priority).toBe(1.0);
  });
});
