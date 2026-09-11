import { describe, expect, it } from "vitest";
import { SponsorshipSchema, getSponsorship } from "@/lib/content/sponsorship";

const VALID = {
  intro: "Patrocinar es una oportunidad.",
  packages: [
    { tier: "Diamante", price: "USD 3.000" },
    { tier: "Silver", price: "USD 500" },
  ],
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
    expect(parsed.contact).toBeUndefined();
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
      packages: [
        { tier: "Gold", price: "USD 1.000" },
        { tier: "Gold", price: "USD 900" },
      ],
      benefits: [],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/is duplicated/);
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

  it("reserves the speaker slot and the gifts for Diamante", () => {
    const sponsorship = getSponsorship("2026");
    const diamanteOnly = sponsorship?.benefits.filter(
      (b) => b.tiers.length === 1 && b.tiers[0] === "Diamante"
    );
    expect(diamanteOnly).toHaveLength(2);
    expect(diamanteOnly?.map((b) => b.label).join(" ")).toMatch(/speaker/i);
  });

  it("returns null for an edition with no prospectus", () => {
    expect(getSponsorship("1999")).toBeNull();
  });
});
