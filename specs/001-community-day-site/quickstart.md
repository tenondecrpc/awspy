# Quickstart: AWS Community Day Paraguay public website

**Feature**: 001-community-day-site

This is the from-zero guide for a new contributor or organizer working on the AWS Community Day Paraguay site. It covers the local setup, the editorial workflow for content updates, and how to add a new edition or switch the current edition.

## Prerequisites

- Node.js 24.15.0
- npm 10.x or newer
- Git

## First-time setup

1. Clone the repository and switch to the feature branch:

   ```sh
   git clone <repo-url> awspy
   cd awspy
   git checkout 001-community-day-site
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Copy the environment example and fill in the local values:

   ```sh
   cp .env.example .env.local
   ```

   Required keys for local development:

   - `CURRENT_EDITION`: 4-digit year of the active edition (e.g., `2026`).
   - `NEXT_PUBLIC_SITE_URL`: full URL the site will be served from in production (for this project, `https://awscommunitydayparaguay.com`). Use `http://localhost:3000` in `.env.local`. The value controls canonical URLs, sitemap, robots, OG images, and JSON-LD.

   Optional keys:

   - `NEXT_PUBLIC_SESSIONIZE_BASE_URL`: override the Sessionize base URL (defaults to `https://sessionize.com/api/v2`). Used when running offline tests against a local fixture server.

4. Start the dev server:

   ```sh
   npm run dev
   ```

   Open `http://localhost:3000`. With the included placeholder content under `content/editions/2026/`, the home renders the hero, the countdown, and Spanish empty states for the dynamic sections.

5. Run the test suites:

   ```sh
   npm run lint
   npm run typecheck
   npm test
   npm run e2e   # starts the dev server automatically
   ```

## Editorial workflow

All editorial changes flow through a pull request to this repository. There is no admin panel.

### Update sponsors

1. Edit `content/editions/{year}/sponsors.json`. Each entry follows the schema in `contracts/content-schemas.md`:

   ```json
   {
     "id": "acme-corp",
     "name": "Acme Corp",
     "tier": "Gold",
     "logo": { "light": "/logos/acme-light.svg", "dark": "/logos/acme-dark.svg" },
     "url": "https://acme.example"
   }
   ```

2. If the logo lives in the repo, place it under `public/logos/` and reference it as `/logos/<filename>`. External images must use a host declared in `lib/config/image-hosts.ts`; adding a host requires schema, Next Image, and security review.
3. Run `npm test` to validate the new entry against the schema.
4. Open a PR. After merge, the configured hosting platform deploys automatically. AWS Amplify Hosting is the primary target for v1; see `docs/deployment.md` for the platform-specific notes.

### Update organizers, FAQ, venue, code of conduct

Same pattern as sponsors: edit the corresponding file under `content/editions/{year}/`, run the tests, open a PR.

### Update the event date, hero copy, status flags

Edit `content/editions/{year}/event.json`. The `cfpStatus` and `registrationStatus` fields drive the UX on `/cfp` and `/register`. Allowed values: `"open"`, `"upcoming"`, `"closed"`.

Sessionize is the primary platform for speakers, schedule, and CFP management.
The attendee registration provider is not finalized for the 2026 edition. The
current implementation supports an optional external Eventbrite URL, but keep
`eventbriteEventUrl` set to `null` and `registrationStatus` set to `"upcoming"`
until the provider is selected. Choosing a non-Eventbrite provider requires a
small code and schema rename because the current boundary is
Eventbrite-specific.

### Add or update speakers, sessions, schedule

Speakers, sessions, and the schedule are sourced from Sessionize. Editing them happens in the Sessionize dashboard, not in this repo. Once a change is published in Sessionize:

- The site picks it up within `next.revalidate` (10 minutes by default).
- A manual purge can be triggered by re-deploying through the hosting platform (Amplify Console -> branch -> Redeploy this version) or by hitting `revalidateTag` from a server action that the editorial team can call manually.

If Sessionize changes its public response shape, tolerant list reads fall back to empty states. The current client does not emit custom failure telemetry; sanitized provider observability is tracked as future operational work.

## Adding a new edition

To introduce edition `{Y+1}` (for example, `2027`):

1. Create the directory:

   ```sh
   mkdir -p content/editions/2027
   ```

2. Add the six required files. The fastest way is to copy the previous edition and edit:

   ```sh
   cp content/editions/2026/event.json content/editions/2027/event.json
   cp content/editions/2026/sponsors.json content/editions/2027/sponsors.json
   cp content/editions/2026/organizers.json content/editions/2027/organizers.json
   cp content/editions/2026/faq.json content/editions/2027/faq.json
   cp content/editions/2026/venue.json content/editions/2027/venue.json
   cp content/editions/2026/code-of-conduct.mdx content/editions/2027/code-of-conduct.mdx
   ```

3. Edit each file:

   - `event.json`: update `year`, `name`, `dates`, `location`, `sessionizeEventId` (new Sessionize event), `eventbriteEventUrl` (new Eventbrite event), `cfpSubmissionUrl`, status flags (typically `"upcoming"` for both at first), `previousEditions: ["2026"]`.
   - `sponsors.json`, `organizers.json`, `faq.json`, `venue.json`: replace with the new edition's data, or start with an empty array `[]` and populate over time.
   - `code-of-conduct.mdx`: usually unchanged; bump `version` in frontmatter if the policy changed.

4. Update `.env.local` (and the production env on the hosting platform) with `CURRENT_EDITION=2027`.

5. Run `npm run lint && npm run typecheck && npm test && npm run e2e`. All tests must pass.

6. Open a PR with the new edition.

After merge and the env update, the bare URL serves the 2027 content. The 2026 edition is automatically reachable at `/editions/2026/...` because the route tree iterates over the contents of `content/editions/`.

No code changes are required to switch editions. This is enforced by FR-030 and verified by the smoke checks in US6 and US9.

## Switching the current edition

If only the current-edition pointer needs to change (e.g., for an early reveal or a rollback):

1. Update `CURRENT_EDITION` in `.env.local` for local testing.
2. Update the hosting platform's environment variable for the deployed site (Amplify Console -> App settings -> Environment variables, or the equivalent on whichever platform is in use).
3. Trigger a redeploy. Most hosting platforms (AWS Amplify, Vercel, Netlify) redeploy automatically when an environment variable change is saved; check your platform's behavior.

The old edition continues to live at `/editions/{old-year}/...` because its content folder is still present.

## Verifying a release

After deploy:

1. Open `https://awscommunitydayparaguay.com` and verify the home renders the expected edition. If it does not resolve while the Amplify fallback domain works, follow the Route 53 registrant email verification runbook in `docs/deployment.md`.
2. Click through every nav item; each route must return 200.
3. Open `/sitemap.xml` and confirm all expected URLs are present.
4. Open `/robots.txt` and confirm it allows crawling and references the sitemap.
5. Run a desktop Lighthouse pass on `/`. Target: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 (FR-032).
6. Run a manual keyboard pass on `/` and `/speakers`. Target: every interactive element reachable, focus visible, skip link works (FR-019).
7. Toggle `prefers-reduced-motion` in the browser dev tools and reload the home; the countdown must not animate (FR-021).

If any check fails, file an issue and do not announce the release.
