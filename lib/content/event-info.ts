// Loader for `content/editions/{year}/event.json`. See
// `specs/001-community-day-site/contracts/content-schemas.md` for the full
// contract. The schema enforces structural validity at build time; semantic
// validity (e.g. valid Eventbrite URL) is checked by downstream consumers.

import { z } from "zod";
import { editionDir, readJsonOrThrow } from "@/lib/content/_fs";
import { join } from "node:path";

const SocialSchema = z
  .object({
    twitter: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
    meetup: z.string().url().optional(),
  })
  .strict();

const StatusEnum = z.enum(["open", "upcoming", "closed"]);

export const EventInfoSchema = z
  .object({
    year: z.string().regex(/^\d{4}$/),
    name: z.string().min(1),
    tagline: z.string().min(1),
    heroTitle: z.string().min(1),
    heroSubtitle: z.string().min(1),
    dates: z.object({
      start: z.string().datetime({ offset: true }),
      end: z.string().datetime({ offset: true }),
    }),
    location: z.object({
      city: z.string().min(1),
      country: z.string().min(1),
      summary: z.string().min(1),
    }),
    sessionizeEventId: z
      .string()
      .regex(/^[a-z0-9]+$/i)
      .nullable(),
    eventbriteEventUrl: z.string().url().nullable(),
    cfpSubmissionUrl: z.string().url().nullable(),
    cfpStatus: StatusEnum,
    cfpDeadline: z.string().datetime({ offset: true }).nullable(),
    registrationStatus: StatusEnum,
    contactEmail: z.string().email(),
    social: SocialSchema.optional().default({}),
    ogImageTitle: z.string().optional(),
    previousEditions: z
      .array(z.string().regex(/^\d{4}$/))
      .optional()
      .default([]),
  })
  .superRefine((value, ctx) => {
    const start = new Date(value.dates.start).getTime();
    const end = new Date(value.dates.end).getTime();
    if (Number.isFinite(start) && Number.isFinite(end) && end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dates", "end"],
        message: "dates.end must be on or after dates.start",
      });
    }
  });

export type EventInfo = z.infer<typeof EventInfoSchema>;

/**
 * Read and validate `content/editions/{year}/event.json`. Throws a
 * descriptive `ZodError`-derived `Error` if validation fails.
 */
export function getEventInfo(year: string): EventInfo {
  const path = join(editionDir(year), "event.json");
  const raw = readJsonOrThrow(path);
  const result = EventInfoSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(
      `Invalid event.json for edition ${year} at ${path}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  // Cross-check that the directory year matches the value declared in the file.
  if (result.data.year !== year) {
    throw new Error(
      `event.json year "${result.data.year}" does not match directory "${year}" (${path})`
    );
  }
  return result.data;
}
