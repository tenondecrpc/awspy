// Sessionize public JSON API client.
//
// See `specs/001-community-day-site/contracts/sessionize-api.md` for the
// contract. The schemas in this file match the actual demo event response
// (`https://sessionize.com/api/v2/jl4ktls0/view/{view}`); permissive
// `.passthrough()` is used so unexpected new top-level fields do not fail
// validation. All inbound payloads still validate the fields the site
// actually reads.

import { z } from "zod";
import { apiFetch } from "@/lib/api/client";
import { disambiguateSlugs, slugify } from "@/lib/utils/slug";
import { HttpUrlSchema, RemoteImageUrlSchema } from "@/lib/validation/urls";

const DEFAULT_SESSIONIZE_BASE_URL = "https://sessionize.com/api/v2";

export function normalizeSessionizeBaseUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Sessionize base URL must be an absolute HTTP(S) URL");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Sessionize base URL must be an absolute HTTP(S) URL");
  }
  if (url.username || url.password) {
    throw new Error("Sessionize base URL must not contain credentials");
  }
  const parsed = HttpUrlSchema.safeParse(value);
  if (!parsed.success) {
    throw new Error("Sessionize base URL must be an absolute HTTP(S) URL");
  }
  const isLoopback = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (url.protocol !== "https:" && !isLoopback) {
    throw new Error("Sessionize base URL must use HTTPS outside loopback");
  }
  return value.replace(/\/$/, "");
}

const SESSIONIZE_BASE_URL = normalizeSessionizeBaseUrl(
  process.env.NEXT_PUBLIC_SESSIONIZE_BASE_URL ?? DEFAULT_SESSIONIZE_BASE_URL
);

// ---------- Speakers view ----------

const SpeakerLinkSchema = z.object({
  title: z.string(),
  url: HttpUrlSchema,
  linkType: z.string(),
});

const SpeakerSessionRefSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().optional(),
});

export const SessionizeSpeakerSchema = z
  .object({
    id: z.string().min(1),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    fullName: z.string().min(1).optional(),
    tagLine: z.string().optional().nullable(),
    bio: z.string().optional().nullable(),
    profilePicture: RemoteImageUrlSchema.optional().nullable(),
    links: z.array(SpeakerLinkSchema).optional().default([]),
    sessions: z.array(SpeakerSessionRefSchema).optional().default([]),
    isTopSpeaker: z.boolean().optional(),
  })
  .passthrough();

export const SpeakersListSchema = z.array(SessionizeSpeakerSchema);
export type SessionizeSpeaker = z.infer<typeof SessionizeSpeakerSchema>;

/** Speaker enriched with a deterministic slug, ready for the site. */
export type Speaker = SessionizeSpeaker & {
  slug: string;
  fullName: string;
};

// ---------- Sessions view (grouped) ----------

const SessionizeSpeakerRefSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});

export const SessionizeSessionSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    startsAt: z.string().datetime({ offset: true }).optional().nullable(),
    endsAt: z.string().datetime({ offset: true }).optional().nullable(),
    roomId: z
      .union([z.string(), z.number()])
      .optional()
      .nullable()
      .transform((v) => (v == null ? null : String(v))),
    speakers: z.array(SessionizeSpeakerRefSchema).optional().default([]),
    isPlenumSession: z.boolean().optional().default(false),
    isServiceSession: z.boolean().optional().default(false),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (!value.startsAt || !value.endsAt) return;
    if (new Date(value.endsAt).getTime() < new Date(value.startsAt).getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "endsAt must be on or after startsAt",
      });
    }
  });

const SessionGroupSchema = z
  .object({
    groupId: z.union([z.string(), z.number()]).optional(),
    groupName: z.string().optional().nullable(),
    sessions: z.array(SessionizeSessionSchema),
  })
  .passthrough();

/**
 * The Sessions view is grouped by category (`groupId` + `groupName`).
 * `listSessions` flattens this server response into a single array.
 */
export const SessionsListSchema = z.array(SessionGroupSchema);
export type SessionizeSession = z.infer<typeof SessionizeSessionSchema>;

// ---------- GridSmart view ----------

const GridSessionSchema = z
  .object({
    id: z.union([z.string(), z.number()]).transform(String),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    startsAt: z.string().datetime({ offset: true }),
    endsAt: z.string().datetime({ offset: true }),
    isPlenumSession: z.boolean().optional().default(false),
    isServiceSession: z.boolean().optional().default(false),
    speakers: z
      .array(
        z.object({
          id: z.string().min(1),
          name: z.string().min(1),
        })
      )
      .optional()
      .default([]),
  })
  .passthrough()
  .superRefine((value, ctx) => {
    if (new Date(value.endsAt).getTime() < new Date(value.startsAt).getTime()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "endsAt must be on or after startsAt",
      });
    }
  });

const GridRoomSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().min(1),
  sessions: z.array(GridSessionSchema),
});

const GridDaySchema = z.object({
  date: z.string().min(1),
  rooms: z.array(GridRoomSchema),
});

export const ScheduleGridSchema = z.array(GridDaySchema);
export type ScheduleGrid = z.infer<typeof ScheduleGridSchema>;

// ---------- SpeakerWall view ----------

export const SpeakerWallSchema = z.array(
  z
    .object({
      id: z.string(),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      fullName: z.string(),
      tagLine: z.string().optional().nullable(),
      profilePicture: RemoteImageUrlSchema.optional().nullable(),
      isTopSpeaker: z.boolean().optional(),
    })
    .passthrough()
);
export type SpeakerWallItem = z.infer<typeof SpeakerWallSchema>[number];

// ---------- URL builder ----------

export type SessionizeView =
  "Speakers" | "Sessions" | "GridSmart" | "SpeakerWall";

export function buildSessionizeUrl(
  eventId: string,
  view: SessionizeView
): string {
  return `${SESSIONIZE_BASE_URL}/${encodeURIComponent(eventId)}/view/${view}`;
}

// ---------- Public API ----------

const NEXT_OPTS = (eventId: string) => ({
  revalidate: 600,
  tags: [`sessionize:${eventId}`],
});

function deriveFullName(s: SessionizeSpeaker): string {
  if (s.fullName && s.fullName.trim().length > 0) return s.fullName;
  return `${s.firstName} ${s.lastName}`.trim();
}

/**
 * Decorates raw Sessionize speakers with a deterministic, collision-free slug.
 */
export function attachSpeakerSlugs(speakers: SessionizeSpeaker[]): Speaker[] {
  const withBaseSlug = speakers.map((s) => ({
    ...s,
    fullName: deriveFullName(s),
    slug: slugify(deriveFullName(s)),
  }));
  return disambiguateSlugs(withBaseSlug) as Speaker[];
}

export async function listSpeakers(eventId: string | null): Promise<Speaker[]> {
  if (!eventId) return [];
  const raw = await apiFetch(buildSessionizeUrl(eventId, "Speakers"), {
    method: "GET",
    schema: SpeakersListSchema,
    tolerateMissing: true,
    fallback: [] as SessionizeSpeaker[],
    next: NEXT_OPTS(eventId),
  });
  return attachSpeakerSlugs(raw);
}

export async function getSpeakerBySlug(
  eventId: string | null,
  slug: string
): Promise<Speaker | null> {
  const speakers = await listSpeakers(eventId);
  return speakers.find((s) => s.slug === slug) ?? null;
}

export async function listSessions(
  eventId: string | null
): Promise<SessionizeSession[]> {
  if (!eventId) return [];
  const groups = await apiFetch(buildSessionizeUrl(eventId, "Sessions"), {
    method: "GET",
    schema: SessionsListSchema,
    tolerateMissing: true,
    fallback: [],
    next: NEXT_OPTS(eventId),
  });
  return groups.flatMap((g) => g.sessions);
}

export async function getScheduleGrid(
  eventId: string | null
): Promise<ScheduleGrid> {
  if (!eventId) return [];
  return apiFetch(buildSessionizeUrl(eventId, "GridSmart"), {
    method: "GET",
    schema: ScheduleGridSchema,
    tolerateMissing: true,
    fallback: [] as ScheduleGrid,
    next: NEXT_OPTS(eventId),
  });
}

export async function getSpeakerWall(
  eventId: string | null
): Promise<SpeakerWallItem[]> {
  if (!eventId) return [];
  return apiFetch(buildSessionizeUrl(eventId, "SpeakerWall"), {
    method: "GET",
    schema: SpeakerWallSchema,
    tolerateMissing: true,
    fallback: [] as SpeakerWallItem[],
    next: NEXT_OPTS(eventId),
  });
}
