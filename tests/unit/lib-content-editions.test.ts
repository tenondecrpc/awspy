import { afterEach, describe, expect, it } from "vitest";
import {
  currentEdition,
  editionExists,
  getEdition,
  listEditions,
  listPastEditions,
} from "@/lib/content/editions";

const ORIGINAL_CURRENT = process.env.CURRENT_EDITION;

afterEach(() => {
  if (ORIGINAL_CURRENT === undefined) delete process.env.CURRENT_EDITION;
  else process.env.CURRENT_EDITION = ORIGINAL_CURRENT;
});

describe("currentEdition", () => {
  it("defaults to 2026 when CURRENT_EDITION is unset", () => {
    delete process.env.CURRENT_EDITION;
    expect(currentEdition()).toBe("2026");
  });

  it("honors a valid env var", () => {
    process.env.CURRENT_EDITION = "2027";
    expect(currentEdition()).toBe("2027");
  });

  it("throws on a malformed env var", () => {
    process.env.CURRENT_EDITION = "twenty-six";
    expect(() => currentEdition()).toThrow(/4-digit/);
  });
});

describe("listEditions", () => {
  it("returns at least the seeded 2026 directory", () => {
    const editions = listEditions();
    expect(editions).toContain("2026");
    // Sorted descending: the first entry is the most recent year present.
    expect(editions[0] >= editions[editions.length - 1]).toBe(true);
  });

  it("is consistent with editionExists", () => {
    for (const year of listEditions()) {
      expect(editionExists(year)).toBe(true);
    }
  });
});

describe("listPastEditions", () => {
  it("excludes the current edition", () => {
    process.env.CURRENT_EDITION = "2026";
    expect(listPastEditions()).not.toContain("2026");
  });
});

describe("editionExists", () => {
  it("returns true for the seeded edition", () => {
    expect(editionExists("2026")).toBe(true);
  });

  it("returns false for an unknown year", () => {
    expect(editionExists("9999")).toBe(false);
  });

  it("returns false for non-year strings", () => {
    expect(editionExists("foo")).toBe(false);
    expect(editionExists("../etc/passwd")).toBe(false);
  });
});

describe("getEdition", () => {
  it("loads and validates the full 2026 seed", () => {
    const edition = getEdition("2026");
    expect(edition.year).toBe("2026");
    expect(edition.eventInfo.name).toMatch(/AWS Community Day Paraguay/);
    expect(Array.isArray(edition.sponsors)).toBe(true);
    expect(Array.isArray(edition.organizers)).toBe(true);
    expect(Array.isArray(edition.faq)).toBe(true);
    expect(edition.faq.length).toBeGreaterThan(0);
    expect(edition.venue.name.length).toBeGreaterThan(0);
    expect(edition.codeOfConduct.body.length).toBeGreaterThan(0);
  });

  it("throws for a missing edition", () => {
    expect(() => getEdition("9999")).toThrow(/does not exist/);
  });
});
