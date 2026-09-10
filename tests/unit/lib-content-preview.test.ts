import { afterEach, describe, expect, it, vi } from "vitest";
import { editionFile } from "@/lib/content/_fs";
import { getSponsors } from "@/lib/content/sponsors";
import { getOrganizers } from "@/lib/content/organizers";
import { getVenue } from "@/lib/content/venue";

// `CONTENT_PREVIEW=1` lets a `<name>.example.json` sibling stand in for a
// content file that ships empty, so the sections with no records yet can be
// looked at in development. The guard that matters is the last test in this
// file: a production build must ignore the flag, because the deployed site is
// public and placeholder sponsors must never be reachable from it.

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("editionFile", () => {
  it("resolves the live file when preview mode is off", () => {
    expect(editionFile("2026", "sponsors.json")).toMatch(
      /content\/editions\/2026\/sponsors\.json$/
    );
  });

  it("prefers the example sibling when preview mode is on", () => {
    vi.stubEnv("CONTENT_PREVIEW", "1");
    expect(editionFile("2026", "sponsors.json")).toMatch(
      /content\/editions\/2026\/sponsors\.example\.json$/
    );
  });

  it("falls back to the live file when no example sibling exists", () => {
    vi.stubEnv("CONTENT_PREVIEW", "1");
    expect(editionFile("2026", "faq.json")).toMatch(
      /content\/editions\/2026\/faq\.json$/
    );
  });

  it("ignores a value other than 1", () => {
    vi.stubEnv("CONTENT_PREVIEW", "true");
    expect(editionFile("2026", "sponsors.json")).toMatch(
      /content\/editions\/2026\/sponsors\.json$/
    );
  });

  it("leaves an extensionless name alone", () => {
    vi.stubEnv("CONTENT_PREVIEW", "1");
    expect(editionFile("2026", "LICENSE")).toMatch(
      /content\/editions\/2026\/LICENSE$/
    );
  });

  it("ignores the flag entirely in a production build", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTENT_PREVIEW", "1");
    expect(editionFile("2026", "sponsors.json")).toMatch(
      /content\/editions\/2026\/sponsors\.json$/
    );
  });
});

describe("content loaders in preview mode", () => {
  it("serves the live (empty) records by default", () => {
    expect(getSponsors("2026")).toEqual([]);
    expect(getOrganizers("2026")).toEqual([]);
  });

  it("serves the placeholder records when preview mode is on", () => {
    vi.stubEnv("CONTENT_PREVIEW", "1");

    const sponsors = getSponsors("2026");
    expect(sponsors.length).toBeGreaterThan(0);
    expect(sponsors.map((s) => s.tier)).toContain("Platinum");

    const organizers = getOrganizers("2026");
    expect(organizers.length).toBeGreaterThan(0);
    expect(organizers[0].role).toBeTruthy();

    // The placeholder venue configures a map embed, which the live one does
    // not, so the venue page renders the iframe branch too.
    expect(getVenue("2026").embedMapUrl).toBeTruthy();
  });

  it("keeps placeholder records valid against the real schemas", () => {
    vi.stubEnv("CONTENT_PREVIEW", "1");
    // Each loader throws on schema drift, so reaching this point means the
    // placeholder files satisfy the same contracts as production content.
    expect(() => {
      getSponsors("2026");
      getOrganizers("2026");
      getVenue("2026");
    }).not.toThrow();
  });
});
