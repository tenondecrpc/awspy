// Loader for `content/editions/{year}/sponsors.json`. Schema and contract
// in `specs/001-community-day-site/contracts/content-schemas.md`.

import { z } from "zod";
import { editionFile, readJsonOrThrow } from "@/lib/content/_fs";
import { HttpUrlSchema, RemoteImageUrlSchema } from "@/lib/validation/urls";

export const SponsorTierEnum = z.enum([
  "Diamante",
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Community",
]);
export type SponsorTier = z.infer<typeof SponsorTierEnum>;

const ImageRefSchema = z.union([
  RemoteImageUrlSchema,
  z.string().regex(/^\/logos\//, "Repo paths must live under /logos/"),
]);

export const SponsorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  tier: SponsorTierEnum,
  logo: z.object({
    light: ImageRefSchema,
    dark: ImageRefSchema.optional(),
  }),
  url: HttpUrlSchema,
  description: z.string().optional(),
});

export const SponsorsListSchema = z
  .array(SponsorSchema)
  .superRefine((arr, ctx) => {
    const seen = new Set<string>();
    arr.forEach((s, i) => {
      if (seen.has(s.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [i, "id"],
          message: `Sponsor id "${s.id}" is duplicated`,
        });
      }
      seen.add(s.id);
    });
  });

export type Sponsor = z.infer<typeof SponsorSchema>;

export function getSponsors(year: string): Sponsor[] {
  const path = editionFile(year, "sponsors.json");
  const raw = readJsonOrThrow(path);
  const result = SponsorsListSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid sponsors.json for edition ${year} at ${path}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return result.data;
}

const TIER_ORDER: SponsorTier[] = [
  "Diamante",
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Community",
];

/**
 * The priced tiers still taking sponsors, in prospectus order and
 * de-duplicated.
 *
 * Drives the "DISPONIBLE" slots the sponsor boards render. A tier holds
 * several sponsors, so confirming one does not close it: the slot stays on
 * the board next to the logos already signed, which is what keeps the board
 * readable as "these are in, and there is still room". A tier only drops off
 * once its prospectus package declares a `slots` capacity and that many
 * sponsors are confirmed for it. An edition without a prospectus prices no
 * tiers, so it offers no slots.
 */
export function listAvailableTiers(
  packages: Array<{ tier: SponsorTier; slots?: number }>,
  sponsors: Sponsor[]
): SponsorTier[] {
  const confirmed = new Map<SponsorTier, number>();
  for (const s of sponsors) {
    confirmed.set(s.tier, (confirmed.get(s.tier) ?? 0) + 1);
  }
  const seen = new Set<SponsorTier>();
  return packages
    .filter((p) => {
      if (seen.has(p.tier)) return false;
      seen.add(p.tier);
      return p.slots === undefined || (confirmed.get(p.tier) ?? 0) < p.slots;
    })
    .map((p) => p.tier);
}

export function groupSponsorsByTier(
  sponsors: Sponsor[]
): Array<{ tier: SponsorTier; sponsors: Sponsor[] }> {
  return TIER_ORDER.map((tier) => ({
    tier,
    sponsors: sponsors.filter((s) => s.tier === tier),
  })).filter((g) => g.sponsors.length > 0);
}
