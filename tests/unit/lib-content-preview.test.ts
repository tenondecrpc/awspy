import { afterEach, describe, expect, it, vi } from "vitest";
import { editionFile } from "@/lib/content/_fs";
import { getSponsors } from "@/lib/content/sponsors";
import { getOrganizers } from "@/lib/content/organizers";
import { getVenue } from "@/lib/content/venue";

// A `<name>.example.json` sibling stands in for a live content file so the
// sections whose real records are not ready yet have something to render.
// It is on by default everywhere - deployed builds included - until
// `CONTENT_PREVIEW=0` switches it off.

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("editionFile", () => {
  describe("on by default", () => {
    it.each(["development", "production", "test"])(
      "prefers the example sibling with NODE_ENV=%s",
      (nodeEnv) => {
        vi.stubEnv("NODE_ENV", nodeEnv);
        expect(editionFile("2026", "sponsors.json")).toMatch(
          /content\/editions\/2026\/sponsors\.example\.json$/
        );
      }
    );

    it.each(["1", "true"])("stays on when set to %s", (value) => {
      vi.stubEnv("CONTENT_PREVIEW", value);
      expect(editionFile("2026", "sponsors.json")).toMatch(
        /content\/editions\/2026\/sponsors\.example\.json$/
      );
    });
  });

  describe("switched off", () => {
    it.each(["0", "false"])("serves the live file when set to %s", (value) => {
      vi.stubEnv("CONTENT_PREVIEW", value);
      expect(editionFile("2026", "sponsors.json")).toMatch(
        /content\/editions\/2026\/sponsors\.json$/
      );
    });

    it("switches off in a production build too", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("CONTENT_PREVIEW", "0");
      expect(editionFile("2026", "sponsors.json")).toMatch(
        /content\/editions\/2026\/sponsors\.json$/
      );
    });
  });

  describe("resolution", () => {
    it("falls back to the live file when no example sibling exists", () => {
      expect(editionFile("2026", "faq.json")).toMatch(
        /content\/editions\/2026\/faq\.json$/
      );
    });

    it("leaves an extensionless name alone", () => {
      expect(editionFile("2026", "LICENSE")).toMatch(
        /content\/editions\/2026\/LICENSE$/
      );
    });
  });
});

describe("content loaders", () => {
  it("serves the placeholder records by default", () => {
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

  it("serves the live records once switched off", () => {
    vi.stubEnv("CONTENT_PREVIEW", "0");
    expect(getSponsors("2026")).toEqual([]);
    expect(getOrganizers("2026")).toEqual([]);
    expect(getVenue("2026").embedMapUrl).toBeUndefined();
  });

  it("keeps placeholder records valid against the real schemas", () => {
    // Each loader throws on schema drift, so reaching this point means the
    // placeholder files satisfy the same contracts as production content.
    expect(() => {
      getSponsors("2026");
      getOrganizers("2026");
      getVenue("2026");
    }).not.toThrow();
  });
});
