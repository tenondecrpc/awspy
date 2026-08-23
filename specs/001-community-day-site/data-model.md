# Phase 1 Data Model: AWS Community Day Paraguay public website

**Feature**: 001-community-day-site
**Date**: 2026-05-23

This document captures every entity the site reads or stores, its source of truth, its fields, validation rules, relationships, and lifecycle notes. Each entity maps to a Zod schema location.

## Entity overview

| Entity              | Source of truth                                            | Schema location                          | Notes                                                                  |
|---------------------|------------------------------------------------------------|------------------------------------------|------------------------------------------------------------------------|
| Edition             | `content/editions/{year}/` directory layout                | `lib/content/editions.ts`                | Aggregates all per-year content; identified by year (4 digits)         |
| EventInfo           | `content/editions/{year}/event.json`                       | `lib/content/event-info.ts`              | One per edition; contains Sessionize/Eventbrite references and status flags  |
| Sponsor             | `content/editions/{year}/sponsors.json`                    | `lib/content/sponsors.ts`                | Array per edition; tier-based grouping                                 |
| Organizer           | `content/editions/{year}/organizers.json`                  | `lib/content/organizers.ts`              | Array per edition                                                      |
| FAQItem             | `content/editions/{year}/faq.json`                         | `lib/content/faq.ts`                     | Array per edition                                                      |
| Venue               | `content/editions/{year}/venue.json`                       | `lib/content/venue.ts`                   | One per edition                                                        |
| CodeOfConduct       | `content/editions/{year}/code-of-conduct.mdx`              | `lib/content/code-of-conduct.ts`         | One MDX file per edition                                               |
| Speaker             | Sessionize `Speakers` view                                 | `lib/api/sessionize.ts` (`SpeakerSchema`)| Read-only; identified by Sessionize `id`; site computes a slug         |
| Session             | Sessionize `Sessions` view                                 | `lib/api/sessionize.ts` (`SessionSchema`)| Read-only; references speakers and rooms                               |
| Room                | Sessionize `Sessions`/`GridSmart` views                    | `lib/api/sessionize.ts` (`RoomSchema`)   | Read-only                                                              |
| ScheduleGrid        | Sessionize `GridSmart` view                                | `lib/api/sessionize.ts` (`GridSchema`)   | Read-only; pre-grouped by day and room                                 |

## Edition

**Source of truth**: presence of a folder named `{year}` under `content/editions/` with the required files.

**Identity**: `year`, a 4-digit string matching `^\d{4}$`.

**Fields** (computed by `getEdition(year)`):
- `year`: 4-digit string
- `eventInfo`: `EventInfo` (validated below)
- `sponsors`: array of `Sponsor`
- `organizers`: array of `Organizer`
- `faq`: array of `FAQItem`
- `venue`: `Venue`
- `codeOfConduct`: validated frontmatter plus Markdown source rendered by the restricted local renderer
- `isCurrent`: boolean derived from `process.env.CURRENT_EDITION`

**Validation rules**:
- The `year` parameter to `getEdition` must satisfy `/^\d{4}$/`.
- The directory `content/editions/{year}` must exist.
- Each required file must exist and parse cleanly through its schema; otherwise the loader throws and the build fails.
- `event.json.year` must match the `year` argument; mismatch throws.

**Relationships**:
- An Edition has one EventInfo, zero-or-more Sponsors, zero-or-more Organizers, zero-or-more FAQItems, one Venue, one CodeOfConduct, and (via Sessionize) zero-or-more Speakers, Sessions, and Rooms.

**Lifecycle**:
- An edition does not transition states explicitly; instead, its EventInfo carries `cfpStatus` and `registrationStatus` flags that drive UX.
- Per FR-035, past editions ignore these flags and always render "Esta edición ya finalizó" on the register and CFP routes.

## EventInfo

**Source of truth**: `content/editions/{year}/event.json`.

**Fields**:
- `year`: 4-digit string (must match the directory name)
- `name`: string, e.g., "AWS Community Day Paraguay 2026"
- `tagline`: string, short marketing tagline shown in hero subtitle
- `heroTitle`: string, the visible H1 on the home page (Spanish copy)
- `heroSubtitle`: string, the visible H2/lead on the home page (Spanish copy)
- `dates`: object with `start` (ISO-8601 datetime in `America/Asuncion`) and `end` (ISO-8601 datetime in `America/Asuncion`); for a single-day event, `start === end` is allowed but the format keeps both keys for forward compatibility
- `location`: object with `city`, `country`, `summary` (one-line, used in metadata and hero)
- `sessionizeEventId`: string or null, the Sessionize event id consumed by `lib/api/sessionize.ts`
- `eventbriteEventUrl`: URL string or null, the public Eventbrite event URL rendered as an external link by `EventbriteRegisterButton`
- `cfpSubmissionUrl`: URL string or null, the Sessionize submission URL used by `SessionizeCFPCallout`
- `cfpStatus`: enum `"open" | "upcoming" | "closed"`
- `cfpDeadline`: ISO-8601 datetime or null
- `registrationStatus`: enum `"open" | "upcoming" | "closed"`
- `contactEmail`: email string, used by sponsor mailto and footer
- `social`: object with optional `twitter`, `linkedin`, `instagram`, `youtube`, `meetup` URLs
- `ogImageTitle`: string optional override for OG image rendering; defaults to `name`
- `previousEditions`: array of strings (years) optional; rendered by `EditionsIndexTemplate` if present

**Validation rules**:
- `year` matches `/^\d{4}$/`
- `dates.start` and `dates.end` are ISO-8601 datetimes parseable by `Date`
- `dates.end` is on or after `dates.start`
- `sessionizeEventId`, when present, matches `/^[a-z0-9]+$/i` (Sessionize uses short alphanumeric ids)
- `eventbriteEventUrl` and `cfpSubmissionUrl`, when present, are valid HTTPS URLs
- `cfpStatus` and `registrationStatus` are constrained to the enums above
- `cfpDeadline`, when present, is an ISO-8601 datetime
- `contactEmail` is a valid email
- `social.*`, when present, are valid HTTPS URLs

**Lifecycle**:
- Status flags (`cfpStatus`, `registrationStatus`) move forward only: `upcoming -> open -> closed`. Editing them is a content change and does not require a code release.

## Sponsor

**Source of truth**: `content/editions/{year}/sponsors.json` (array).

**Fields**:
- `id`: string, kebab-case, unique within the array, used for stable list keys
- `name`: string
- `tier`: enum `"Platinum" | "Gold" | "Silver" | "Bronze" | "Community"`
- `logo`: object with `light` (URL or repo-relative path) and optional `dark` (URL or repo-relative path) for light/dark themes
- `url`: HTTPS URL to the sponsor's website
- `description`: string optional, shown on hover or on a dedicated sponsor page later

**Validation rules**:
- `id` matches `/^[a-z0-9-]+$/`
- `tier` is one of the five enum values
- `logo.light` and `logo.dark` are either an HTTPS URL or a path starting with `/logos/`
- `url` is a valid HTTPS URL

**Relationships**:
- Sponsors have no link to Sessionize. They are purely editorial.

**Lifecycle**:
- Adding/removing/changing a sponsor is a content change. Tier order is fixed and rendered descending by tier value.

## Organizer

**Source of truth**: `content/editions/{year}/organizers.json` (array).

**Fields**:
- `id`: string, kebab-case, unique within the array
- `name`: string
- `role`: string (e.g., "Lead Organizer", "Speakers Coordinator")
- `photo`: optional URL or repo-relative path under `/team/`
- `links`: object with optional `linkedin`, `twitter`, `github`, `website`

**Validation rules**:
- `id` matches `/^[a-z0-9-]+$/`
- Each link, when present, is a valid HTTPS URL

## FAQItem

**Source of truth**: `content/editions/{year}/faq.json` (array).

**Fields**:
- `id`: string, kebab-case, unique within the array
- `question`: string
- `answer`: string (plain text or short Markdown rendered safely)

**Validation rules**:
- `id` matches `/^[a-z0-9-]+$/`
- `question` and `answer` are non-empty strings

**Lifecycle**:
- Items are rendered in the order they appear in the file.

## Venue

**Source of truth**: `content/editions/{year}/venue.json`.

**Fields**:
- `name`: string (e.g., "Asunción Convention Center")
- `address`: string, full postal address
- `mapUrl`: HTTPS URL to a public map page (Google Maps share link is acceptable)
- `embedMapUrl`: HTTPS URL optional, the embeddable iframe URL for an inline map
- `transport`: array of strings, each a transport hint in Spanish (e.g., "Bus línea 35 - parada Av. Mariscal López")
- `accessibility`: array of strings optional, accessibility notes in Spanish

**Validation rules**:
- `name` and `address` are non-empty strings
- `mapUrl` is a valid HTTPS URL
- `embedMapUrl`, when present, is a valid HTTPS URL pointing to a domain we trust (`google.com/maps/embed`, `openstreetmap.org`, etc.); validation list maintained in `lib/content/venue.ts`

## CodeOfConduct

**Source of truth**: `content/editions/{year}/code-of-conduct.mdx`.

**Fields**:
- `body`: validated source rendered through the restricted Markdown renderer in `CodeOfConductTemplate`
- `frontmatter`: optional with `lastUpdated` (ISO date) and `version` (semantic-versioning string)

**Validation rules**:
- Frontmatter and the supported Markdown subset must parse without executing embedded code or components.
- `frontmatter`, when present, is validated by Zod (`lastUpdated` parseable to a Date, `version` matches `/^\d+\.\d+\.\d+$/`).

## Speaker (Sessionize)

**Source of truth**: Sessionize `Speakers` view at `https://sessionize.com/api/v2/{eventId}/view/Speakers`.

**Fields** (subset; full subset captured in `contracts/sessionize-api.md`):
- `id`: string (Sessionize speaker id)
- `firstName`: string
- `lastName`: string
- `fullName`: string (computed if absent)
- `tagline`: string optional
- `bio`: string optional
- `profilePicture`: HTTPS URL optional (typically `https://sessionize.com/image/...`)
- `links`: array of `{ title: string, url: string, linkType: string }` optional (Twitter, LinkedIn, GitHub, blog, etc.)
- `sessions`: array of session ids optional (joined by id with `Session`)
- `slug`: computed by `lib/utils/slug.ts`; deterministic and unique per edition

**Validation rules**:
- `id` is non-empty
- `firstName` and `lastName` are non-empty strings
- `profilePicture`, when present, is a valid HTTPS URL
- Each `links[i].url` is a valid HTTPS URL

**Relationships**:
- Many-to-many with `Session` via session ids.
- Speakers belong to a single Sessionize event id (per edition).

**Lifecycle**:
- A speaker is "accepted" by Sessionize logic. The site reads only accepted speakers (the default behavior of the public view when "Includes sessions" is configured to "Accepted with informed speakers").

## Session (Sessionize)

**Source of truth**: Sessionize `Sessions` view.

**Fields** (subset):
- `id`: string
- `title`: string
- `description`: string optional
- `startsAt`: ISO-8601 datetime
- `endsAt`: ISO-8601 datetime
- `roomId`: string optional
- `speakers`: array of speaker ids

**Validation rules**:
- `id` and `title` are non-empty
- `startsAt` <= `endsAt`
- All ids in `speakers`, when present, are non-empty strings

**Relationships**:
- Many-to-many with `Speaker` via `speakers`.
- Many-to-one with `Room` via `roomId`.

## Room (Sessionize)

**Source of truth**: Sessionize event configuration, surfaced under `Sessions` and `GridSmart` views.

**Fields**:
- `id`: string
- `name`: string
- `sort`: integer optional (display order)

## ScheduleGrid (Sessionize GridSmart)

**Source of truth**: Sessionize `GridSmart` view.

**Shape** (Zod-validated):

```ts
ScheduleGridSchema = z.array(z.object({
  date: z.string(),                   // YYYY-MM-DD in event timezone
  rooms: z.array(z.object({
    id: z.string(),
    name: z.string(),
    sessions: z.array(z.object({
      id: z.string(),
      title: z.string(),
      startsAt: z.string(),
      endsAt: z.string(),
      isPlenumSession: z.boolean().optional(),
      speakers: z.array(z.object({ id: z.string(), name: z.string() })),
      isServiceSession: z.boolean().optional()
    }))
  }))
}))
```

**Notes**:
- Times are ISO-8601 in the event's configured timezone. The site formats them with `Intl.DateTimeFormat({ timeZone: 'America/Asuncion' })` to ensure correct display regardless of the event TZ setting.
- A session marked `isPlenumSession: true` receives a visible plenary badge and shape. Provider duplication and cross-room normalization are not currently modeled; LOGIC-009 tracks that product decision.

## Validation summary

Every entity above maps one-to-one with a Zod schema. The schemas live in their stated `lib/...` files. Inferred TypeScript types (`type Sponsor = z.infer<typeof SponsorSchema>`, etc.) are the only types used by the rest of the codebase, per Principle III.

When a content file fails validation at build time, the failure surfaces as an exception thrown by the loader; this is what the build needs to fail loudly (FR-015). When a Sessionize response fails validation at request time, the typed client throws; the page wrapper converts the failure to an empty-state render via the `tolerateMissing` mechanism (R5). When `tolerateMissing` is `false` (default), the failure propagates and the page falls back to `app/error.tsx`.
