# Contract: Sessionize public JSON API

**Feature**: 001-community-day-site
**Consumed by**: `lib/api/sessionize.ts`
**Produced by**: Sessionize (external service)
**Authentication**: none (public read-only API)
**Documentation**: <https://sessionize.com/playbook/developers/api>

This document records the subset of the Sessionize JSON API this site relies on. It is a contract: the site assumes these shapes and validates every payload at the boundary with Zod. Drift in either direction (Sessionize change, organizer config change) MUST be detected at runtime as a parse failure and routed through the empty-state fallback.

## Endpoints

Base URL pattern: `https://sessionize.com/api/v2/{eventId}/view/{viewName}`

| View          | URL                                                                           | Used by                                              |
|---------------|-------------------------------------------------------------------------------|------------------------------------------------------|
| `Speakers`    | `https://sessionize.com/api/v2/{eventId}/view/Speakers`                        | `listSpeakers`, `getSpeakerBySlug`, home preview     |
| `Sessions`    | `https://sessionize.com/api/v2/{eventId}/view/Sessions`                        | `listSessions`, speaker detail (joins by speaker id) |
| `GridSmart`   | `https://sessionize.com/api/v2/{eventId}/view/GridSmart`                       | `getScheduleGrid`, schedule page                     |
| `SpeakerWall` | `https://sessionize.com/api/v2/{eventId}/view/SpeakerWall`                     | Home page preview only (when needed for layout)      |

`{eventId}` is read from `EventInfo.sessionizeEventId` (per-edition). When `sessionizeEventId` is `null` or empty, the site does not call Sessionize at all and renders empty states for the affected sections.

The public Sessionize demo event id `jl4ktls0` is used in tests as a fixture source.

## HTTP semantics

- **Method**: `GET`
- **Headers sent by this site**: `Accept: application/json`
- **Authentication**: none
- **Caching by Sessionize**: ~5 minutes server-side
- **Caching by this site**: `next: { revalidate: 600, tags: [`sessionize:${eventId}`] }` (10 minutes)
- **Expected status codes**:
  - `200 OK`: successful response, JSON body
  - `404 Not Found`: event id is unknown or not yet public; the site treats this as an empty result via `tolerateMissing: true`
  - `5xx`: treated as transient failure; the site treats this as an empty result via `tolerateMissing: true` for v1 to keep pages rendering. Errors are logged via the hosting platform's runtime logs (CloudWatch on AWS Amplify Hosting; per FR-038 we delegate observability to the platform).

## Response shapes

The shapes below are documented as a subset; Sessionize may return additional fields. The Zod schemas use `.passthrough()` where that is safe so unexpected new fields do not fail validation; however, all fields the site actually reads are explicitly validated.

### `Speakers` view

Returns an array of speakers.

```ts
const SpeakerLinkSchema = z.object({
  title: z.string(),
  url: z.string().url(),
  linkType: z.string()
});

const SessionizeSpeakerSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  fullName: z.string().min(1).optional(),
  tagLine: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  profilePicture: z.string().url().optional().nullable(),
  links: z.array(SpeakerLinkSchema).optional().default([]),
  sessions: z.array(z.union([z.string(), z.number()])).optional().default([]),
  isTopSpeaker: z.boolean().optional()
}).passthrough();

const SpeakersListSchema = z.array(SessionizeSpeakerSchema);
```

### `Sessions` view

Returns an array of sessions with embedded references.

```ts
const SessionizeSessionSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  startsAt: z.string().datetime({ offset: true }).optional().nullable(),
  endsAt: z.string().datetime({ offset: true }).optional().nullable(),
  roomId: z.union([z.string(), z.number()]).optional().nullable().transform((v) => v == null ? null : String(v)),
  speakers: z.array(z.object({
    id: z.string().min(1),
    name: z.string().min(1)
  })).optional().default([]),
  categoryItems: z.array(z.union([z.string(), z.number()])).optional().default([]),
  isPlenumSession: z.boolean().optional().default(false)
}).passthrough();

const SessionsListSchema = z.array(SessionizeSessionSchema);
```

### `GridSmart` view

Returns a per-day, per-room nested grid.

```ts
const GridSessionSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  title: z.string().min(1),
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  isPlenumSession: z.boolean().optional().default(false),
  speakers: z.array(z.object({ id: z.string(), name: z.string() })).default([]),
  categoryItems: z.array(z.union([z.string(), z.number()])).optional().default([])
}).passthrough();

const GridRoomSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  name: z.string().min(1),
  sessions: z.array(GridSessionSchema)
});

const GridDaySchema = z.object({
  date: z.string(),                     // YYYY-MM-DD
  rooms: z.array(GridRoomSchema)
});

const ScheduleGridSchema = z.array(GridDaySchema);
```

### `SpeakerWall` view

Returns a flat list of speakers with display metadata. The site uses it only for the home preview when `SpeakersListSchema` is overkill.

```ts
const SpeakerWallSchema = z.array(z.object({
  id: z.string(),
  fullName: z.string(),
  tagLine: z.string().optional().nullable(),
  profilePicture: z.string().url().optional().nullable()
}).passthrough());
```

## Empty/error contract

- Empty event (no accepted speakers): the response is `[]`. Pages must render the appropriate Spanish empty state.
- Unknown event id: 404. The typed client (with `tolerateMissing: true`) returns `[]` (for list endpoints) or `null` (for single-resource endpoints). Pages render empty states.
- Network or 5xx error: the typed client (with `tolerateMissing: true`) returns the same fallback as above.
- Schema drift (Sessionize returns an unexpected shape): the typed client throws unless `tolerateMissing: true` is configured. With `tolerateMissing: true`, the failure is logged via `console.error` and the call returns the empty fallback. With `tolerateMissing: false`, the request fails and `app/error.tsx` takes over.

## Privacy and security notes

- The site exposes only the public Sessionize event id, not any private settings. The `endpoint URL` is not a secret per the playbook.
- The Sessionize playbook recommends keeping endpoint URLs out of public-facing client code only when private custom fields are exposed. For the views above and with default custom-fields-disabled settings, public exposure is the explicit design.
