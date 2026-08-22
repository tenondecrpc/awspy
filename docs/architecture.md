# Architecture

AWS Community Day Paraguay is a server-rendered, content-driven Next.js site.
It has no application backend, database, or internal administration panel.

Repository rules live in `AGENTS.md`. This document records current project
context and must change when the implemented architecture changes.

## Data ownership

| Data | Source of truth | Boundary |
|---|---|---|
| Event metadata, venue, sponsors, organizers, FAQ | `content/editions/{year}/*.json` | Zod loaders in `lib/content/` |
| Code of conduct | `content/editions/{year}/code-of-conduct.mdx` | MDX loader in `lib/content/` |
| Speakers, sessions, schedule | Public Sessionize API | `lib/api/client.ts` plus `lib/api/sessionize.ts` |
| CFP submissions | Sessionize external page | Public link from edition metadata |
| Attendee registration | Not finalized | Optional Eventbrite link adapter is present but unconfigured |

The site does not persist attendee data. A future flow that requires private
credentials, business rules, or persistence needs a separately approved
backend architecture.

## Rendering and request flow

```text
content JSON/MDX ----> lib/content loaders --+
                                               +--> app page --> template --> UI
Sessionize API ------> lib/api + Zod --------+
```

- Pages under `app/` own data loading.
- Components receive validated data through props and never call `fetch`.
- React Server Components are the default.
- Client Components are limited to interaction that needs browser state.
- Sessionize reads revalidate every 10 minutes and fall back to empty states on
  network or contract failures.
- Local content validation fails loudly during build.

## Component boundaries

Components follow atomic design:

```text
pages -> templates -> organisms -> molecules -> atoms
```

A tier may import its own tier or a lower tier. Pages may also call
`lib/content/` and `lib/api/`; atoms and molecules may not.

## Public routes

The current edition is served at top-level routes such as `/`, `/speakers`,
`/schedule`, `/sponsors`, `/venue`, `/team`, `/faq`, `/code-of-conduct`, `/cfp`,
and `/register`. Edition snapshots are mirrored under `/editions/{year}/`.

Next.js metadata conventions provide `sitemap.xml`, `robots.txt`, and the
dynamic Open Graph image. Canonical URLs and generated share assets derive from
`NEXT_PUBLIC_SITE_URL`.

## Runtime and deployment

- Node.js 24.15.0 is the shared local, CI, and hosting runtime.
- Next.js App Router runs in AWS Amplify Hosting as `WEB_COMPUTE`.
- `main` is the production branch.
- GitHub Actions verifies pull requests and pushes to `main`.
- Amplify runs the same repository-owned `npm run verify` contract before
  publishing `.next`.
- Route 53 owns the public domain. Domain registration status is operationally
  separate from hosted-zone records and the Amplify certificate.

See `docs/deployment.md` for production coordinates and the DNS recovery
runbook.
