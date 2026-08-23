// Loader for `content/editions/{year}/sponsors.json`. Schema and contract
// in `specs/001-community-day-site/contracts/content-schemas.md`.

import { z } from "zod";
import { join } from "node:path";
import { editionDir, readJsonOrThrow } from "@/lib/content/_fs";
import { HttpUrlSchema, RemoteImageUrlSchema } from "@/lib/validation/urls";

export const SponsorTierEnum = z.enum([
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
  const path = join(editionDir(year), "sponsors.json");
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
  "Platinum",
  "Gold",
  "Silver",
  "Bronze",
  "Community",
];

export function groupSponsorsByTier(
  sponsors: Sponsor[]
): Array<{ tier: SponsorTier; sponsors: Sponsor[] }> {
  return TIER_ORDER.map((tier) => ({
    tier,
    sponsors: sponsors.filter((s) => s.tier === tier),
  })).filter((g) => g.sponsors.length > 0);
}
