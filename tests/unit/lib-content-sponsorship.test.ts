import { describe, expect, it } from "vitest";
import { SponsorshipSchema, getSponsorship } from "@/lib/content/sponsorship";

const VALID = {
  intro: "Patrocinar es una oportunidad.",
  packages: [{ tier: "Diamante" }, { tier: "Silver" }],
  benefits: [
    { label: "Logo en el sitio", tiers: ["Diamante", "Silver"] },
    { label: "Charla de 45 min", tiers: ["Diamante"] },
  ],
};

describe("SponsorshipSchema", () => {
  it("accepts a prospectus and defaults the optional lists", () => {
    const parsed = SponsorshipSchema.parse({ intro: "Hola" });
    expect(parsed.highlights).toEqual([]);
    expect(parsed.packages).toEqual([]);
    expect(parsed.benefits).toEqual([]);
    expect(parsed.funds).toEqual([]);
    expect(parsed.notes).toEqual([]);
    expect(parsed.contact).toBeUndefined();
  });

  it("rejects an empty package note", () => {
    const result = SponsorshipSchema.safeParse({ ...VALID, notes: [""] });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["notes", 0]);
  });

  it("rejects a benefit pointing at a tier with no package", () => {
    const result = SponsorshipSchema.safeParse({
      ...VALID,
      benefits: [{ label: "Stand", tiers: ["Gold"] }],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(
      /references tier "Gold", which has no package/
    );
  });

  it("rejects a duplicated package tier", () => {
    const result = SponsorshipSchema.safeParse({
      ...VALID,
      packages: [{ tier: "Gold" }, { tier: "Gold" }],
      benefits: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/is duplicated/);
  });

  it("rejects a package price, so an amount never reaches a page", () => {
    const result = SponsorshipSchema.safeParse({
      ...VALID,
      packages: [{ tier: "Diamante", price: "USD 3.000" }, { tier: "Silver" }],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].path).toEqual(["packages", 0]);
  });

  it("rejects an unknown key", () => {
    const result = SponsorshipSchema.safeParse({ ...VALID, discount: "10%" });
    expect(result.success).toBe(false);
  });

  it("rejects a contact with a malformed email", () => {
    const result = SponsorshipSchema.safeParse({
      ...VALID,
      contact: { name: "Ana", email: "not-an-email" },
    });
    expect(result.success).toBe(false);
  });
});

describe("getSponsorship", () => {
  it("loads the 2026 prospectus with its packages in deck order", () => {
    const sponsorship = getSponsorship("2026");
    expect(sponsorship).not.toBeNull();
    expect(sponsorship?.packages.map((p) => p.tier)).toEqual([
      "Diamante",
      "Platinum",
      "Gold",
      "Silver",
    ]);
  });

  it("reserves only the speaker slot for Diamante", () => {
    const sponsorship = getSponsorship("2026");
    const diamanteOnly = sponsorship?.benefits.filter(
      (b) => b.tiers.length === 1 && b.tiers[0] === "Diamante"
    );
    expect(diamanteOnly).toHaveLength(1);
    expect(diamanteOnly?.[0]?.label).toMatch(/speaker/i);
  });

  it("offers promotional material from the stand once, to every tier", () => {
    const sponsorship = getSponsorship("2026");
    const promotional = sponsorship?.benefits.filter((b) =>
      /material promocional/i.test(b.label)
    );
    expect(promotional).toHaveLength(1);
    expect(promotional?.[0]?.tiers).toEqual([
      "Diamante",
      "Platinum",
      "Gold",
      "Silver",
    ]);
  });

  it("leaves building the stand to the sponsor", () => {
    const sponsorship = getSponsorship("2026");
    expect(sponsorship?.notes.join(" ")).toMatch(
      /estructura y el armado .* a cargo de cada patrocinador/
    );
  });

  it("returns null for an edition with no prospectus", () => {
    expect(getSponsorship("1999")).toBeNull();
  });
});
