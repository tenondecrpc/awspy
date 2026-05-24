// Loader for `content/editions/{year}/organizers.json`.

import { z } from "zod";
import { join } from "node:path";
import { editionDir, readJsonOrThrow } from "@/lib/content/_fs";

const OrganizerLinksSchema = z
  .object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    github: z.string().url().optional(),
    website: z.string().url().optional(),
  })
  .strict();

export const OrganizerSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  role: z.string().min(1),
  photo: z
    .union([
      z.string().url(),
      z.string().regex(/^\/(team)\//, "Repo paths must live under /team/"),
    ])
    .optional(),
  links: OrganizerLinksSchema.optional().default({}),
});

export const OrganizersListSchema = z
  .array(OrganizerSchema)
  .superRefine((arr, ctx) => {
    const seen = new Set<string>();
    arr.forEach((o, i) => {
      if (seen.has(o.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [i, "id"],
          message: `Organizer id "${o.id}" is duplicated`,
        });
      }
      seen.add(o.id);
    });
  });

export type Organizer = z.infer<typeof OrganizerSchema>;

export function getOrganizers(year: string): Organizer[] {
  const path = join(editionDir(year), "organizers.json");
  const raw = readJsonOrThrow(path);
  const result = OrganizersListSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid organizers.json for edition ${year} at ${path}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return result.data;
}
