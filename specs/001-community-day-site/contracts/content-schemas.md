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
├── organizers.json
├── faq.json
├── venue.json
└── code-of-conduct.mdx
```

## event.json

```ts
const SocialSchema = z.object({
  twitter: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
  meetup: z.string().url().optional()
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
  eventbriteEventUrl: z.string().url().nullable(),
  cfpSubmissionUrl: z.string().url().nullable(),
  cfpStatus: StatusEnum,
  cfpDeadline: z.string().datetime({ offset: true }).nullable(),
  registrationStatus: StatusEnum,
  contactEmail: z.string().email(),
  social: SocialSchema.optional().default({}),
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
const SponsorTierEnum = z.enum(["Platinum", "Gold", "Silver", "Bronze", "Community"]);

const ImageRefSchema = z.union([
  z.string().url(),
  z.string().regex(/^\/(logos|public\/logos)\//, "Repo paths must live under /logos/")
]);

const SponsorSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  tier: SponsorTierEnum,
  logo: z.object({
    light: ImageRefSchema,
    dark: ImageRefSchema.optional()
  }),
  url: z.string().url(),
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

## organizers.json

```ts
const OrganizerLinksSchema = z.object({
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  github: z.string().url().optional(),
  website: z.string().url().optional()
}).strict();

const OrganizerSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  role: z.string().min(1),
  photo: z.union([
    z.string().url(),
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
  mapUrl: z.string().url(),
  embedMapUrl: z.string().url().optional(),
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

The MDX file is rendered as Markdown plus optional embedded React components (none expected for v1). Optional frontmatter is parsed and validated:

```ts
export const CodeOfConductFrontmatterSchema = z.object({
  lastUpdated: z.string().datetime({ offset: true }).optional(),
  version: z.string().regex(/^\d+\.\d+\.\d+$/).optional()
}).strict();

export type CodeOfConductFrontmatter = z.infer<typeof CodeOfConductFrontmatterSchema>;
```

The MDX body must compile without errors. Compilation failure surfaces as a build failure.

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
