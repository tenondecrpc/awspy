import { describe, expect, it } from "vitest";
import { disambiguateSlugs, slugify } from "@/lib/utils/slug";

describe("slugify", () => {
  it("lowercases and joins words with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("strips diacritics", () => {
    expect(slugify("José María Núñez")).toBe("jose-maria-nunez");
    expect(slugify("Asunción")).toBe("asuncion");
  });

  it("collapses runs of non-alphanumerics", () => {
    expect(slugify("  foo --   bar !!! baz  ")).toBe("foo-bar-baz");
  });

  it("returns an empty string for empty or all-symbol input", () => {
    expect(slugify("")).toBe("");
    expect(slugify("   ")).toBe("");
    expect(slugify("---")).toBe("");
    expect(slugify("!?@")).toBe("");
  });

  it("handles non-string inputs defensively", () => {
    // We treat unexpected runtime input as a programming error caught upstream;
    // the helper still returns an empty string instead of throwing.
    expect(slugify(undefined as unknown as string)).toBe("");
    expect(slugify(null as unknown as string)).toBe("");
  });
});

describe("disambiguateSlugs", () => {
  it("returns the input unchanged when slugs are unique", () => {
    const items = [
      { id: "1", slug: "ana" },
      { id: "2", slug: "beto" },
    ];
    expect(disambiguateSlugs(items)).toEqual(items);
  });

  it("appends -2, -3 on collisions in id order, deterministically", () => {
    const items = [
      { id: "C", slug: "lopez" },
      { id: "A", slug: "lopez" },
      { id: "B", slug: "lopez" },
    ];
    const out = disambiguateSlugs(items);
    // Output order matches input order (positional).
    expect(out.map((i) => i.id)).toEqual(["C", "A", "B"]);
    // But the suffix is decided by id ascending: A keeps `lopez`, B becomes
    // `lopez-2`, C becomes `lopez-3`.
    expect(out.find((i) => i.id === "A")?.slug).toBe("lopez");
    expect(out.find((i) => i.id === "B")?.slug).toBe("lopez-2");
    expect(out.find((i) => i.id === "C")?.slug).toBe("lopez-3");
  });

  it("preserves additional fields on the items", () => {
    const items = [
      { id: "X", slug: "duplicate", extra: 42 },
      { id: "W", slug: "duplicate", extra: 7 },
    ];
    const out = disambiguateSlugs(items);
    expect(out[0]).toMatchObject({ id: "X", slug: "duplicate-2", extra: 42 });
    expect(out[1]).toMatchObject({ id: "W", slug: "duplicate", extra: 7 });
  });

  it("produces stable output when run twice on the same input", () => {
    const items = [
      { id: "z", slug: "doe" },
      { id: "a", slug: "doe" },
      { id: "m", slug: "doe" },
    ];
    expect(disambiguateSlugs(items)).toEqual(disambiguateSlugs(items));
  });

  it("falls back to 'item' when the slug field is empty", () => {
    const items = [
      { id: "1", slug: "" },
      { id: "2", slug: "" },
    ];
    const out = disambiguateSlugs(items);
    expect(out[0].slug).toBe("item");
    expect(out[1].slug).toBe("item-2");
  });

  it("does not collide across distinct base slugs", () => {
    const items = [
      { id: "1", slug: "alice" },
      { id: "2", slug: "alice" },
      { id: "3", slug: "bob" },
      { id: "4", slug: "bob" },
    ];
    const out = disambiguateSlugs(items);
    expect(out.map((i) => i.slug)).toEqual([
      "alice",
      "alice-2",
      "bob",
      "bob-2",
    ]);
  });

  it("handles an empty input array", () => {
    expect(disambiguateSlugs([])).toEqual([]);
  });
});
