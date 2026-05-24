// Loader for `content/editions/{year}/venue.json`. The `embedMapUrl` host is
// constrained to a small allowlist to avoid embedding arbitrary third-party
// iframes.

import { z } from "zod";
import { join } from "node:path";
import { editionDir, readJsonOrThrow } from "@/lib/content/_fs";

const TRUSTED_MAP_HOSTS = [
  "google.com",
  "www.google.com",
  "maps.google.com",
  "openstreetmap.org",
  "www.openstreetmap.org",
] as const;

export const VenueSchema = z
  .object({
    name: z.string().min(1),
    address: z.string().min(1),
    mapUrl: z.string().url(),
    embedMapUrl: z.string().url().optional(),
    transport: z.array(z.string().min(1)).default([]),
    accessibility: z.array(z.string().min(1)).optional().default([]),
  })
  .superRefine((value, ctx) => {
    if (!value.embedMapUrl) return;
    let url: URL;
    try {
      url = new URL(value.embedMapUrl);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["embedMapUrl"],
        message: "embedMapUrl is not a valid URL",
      });
      return;
    }
    if (!TRUSTED_MAP_HOSTS.includes(url.hostname as (typeof TRUSTED_MAP_HOSTS)[number])) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["embedMapUrl"],
        message: `embedMapUrl host "${url.hostname}" is not in the trusted hosts list`,
      });
    }
  });

export type Venue = z.infer<typeof VenueSchema>;

export function getVenue(year: string): Venue {
  const path = join(editionDir(year), "venue.json");
  const raw = readJsonOrThrow(path);
  const result = VenueSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid venue.json for edition ${year} at ${path}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return result.data;
}
