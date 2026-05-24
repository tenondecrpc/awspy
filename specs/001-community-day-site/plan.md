# Implementation Plan: AWS Community Day Paraguay public website

**Branch**: `001-community-day-site` | **Date**: 2026-05-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-community-day-site/spec.md`

## Summary

Build the public, content-driven, SEO-sensitive website for AWS Community Day Paraguay 2026 as a Next.js App Router application that:

- Reads speakers, sessions, and the schedule grid from the public Sessionize JSON API (no auth) and validates payloads with Zod at the data boundary.
- Delegates attendee registration to a public Eventbrite event page (linked externally, not embedded) and call-for-papers to a Sessionize submission link.
- Stores all other event content (sponsors, organizers, venue, FAQ, code of conduct, edition metadata, status flags) as version-controlled JSON/MDX files under `content/editions/{year}/`, also validated with Zod at load time.
- Supports multiple editions from day one, with the current edition served at the bare URL and past editions under `/editions/{year}/...`.
- Renders correctly when external services are unavailable, exposes SEO metadata and structured data on every route, and meets the constitution's accessibility non-negotiables.
- Is deployed on AWS Amplify Hosting as the primary target. The build remains cloud-agnostic: the same `npm ci && npm run build && npm run start` contract works on Vercel, OpenNext on raw AWS, Netlify, or self-hosted Node. See `docs/deployment.md` for per-platform notes.

The technical approach honors all seven constitution principles. Routes, identifiers, comments, and commits are in English; user-facing copy is in Spanish.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 20.x runtime  
**Primary Dependencies**: Next.js 16.2.5 (App Router, Server Components), React 19.2.4, Tailwind CSS 4.x, Zod 4.x, TanStack Query 5.x (provider already installed; only used if/when client-side fetching becomes necessary), Zustand 5.x (only used for ephemeral UI state if/when needed), `@next/mdx` (to be added) for code-of-conduct rendering  
**Storage**: None. Content lives in version-controlled JSON/MDX under `content/editions/{year}/`. No database or external persistence in this repository  
**Testing**: Vitest 4.x with jsdom environment for unit and integration; React Testing Library 16.x with `@testing-library/jest-dom` for component tests; Playwright 1.59 for end-to-end  
**Target Platform**: AWS Amplify Hosting as the primary deployment target for v1. The site is cloud-agnostic and remains deployable on Vercel, OpenNext on raw AWS, Netlify, or self-hosted Node.js without code changes; see `docs/deployment.md` and `amplify.yml`. Modern evergreen browsers (last 2 versions of Chrome/Firefox/Safari/Edge); mobile and desktop.  
**Project Type**: Single Next.js application (frontend only, no backend in this repo)  
**Performance Goals**: Home Lighthouse on desktop: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95. LCP < 2.5s on desktop reference connection. Sessionize revalidation window: 600s (10 min)  
**Constraints**: AA contrast on every text/background pair; `prefers-reduced-motion` honored; keyboard reachable on every interactive element; build MUST fail on malformed `content/editions/{year}/*` files; site MUST keep rendering when Sessionize is empty or unreachable; no axios or other HTTP libraries (native `fetch` only); no backend logic, no admin, no persistence in this repo; no analytics tooling for v1  
**Scale/Scope**: ~30-50 speakers and ~40-60 sessions per edition (typical for a regional Community Day); single concurrent edition; up to a few thousand attendees over the event week; first edition has no historical data, so empty-state coverage is mandatory

## Constitution Check

The constitution at `.specify/memory/constitution.md` is version 1.0.0. This plan is evaluated against each principle:

### Principle I - Frontend-Only Boundary (NON-NEGOTIABLE)

- **PASS**. No backend service, database, or admin panel is built in this repository. Persistence and editorial workflows are delegated entirely to external systems (Sessionize for speakers/sessions/schedule, Eventbrite for registration). Sponsor inquiries are handled with a `mailto:` link. Edition metadata, sponsors, organizers, venue, FAQ, and code of conduct are version-controlled content edited through pull requests.
- Route Handlers and Server Actions in this plan are limited to: serving the dynamic OG image, generating the sitemap and robots, and reading Sessionize via the typed `fetch` client during server rendering and revalidation. None of these own persistent state.

### Principle II - Atomic Design Layering

- **PASS**. The component tree is `atoms/` -> `molecules/` -> `organisms/` -> `templates/` -> `app/` pages. Atoms (Button, Badge, Container, Section, Heading, Skeleton, Link) cannot import molecules; molecules (SpeakerCard, SponsorCard, ScheduleSlot, FAQItem, NavLink, OrganizerCard, EditionPill) cannot import organisms. Pages own data fetching exclusively; templates and lower tiers receive data through props.

### Principle III - Typed API Boundary with Zod Validation (NON-NEGOTIABLE)

- **PASS**. All Sessionize traffic flows through `lib/api/client.ts` (the existing typed `fetch` wrapper, extended with a `tolerateMissing` option). `lib/api/sessionize.ts` is the single resource module that calls the typed client and exports Zod schemas plus inferred TypeScript types for the `All`, `GridSmart`, `Sessions`, `Speakers`, and `SpeakerWall` views. No component calls `fetch` directly. No type assertions (`as Foo`) without parsing first. No alternative HTTP libraries are introduced.
- Local content is validated with Zod at load time inside `lib/content/*.ts` modules. The build fails loudly on malformed content (per FR-015).

### Principle IV - State Layering (Server vs Client)

- **PASS**. The site is overwhelmingly read-only and server-rendered. TanStack Query is already installed and wired in `app/providers.tsx`; it stays as the owner of any future server state on the client (no current candidate; the registration link does not need client-side state). Zustand is reserved for ephemeral UI state (mobile menu open/closed, accordion expansion) only; it MUST NOT hold server-derived data.

### Principle V - Server-First, Statically Rendered Content

- **PASS**. All routes default to React Server Components. Static event content (sponsors, organizers, venue, FAQ, code of conduct, edition metadata) is statically rendered at build time. Sessionize-sourced content (speakers, sessions, schedule) uses `fetch(..., { next: { revalidate: 600, tags: [`sessionize:${eventId}`] } })`. No parallel custom caching is introduced. The home page renders even when Sessionize is empty or unreachable, fulfilling the resilience requirement (FR-013, FR-014, US8). Metadata, sitemap, robots, OG image, and JSON-LD are produced via Next.js conventions (`metadata` exports, `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, JSON-LD blocks in server components).

### Principle VI - Accessibility Non-Negotiables (NON-NEGOTIABLE)

- **PASS**. Theme tokens are defined to meet AA contrast on every pair (Tailwind v4 `@theme`). All interactive elements are real `<a>` or `<button>` and reachable by keyboard with visible focus rings. The countdown and any transitions respect `prefers-reduced-motion`. The FAQ accordion exposes `aria-expanded`, `aria-controls`, and supports Enter, Space, and arrow keys. No information is conveyed by color alone (sponsor tier, status flags, etc. always pair color with text or icon). Forms (only the indirect Eventbrite overlay; no internal forms) are not in scope to be built; mailto links and external CTAs use `rel="noopener noreferrer"` and explicit `target="_blank"`.

### Principle VII - Language and Formatting Discipline

- **PASS**. All routes (`/speakers`, `/schedule`, `/sponsors`, `/venue`, `/team`, `/faq`, `/code-of-conduct`, `/cfp`, `/register`, `/editions`, `/editions/[year]/*`), file names, identifiers, comments, commit messages, PR descriptions, and internal docs are in English. All visible UI copy is in Spanish. Spanish copy uses proper accents and inverted question/exclamation marks; English internal text remains ASCII (no em-dashes or en-dashes).

### Stack and Tooling Constraints

- **PASS**. The plan uses the locked stack only: Next.js, React, TypeScript strict, Tailwind v4, Zod, TanStack Query (provider in place), Zustand (UI state only), Vitest + RTL, Playwright, ESLint, Prettier, npm. No `axios`/`ky`/`got`. The new dependency is `@next/mdx` for code-of-conduct rendering, which is a first-party Next.js package and aligns with the framework choice; if any concrete need to switch becomes apparent during implementation, the constitution amendment process will be followed.

### Verification Workflow

- **PASS**. Every task in `tasks.md` will require `npm run lint`, `npm run typecheck`, and the relevant `npm test`/`npm run e2e` to pass before completion. Manual verification steps (browser checks, Lighthouse, axe pass, sitemap fetch, `/opengraph-image` load, Sessionize-empty-vs-populated check) are listed in the spec's "Verification gates" section and reproduced as task-level acceptance criteria.

**Result**: All seven principles plus the stack and verification constraints pass. No constitution violations. The "Complexity Tracking" table at the end of this plan is empty.

A second Constitution Check is performed after the Phase 1 artifacts are produced (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) to catch any drift introduced during design. That check is recorded at the end of this plan.

## Project Structure

### Documentation (this feature)

```text
specs/001-community-day-site/
├── spec.md                                # /speckit.specify output (with Clarifications)
├── checklists/
│   └── requirements.md                    # /speckit.specify quality checklist
├── plan.md                                # /speckit.plan output (this file)
├── research.md                            # /speckit.plan Phase 0 output
├── data-model.md                          # /speckit.plan Phase 1 output
├── quickstart.md                          # /speckit.plan Phase 1 output
├── contracts/
│   ├── sessionize-api.md                  # Sessionize JSON contract this site consumes
│   ├── content-schemas.md                 # JSON/MDX schemas under content/editions/{year}/
│   └── eventbrite-embed.md                # Eventbrite external link contract
└── tasks.md                               # /speckit.tasks output (NOT created by /speckit.plan)
```

### Source Code (repository root)

The project is a single Next.js application. Existing scaffold (`app/layout.tsx`, `app/providers.tsx`, `app/page.tsx`, `lib/api/client.ts`, `lib/api/speakers.ts`, `tests/setup.ts`, `vitest.config.ts`, `playwright.config.ts`, Tailwind v4, Vitest, Playwright, ESLint, TypeScript) is reused. Net additions are listed below; existing files are noted with `(exists)`.

```text
app/
├── layout.tsx                             (exists; tweak to import SiteHeader/SiteFooter)
├── providers.tsx                          (exists)
├── page.tsx                               (REWRITE: home of current edition)
├── speakers/
│   ├── page.tsx
│   └── [slug]/page.tsx
├── schedule/page.tsx
├── sponsors/page.tsx
├── venue/page.tsx
├── team/page.tsx
├── faq/page.tsx
├── code-of-conduct/page.tsx
├── cfp/page.tsx
├── register/page.tsx
├── editions/
│   ├── page.tsx
│   └── [year]/
│       ├── page.tsx
│       ├── speakers/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── schedule/page.tsx
│       ├── sponsors/page.tsx
│       ├── venue/page.tsx
│       ├── team/page.tsx
│       ├── faq/page.tsx
│       ├── code-of-conduct/page.tsx
│       ├── cfp/page.tsx
│       └── register/page.tsx
├── sitemap.ts
├── robots.ts
├── opengraph-image.tsx
├── not-found.tsx
└── error.tsx

components/
├── atoms/
│   ├── Button.tsx
│   ├── Badge.tsx
│   ├── Container.tsx
│   ├── Section.tsx
│   ├── Heading.tsx
│   ├── Skeleton.tsx
│   └── Link.tsx
├── molecules/
│   ├── SpeakerCard.tsx
│   ├── SponsorCard.tsx
│   ├── ScheduleSlot.tsx
│   ├── FAQItem.tsx
│   ├── NavLink.tsx
│   ├── OrganizerCard.tsx
│   └── EditionPill.tsx
├── organisms/
│   ├── SiteHeader.tsx
│   ├── SiteFooter.tsx
│   ├── Hero.tsx
│   ├── Countdown.tsx
│   ├── SpeakersGrid.tsx
│   ├── ScheduleGrid.tsx
│   ├── SponsorsBoard.tsx
│   ├── VenueCard.tsx
│   ├── OrganizersGrid.tsx
│   ├── FAQList.tsx
│   ├── EmptyState.tsx
│   ├── EventbriteRegisterButton.tsx
│   ├── SessionizeCFPCallout.tsx
│   └── PrivacyFooterNote.tsx
└── templates/
    ├── HomeTemplate.tsx
    ├── SpeakersTemplate.tsx
    ├── SpeakerDetailTemplate.tsx
    ├── ScheduleTemplate.tsx
    ├── SponsorsTemplate.tsx
    ├── VenueTemplate.tsx
    ├── TeamTemplate.tsx
    ├── FAQTemplate.tsx
    ├── CodeOfConductTemplate.tsx
    ├── CFPTemplate.tsx
    ├── RegisterTemplate.tsx
    └── EditionsIndexTemplate.tsx

lib/
├── api/
│   ├── client.ts                          (exists; extend with tolerateMissing)
│   ├── sessionize.ts                      (REPLACES speakers.ts)
│   └── eventbrite.ts
├── content/
│   ├── editions.ts                        (currentEdition, listEditions, getEdition)
│   ├── event-info.ts                      (Zod schema for event.json)
│   ├── sponsors.ts
│   ├── organizers.ts
│   ├── faq.ts
│   ├── venue.ts
│   └── code-of-conduct.ts
└── utils/
    ├── slug.ts
    ├── datetime.ts
    └── seo.ts

content/
└── editions/
    └── 2026/
        ├── event.json
        ├── sponsors.json
        ├── organizers.json
        ├── faq.json
        ├── venue.json
        └── code-of-conduct.mdx

tests/
├── setup.ts                               (exists)
├── unit/
│   ├── lib-api-sessionize.test.ts
│   ├── lib-api-client.test.ts
│   ├── lib-api-eventbrite.test.ts
│   ├── lib-content-editions.test.ts
│   ├── lib-content-schemas.test.ts
│   ├── utils-slug.test.ts
│   ├── utils-datetime.test.ts
│   └── utils-seo.test.ts
└── components/
    ├── atoms-button.test.tsx
    ├── molecules-speaker-card.test.tsx
    ├── molecules-sponsor-card.test.tsx
    ├── molecules-faq-item.test.tsx
    ├── organisms-empty-state.test.tsx
    ├── organisms-speakers-grid.test.tsx
    ├── organisms-schedule-grid.test.tsx
    ├── organisms-sponsors-board.test.tsx
    ├── organisms-faq-list.test.tsx
    ├── organisms-countdown.test.tsx
    ├── organisms-eventbrite-register-button.test.tsx
    └── organisms-site-header.test.tsx

e2e/
├── home.spec.ts
├── navigation.spec.ts
├── speakers.spec.ts
├── schedule.spec.ts
├── register.spec.ts
├── editions.spec.ts
└── empty-states.spec.ts

public/
├── og/                                    (static OG fallback)
├── logos/                                 (sponsor logos hosted in repo when applicable)
└── speakers/                              (only if a speaker photo needs self-hosting; default is Sessionize URL)

.env.example                               (CURRENT_EDITION, NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_SESSIONIZE_BASE_URL optional override)
next.config.ts                             (exists; configure remotePatterns for sessionize.com and img.evbuc.com)
package.json                               (exists; add @next/mdx and a few peer deps)
```

**Structure Decision**: A single Next.js application at the repository root. The `app/` directory contains route handlers; `components/` follows the atomic design hierarchy mandated by the constitution; `lib/api/` holds the typed Sessionize client; `lib/content/` holds the typed local content loaders; `content/editions/{year}/` holds version-controlled per-edition data; `tests/` contains Vitest unit and component tests; `e2e/` contains Playwright tests. The current edition is selected by the `CURRENT_EDITION` environment variable at build/render time so the bare URL always serves the active year and the same templates render past editions under `/editions/{year}/...`.

## Phase 0: Outline & Research

`research.md` (companion file) consolidates all decisions that informed the Technical Context above. Each entry records the decision, the rationale, and the alternatives considered. No `NEEDS CLARIFICATION` markers remain after research.

Topics resolved in research:

1. **Sessionize public API surface**: which views to consume (`Speakers`, `Sessions`, `GridSmart`, `SpeakerWall`, `All`), authentication model (none for public events), caching behavior (5-minute server cache), custom field opt-in policy.
2. **Eventbrite integration via external link**: render a plain external link to the public Eventbrite event page; no widget embed, no REST API, no script load. Status flag (`upcoming` / `open` / `closed` / `archived`) drives the surrounding copy.
3. **Multi-edition routing in Next.js App Router**: trade-off between rewrites and dual-tree routes; chosen pattern is dual tree with shared templates because it keeps routing predictable, sitemap generation trivial, and the bare URL semantically meaningful.
4. **Content-as-code pattern in TypeScript**: `import` of JSON files plus `z.parse` at load time; build fails loudly on validation drift. MDX rendering for the code of conduct via `@next/mdx`.
5. **Empty-state strategy**: a first-class `EmptyState` organism wired into the lists/grids, plus a `tolerateMissing` option in the typed `fetch` client that turns 404 (or thrown errors at the data boundary) into `[]` or `null` so server components render placeholders without crashing.
6. **Image strategy**: `next/image` with `remotePatterns` allowing `sessionize.com` (speaker headshots), `img.evbuc.com` (Eventbrite assets), and same-origin (logos and photos under `public/`). Explicit `width`, `height`, and `sizes` per the constitution.
7. **Time zone handling**: `Intl.DateTimeFormat` with `timeZone: 'America/Asuncion'` in `lib/utils/datetime.ts`. Schedule renders day-by-day to avoid midnight ambiguity.
8. **Slug derivation for speakers**: lowercase + diacritic strip + non-alphanumerics replaced with `-` + collapse + trim, plus a `[2]`, `[3]`, ... suffix when collisions occur in a single edition. Speakers carry a stable `id` from Sessionize that drives the suffix decision.
9. **SEO/structured data approach**: `metadata` exports per route, `JSON-LD` script tags injected by server components for `Event`, `Person`, and `BreadcrumbList`. Dynamic OG image via `app/opengraph-image.tsx` reading `event.json`.
10. **Testing strategy**: unit (schemas, helpers), component (RTL with jsdom), e2e (Playwright with the deployed preview URL or local `next dev`). Sessionize fixtures captured from the public demo event id `jl4ktls0` to drive deterministic tests. The deploy-smoke spec is host-agnostic: it accepts `BASE_URL` so the same spec can target an AWS Amplify preview, a Vercel preview, or any other Next.js deployment.

## Phase 1: Design & Contracts

`data-model.md`, `contracts/sessionize-api.md`, `contracts/content-schemas.md`, `contracts/eventbrite-embed.md`, and `quickstart.md` are produced as companion files in this feature directory.

### data-model.md

Captures every entity in the spec's "Key Entities" section (Edition, Event metadata, Speaker, Session, Room/Track, Sponsor, Organizer, FAQ Item, Venue, Code of Conduct) with: source of truth (Sessionize, content, or computed), fields with types, validation rules, relationships, and lifecycle notes (e.g., the registration and CFP status flags transition open <-> upcoming <-> closed; speakers transition implicit accepted state in Sessionize). Each entity maps to its Zod schema location in `lib/api/sessionize.ts` or `lib/content/*.ts`.

### contracts/

The three contract files describe the external interfaces this site consumes (Sessionize, Eventbrite) and produces (the local content schema):

- `contracts/sessionize-api.md`: documents the Sessionize JSON shape per view (`All`, `GridSmart`, `Sessions`, `Speakers`, `SpeakerWall`), the URL pattern (`https://sessionize.com/api/v2/{eventId}/view/{view}`), the cache behavior, and the empty/error contract this site relies on. Includes the Zod schema definitions to be implemented in `lib/api/sessionize.ts`.
- `contracts/content-schemas.md`: documents the JSON/MDX shapes for `event.json`, `sponsors.json`, `organizers.json`, `faq.json`, `venue.json`, and `code-of-conduct.mdx`. Includes the Zod schemas to be implemented in `lib/content/*.ts`.
- `contracts/eventbrite-embed.md`: documents how this site integrates with Eventbrite via a plain external link to the public event page. The site does NOT embed the Eventbrite widget script and does NOT call the Eventbrite REST API. The contract covers the input shape (`EventInfo.eventbriteEventUrl`), the link semantics (`target="_blank"`, `rel="noopener noreferrer"`), the status-flag-driven UX (`upcoming` / `open` / `closed` / `archived`), and the fallback behavior when the event URL is absent.

### quickstart.md

A short "from zero to running" guide for a new contributor: clone the repo, set the env vars, run `npm install`, run `npm run dev`, verify the home page, run the test suites, and (for organizers) the editorial workflow for adding a sponsor or organizer (edit JSON, open PR). Also covers how to add a new edition and how to switch the current edition.

### Agent context update

`update-agent-context.sh claude` is run at the end of Phase 1 to refresh the agent-specific context file with the technologies introduced by this plan.

## Post-Design Constitution Re-check

Re-evaluating each principle after the Phase 1 artifacts are produced:

- **Frontend-Only Boundary**: research.md and contracts confirm no backend is introduced; data sources are external (Sessionize, Eventbrite) and version-controlled content. PASS.
- **Atomic Design Layering**: the project structure section enforces the tier discipline; the component list above respects it. PASS.
- **Typed API Boundary with Zod Validation**: `contracts/sessionize-api.md` and `contracts/content-schemas.md` make the Zod boundary explicit on every payload (inbound from Sessionize, inbound from the local files). PASS.
- **State Layering**: the design has zero server state in Zustand. TanStack Query provider stays in place but is unused for v1. PASS.
- **Server-First, Statically Rendered Content**: every page in the routing tree is a server component by default; client islands are scoped to interactive bits (mobile menu, FAQ accordion, countdown). PASS.
- **Accessibility Non-Negotiables**: organism list includes the patterns required by FR-019 to FR-024 (focus-visible Button, aria-expanded FAQItem, prefers-reduced-motion-aware Countdown, etc.). PASS.
- **Language and Formatting Discipline**: every route name, file name, and identifier in the project structure is English; visible copy in Spanish is enforced by the templates. PASS.

**Result**: Post-design check passes. No deviations to record.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|

(No violations.)
