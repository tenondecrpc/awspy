# AWS Community Day Paraguay

Public website for AWS Community Day Paraguay. The application is a Next.js
App Router site with version-controlled event content and public Sessionize
data.

## Production

- Public URL: <https://awscommunitydayparaguay.com>
- AWS Amplify app: `d2dgeqbarexvjr`
- Region: `us-east-1`
- Production branch: `main`
- Amplify fallback URL: <https://main.d2dgeqbarexvjr.amplifyapp.com>

Deployment and domain recovery procedures live in
[`docs/deployment.md`](docs/deployment.md).

The documentation index is [`docs/README.md`](docs/README.md). It links the
architecture, CI contract, ADRs, and documented exceptions.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Zod 4 at content and API boundaries
- TanStack Query and Zustand, available for future interactive state needs
- Vitest, React Testing Library, and Playwright

The repository does not contain a backend or database. Event metadata,
sponsors, organizers, venue details, FAQ content, and the code of conduct live
under `content/editions/{year}/`. Speakers, schedule, and CFP management come
from Sessionize.

The attendee registration provider is not finalized. The current code supports
an optional external Eventbrite link, but the 2026 edition leaves it unset. If
another provider is selected, update the Eventbrite-specific schema and
component names before opening registration.

## Local setup

Requirements:

- Node.js 24.x
- npm 10.x or newer

```sh
npm install
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

## Environment

| Variable | Required | Purpose |
|---|---:|---|
| `CURRENT_EDITION` | yes | Four-digit edition served from the top-level routes. |
| `NEXT_PUBLIC_SITE_URL` | yes in production | Absolute public origin used by canonical URLs, sitemap, robots, Open Graph, and JSON-LD. |
| `NEXT_PUBLIC_SESSIONIZE_BASE_URL` | no | Sessionize API override for tests or local fixtures. |

Use `http://localhost:3000` for local development and
`https://awscommunitydayparaguay.com` in production.

## Commands

```sh
npm run dev
npm run lint
npm run typecheck
npm test
npm run e2e
npm run build
npm run verify
npm start
```

## Content workflow

- Edit local event content under `content/editions/{year}/`.
- Publish speakers, schedule, and CFP changes in Sessionize.
- Keep `eventbriteEventUrl` unset and `registrationStatus` set to `upcoming`
  until the attendee registration provider is selected.
- Run lint, type checking, tests, and a production build before release.

See [`specs/001-community-day-site/quickstart.md`](specs/001-community-day-site/quickstart.md)
for the complete editorial and new-edition workflow.

## Architecture

React components follow atomic design under `components/`. Pages own data
loading, `lib/content/` validates local content, and `lib/api/` is the only
boundary for external HTTP data. See [`AGENTS.md`](AGENTS.md) for repository
rules and verification requirements.
