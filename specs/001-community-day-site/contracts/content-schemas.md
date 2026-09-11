# Contract: local content schemas

**Feature**: 001-community-day-site
**Consumed by**: `lib/content/*.ts`
**Produced by**: editorial team via pull request to this repository

This document defines the JSON/MDX shapes under `content/editions/{year}/`. Each shape is validated by a Zod schema in `lib/content/`. Build-time validation is mandatory: a malformed file fails the build (FR-015).

`{year}` is a 4-digit string. Each edition lives in its own folder.

## Directory layout per edition

```
content/editions/{year}/
├── event.json
├── sponsors.json
├── sponsorship.json   (optional)
├── organizers.json
├── faq.json
├── venue.json
└── code-of-conduct.mdx
```

## event.json

The snippets below use `HttpUrlSchema`, `HttpsUrlSchema`, and
`RemoteImageUrlSchema` from `lib/validation/urls.ts`. These policies reject
embedded credentials; the image policy also shares the exact host allowlist
used by `next/image`.

```ts
const SocialSchema = z.object({
  twitter: HttpsUrlSchema.optional(),
  linkedin: HttpsUrlSchema.optional(),
  instagram: HttpsUrlSchema.optional(),
  youtube: HttpsUrlSchema.optional(),
  meetup: HttpsUrlSchema.optional()
}).strict();

const StatusEnum = z.enum(["open", "upcoming", "closed"]);

export const EventInfoSchema = z.object({
  year: z.string().regex(/^\d{4}$/),
  name: z.string().min(1),
  tagline: z.string().min(1),
  heroTitle: z.string().min(1),
  heroSubtitle: z.string().min(1),
  dates: z.object({
    start: z.string().datetime({ offset: true }),
    end: z.string().datetime({ offset: true })
  }),
  location: z.object({
    city: z.string().min(1),
    country: z.string().min(1),
    summary: z.string().min(1)
  }),
  sessionizeEventId: z.string().regex(/^[a-z0-9]+$/i).nullable(),
  eventbriteEventUrl: HttpsUrlSchema.nullable(),
  volunteerRegistrationUrl: HttpsUrlSchema.nullable(),
  volunteerRegistrationStatus: StatusEnum,
  cfpSubmissionUrl: HttpsUrlSchema.nullable(),
  cfpStatus: StatusEnum,
  cfpDeadline: z.string().datetime({ offset: true }).nullable(),
  registrationStatus: StatusEnum,
  contactEmail: z.string().email(),
  social: SocialSchema.optional().default({}),
  // Headline figures the edition expects to reach. Projections, not confirmed
  // counts, so `value` is a string ("200+", "1").
  expectedFigures: z.array(
    z.object({ value: z.string().min(1), label: z.string().min(1) }).strict()
  ).optional().default([]),
  ogImageTitle: z.string().optional(),
  previousEditions: z.array(z.string().regex(/^\d{4}$/)).optional().default([])
}).superRefine((value, ctx) => {
  if (new Date(value.dates.end).getTime() < new Date(value.dates.start).getTime()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["dates", "end"],
      message: "dates.end must be on or after dates.start"
    });
  }
});

export type EventInfo = z.infer<typeof EventInfoSchema>;
```

## sponsors.json

```ts
const SponsorTierEnum = z.enum(["Diamante", "Platinum", "Gold", "Silver", "Bronze", "Community"]);

const ImageRefSchema = z.union([
  RemoteImageUrlSchema,
  z.string().regex(/^\/logos\//, "Repo paths must live under /logos/")
]);

const SponsorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  tier: SponsorTierEnum,
  logo: z.object({
    light: ImageRefSchema,
    dark: ImageRefSchema.optional()
  }),
  url: HttpUrlSchema,
  description: z.string().optional()
});

export const SponsorsListSchema = z.array(SponsorSchema)
  .superRefine((arr, ctx) => {
    const seen = new Set<string>();
    arr.forEach((s, i) => {
      if (seen.has(s.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [i, "id"],
          message: `Sponsor id "${s.id}" is duplicated`
        });
      }
      seen.add(s.id);
    });
  });

export type Sponsor = z.infer<typeof SponsorSchema>;
```

## sponsorship.json

Optional. The prospectus rendered by `/sponsors`: why sponsor, what each
package costs and includes, and what the contribution pays for. An edition
without this file renders the plain contact callout instead.

```ts
export const SponsorshipSchema = z.object({
  intro: z.string().min(1),
  highlights: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(1)
  }).strict()).optional().default([]),
  packages: z.array(z.object({
    tier: SponsorTierEnum,
    price: z.string().min(1)   // written as it reads, e.g. "USD 3.000"
  }).strict()).optional().default([]),
  benefits: z.array(z.object({
    label: z.string().min(1),
    tiers: z.array(SponsorTierEnum).min(1)
  }).strict()).optional().default([]),
  funds: z.array(z.string().min(1)).optional().default([]),
  contact: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1).optional()
  }).strict().optional()
}).strict().superRefine(/* see below */);

export type Sponsorship = z.infer<typeof SponsorshipSchema>;
```

Two integrity rules fail the build rather than rendering a broken table:

- A `tier` may appear in `packages` at most once.
- Every tier named in `benefits[].tiers` MUST have a package in `packages`.

`getSponsorship(year)` returns `null` when the file is absent and throws when
it is present but malformed.

## organizers.json

```ts
const OrganizerLinksSchema = z.object({
  linkedin: HttpsUrlSchema.optional(),
  twitter: HttpsUrlSchema.optional(),
  github: HttpsUrlSchema.optional(),
  website: HttpUrlSchema.optional()
}).strict();

const OrganizerSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  role: z.string().min(1),
  // Optional one-paragraph profile. `role` remains the one-line label.
  bio: z.string().min(1).optional(),
  photo: z.union([
    RemoteImageUrlSchema,
    z.string().regex(/^\/(team)\//, "Repo paths must live under /team/")
  ]).optional(),
  links: OrganizerLinksSchema.optional().default({})
});

export const OrganizersListSchema = z.array(OrganizerSchema)
  .superRefine((arr, ctx) => {
    const seen = new Set<string>();
    arr.forEach((o, i) => {
      if (seen.has(o.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [i, "id"],
          message: `Organizer id "${o.id}" is duplicated`
        });
      }
      seen.add(o.id);
    });
  });

export type Organizer = z.infer<typeof OrganizerSchema>;
```

## faq.json

```ts
const FAQItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  question: z.string().min(1),
  answer: z.string().min(1)
});

export const FAQListSchema = z.array(FAQItemSchema)
  .superRefine((arr, ctx) => {
    const seen = new Set<string>();
    arr.forEach((f, i) => {
      if (seen.has(f.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [i, "id"],
          message: `FAQ id "${f.id}" is duplicated`
        });
      }
      seen.add(f.id);
    });
  });

export type FAQItem = z.infer<typeof FAQItemSchema>;
```

## venue.json

```ts
const TRUSTED_MAP_HOSTS = [
  "google.com",
  "www.google.com",
  "maps.google.com",
  "openstreetmap.org",
  "www.openstreetmap.org"
];

export const VenueSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  mapUrl: HttpUrlSchema,
  embedMapUrl: HttpsUrlSchema.optional(),
  transport: z.array(z.string().min(1)).default([]),
  accessibility: z.array(z.string().min(1)).optional().default([])
}).superRefine((value, ctx) => {
  if (value.embedMapUrl) {
    try {
      const url = new URL(value.embedMapUrl);
      if (!TRUSTED_MAP_HOSTS.includes(url.hostname)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["embedMapUrl"],
          message: `embedMapUrl host "${url.hostname}" is not in the trusted hosts list`
        });
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["embedMapUrl"],
        message: "embedMapUrl is not a valid URL"
      });
    }
  }
});

export type Venue = z.infer<typeof VenueSchema>;
```

## code-of-conduct.mdx

The `.mdx` file extension is retained for the versioned content contract. Its body is rendered as a restricted Markdown subset; embedded JSX, HTML, and executable components are not supported. Optional frontmatter is parsed and validated:

```ts
export const CodeOfConductFrontmatterSchema = z.object({
  lastUpdated: z.string().datetime({ offset: true }).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional()
}).strict();

export type CodeOfConductFrontmatter = z.infer<typeof CodeOfConductFrontmatterSchema>;
```

The source must parse without errors. Unsupported active content is rendered as inert text rather than executed.

## Loader contract

Each loader in `lib/content/` follows the same pattern:

```ts
export function getSponsors(year: string): Sponsor[] {
  const raw = readJsonOrThrow(`content/editions/${year}/sponsors.json`);
  return SponsorsListSchema.parse(raw);
}
```

- Loaders read synchronously at module load (TypeScript-resolved JSON imports) or via a small `readJson(path)` helper that uses `node:fs` at build time.
- Validation failures throw a descriptive `ZodError` referencing the file path and the offending field. The build pipeline must surface this error.
- Loaders are pure functions: same input directory, same output, no side effects.
