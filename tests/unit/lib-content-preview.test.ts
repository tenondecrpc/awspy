import { rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { editionDir, editionFile } from "@/lib/content/_fs";
import { getSponsors } from "@/lib/content/sponsors";
import { getOrganizers } from "@/lib/content/organizers";
import { getVenue } from "@/lib/content/venue";

// A `<name>.example.json` sibling stands in for a live content file so a
// section whose real records are not ready yet has something to render. It is
// on by default everywhere - deployed builds included - until
// `CONTENT_PREVIEW=0` switches it off.
//
// No edition ships one any more: every section now has either real content or
// a designed empty state, and sponsors - the last holdout - shows its open
// tiers instead of invented placeholder brands. The substitution itself is
// still live code, so it is covered with a throwaway fixture whose name no
// loader reads.
const FIXTURE_NAME = "preview-fixture.json";
const FIXTURE_EXAMPLE = join(
  editionDir("2026"),
  "preview-fixture.example.json"
);

beforeAll(() => {
  writeFileSync(FIXTURE_EXAMPLE, "[]", "utf8");
});

afterAll(() => {
  rmSync(FIXTURE_EXAMPLE, { force: true });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("editionFile", () => {
  describe("on by default", () => {
    it.each(["development", "production", "test"])(
      "prefers the example sibling with NODE_ENV=%s",
      (nodeEnv) => {
        vi.stubEnv("NODE_ENV", nodeEnv);
        expect(editionFile("2026", FIXTURE_NAME)).toBe(FIXTURE_EXAMPLE);
      }
    );

    it.each(["1", "true"])("stays on when set to %s", (value) => {
      vi.stubEnv("CONTENT_PREVIEW", value);
      expect(editionFile("2026", FIXTURE_NAME)).toBe(FIXTURE_EXAMPLE);
    });
  });

  describe("switched off", () => {
    it.each(["0", "false"])("serves the live file when set to %s", (value) => {
      vi.stubEnv("CONTENT_PREVIEW", value);
      expect(editionFile("2026", FIXTURE_NAME)).toMatch(
        /content\/editions\/2026\/preview-fixture\.json$/
      );
    });

    it("switches off in a production build too", () => {
      vi.stubEnv("NODE_ENV", "production");
      vi.stubEnv("CONTENT_PREVIEW", "0");
      expect(editionFile("2026", FIXTURE_NAME)).toMatch(
        /content\/editions\/2026\/preview-fixture\.json$/
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
  // Every section reads its live file whichever way the flag points, because
  // none of them has a placeholder sibling left.
  describe.each([undefined, "0"])("with CONTENT_PREVIEW=%s", (flag) => {
    beforeEach(() => {
      if (flag !== undefined) vi.stubEnv("CONTENT_PREVIEW", flag);
    });

    it("serves no invented sponsors", () => {
      expect(getSponsors("2026")).toEqual([]);
    });

    it("serves the live organizers", () => {
      const organizers = getOrganizers("2026");
      expect(organizers.length).toBeGreaterThan(0);
      expect(organizers.map((o) => o.name)).toContain("Cristian Paniagua");
      organizers.forEach((o) => expect(o.role).toBeTruthy());
    });

    it("serves the confirmed venue", () => {
      const venue = getVenue("2026");
      expect(venue.name).toMatch(/SNPP/i);
      expect(venue.mapUrl).toBeTruthy();
    });
  });

  it("keeps every record valid against the real schemas", () => {
    // Each loader throws on schema drift, so reaching this point means the
    // shipped content satisfies the same contracts the schemas encode.
    expect(() => {
      getSponsors("2026");
      getOrganizers("2026");
      getVenue("2026");
    }).not.toThrow();
  });
});
