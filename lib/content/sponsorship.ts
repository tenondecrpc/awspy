// Loader for `content/editions/{year}/sponsorship.json` - the prospectus the
// sponsors page renders: why sponsor, what each package costs and includes,
// and what the money pays for. Schema and contract in
// `specs/001-community-day-site/contracts/content-schemas.md`.
//
// Unlike the other edition files this one is optional. An edition that has
// not published a prospectus yet simply has no file, and the sponsors page
// falls back to its "write to us" callout.

import { existsSync } from "node:fs";
import { z } from "zod";
import { editionFile, readJsonOrThrow } from "@/lib/content/_fs";
import { SponsorTierEnum, type SponsorTier } from "@/lib/content/sponsors";

const PackageSchema = z
  .object({
    tier: SponsorTierEnum,
    /** Written as it should read, currency included ("USD 3.000"). */
    price: z.string().min(1),
  })
  .strict();

const BenefitSchema = z
  .object({
    label: z.string().min(1),
    /** The packages that include this benefit. */
    tiers: z.array(SponsorTierEnum).min(1),
  })
  .strict();

const HighlightSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
  })
  .strict();

const ContactSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1).optional(),
  })
  .strict();

export const SponsorshipSchema = z
  .object({
    intro: z.string().min(1),
    /** Why sponsor at all - rendered as cards above the package table. */
    highlights: z.array(HighlightSchema).optional().default([]),
    /** Package columns, in the order they should be displayed. */
    packages: z.array(PackageSchema).optional().default([]),
    /** Comparison rows, in the order they should be displayed. */
    benefits: z.array(BenefitSchema).optional().default([]),
    /** What the sponsorship money is spent on. */
    funds: z.array(z.string().min(1)).optional().default([]),
    contact: ContactSchema.optional(),
  })
  .strict()
  .superRefine((value, ctx) => {
    const offered = new Set(value.packages.map((p) => p.tier));

    value.packages.forEach((p, i) => {
      if (value.packages.filter((o) => o.tier === p.tier).length > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["packages", i, "tier"],
          message: `Package tier "${p.tier}" is duplicated`,
        });
      }
    });

    // A benefit pointing at a tier that is not sold would render a column
    // that does not exist, so it fails the build instead.
    value.benefits.forEach((b, i) => {
      b.tiers.forEach((tier, j) => {
        if (!offered.has(tier)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["benefits", i, "tiers", j],
            message: `Benefit references tier "${tier}", which has no package`,
          });
        }
      });
    });
  });

export type Sponsorship = z.infer<typeof SponsorshipSchema>;
export type SponsorshipPackage = Sponsorship["packages"][number];

/**
 * Read and validate the edition prospectus. Returns `null` when the edition
 * has no `sponsorship.json`; throws when the file exists but is malformed.
 */
export function getSponsorship(year: string): Sponsorship | null {
  const path = editionFile(year, "sponsorship.json");
  if (!existsSync(path)) return null;

  const raw = readJsonOrThrow(path);
  const result = SponsorshipSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid sponsorship.json for edition ${year} at ${path}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return result.data;
}

/** Does `tier` include `benefit`? */
export function tierHasBenefit(
  benefit: Sponsorship["benefits"][number],
  tier: SponsorTier
): boolean {
  return benefit.tiers.includes(tier);
}
