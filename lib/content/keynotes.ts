// Loader for `content/editions/{year}/keynotes.json`.
//
// Optional, like `sponsorship.json`: an edition without the file has no
// keynote section. Keynote speakers are confirmed by the organizers before
// they exist in Sessionize, so their identity and photo are edition content.
// Their LinkedIn link is not: it is read from Sessionize when the same person
// is there (see `lib/utils/keynotes.ts`).

import { existsSync } from "node:fs";
import { z } from "zod";
import { editionFile, readJsonOrThrow } from "@/lib/content/_fs";

export const KeynoteSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    name: z.string().min(1),
    role: z.string().min(1),
    organization: z.string().min(1),
    photo: z
      .string()
      .regex(
        /^\/assets\/keynotes\/[a-z0-9-]+\.(jpg|png)$/,
        "Keynote photos must live under /assets/keynotes/"
      ),
  })
  .strict();

export const KeynotesListSchema = z
  .array(KeynoteSchema)
  .superRefine((arr, ctx) => {
    const seen = new Set<string>();
    arr.forEach((k, i) => {
      if (seen.has(k.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [i, "id"],
          message: `Keynote id "${k.id}" is duplicated`,
        });
      }
      seen.add(k.id);
    });
  });

export type Keynote = z.infer<typeof KeynoteSchema>;

/** The edition's keynote speakers, or `[]` when it has not announced any. */
export function getKeynotes(year: string): Keynote[] {
  const path = editionFile(year, "keynotes.json");
  if (!existsSync(path)) return [];

  const raw = readJsonOrThrow(path);
  const result = KeynotesListSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid keynotes.json for edition ${year} at ${path}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return result.data;
}
