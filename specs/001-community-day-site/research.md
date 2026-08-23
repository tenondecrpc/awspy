# Phase 0 Research: AWS Community Day Paraguay public website

**Feature**: 001-community-day-site
**Date**: 2026-05-23

This document records the research and decisions that informed the Technical Context and Project Structure of `plan.md`. Each item lists the decision, the rationale, and the alternatives considered.

## R1. Sessionize public API surface

**Decision**: Consume the four public read-only views `Speakers`, `Sessions`, `GridSmart`, and `SpeakerWall` from the Sessionize API at `https://sessionize.com/api/v2/{eventId}/view/{view}`. Do not request the `All` view because the four scoped views are smaller, easier to validate, and let the cache layer hit them independently when only one section of the site is rebuilt.

**Rationale**:
- Sessionize exposes a public, read-only JSON endpoint for any event (including private events made public via Embed page settings) without authentication. The endpoint stays stable across event lifecycles.
- Speakers and Sessions are the most read views; SpeakerWall is useful for the home page preview; GridSmart is the only view that returns pre-grouped day/room cells, which is exactly the layout the schedule page wants.
- Sessionize already caches responses for five minutes server-side. With our own ten-minute revalidation (`next: { revalidate: 600 }`) and the unique `tags: [`sessionize:${eventId}`]`, we get a clean invalidation lever without owning a custom cache layer.
- The API is documented at `https://sessionize.com/playbook/developers/api` and confirmed during planning research.

**Alternatives considered**:
- **Use `All` view only**: simpler request set but bigger payload and harder to validate piecemeal.
- **Use the Sessionize embed `<script>` widgets**: zero parsing on our side, but the markup is opaque, hard to style, and ties the site to Sessionize's HTML/CSS. Rejected because it conflicts with the SEO-first server-rendering approach.
- **Self-host a JSON snapshot in the repo**: would require a manual sync workflow and breaks the "no manual carga" requirement.

## R2. Eventbrite integration via external link only

**Decision**: Render a plain external link (`<a href={eventbriteEventUrl} target="_blank" rel="noopener noreferrer">`) that opens the public Eventbrite event page in a new tab. Do not load the Eventbrite Embedded Checkout widget script and do not call the Eventbrite REST API. The site itself does not run any Eventbrite-served JavaScript.

**Rationale**:
- The two LATAM reference sites cited in the planning brief, `day.awscommunity.mx` and `awscommunitydaycolombia.com`, both use a plain external link to Eventbrite (verified by inspecting their production bundles: each contains the public Eventbrite URL string and zero references to `EBWidgets`, `widgetType`, or `eb_widgets.js`). Matching local convention is more valuable than embedding the widget for a first edition.
- Eventbrite is free for free events for both organizer and attendees; matches the Community Day's free-attendance model.
- Skipping the widget eliminates third-party JavaScript on the home and `/register` pages, which improves Lighthouse Performance and Best Practices scores (FR-032). It also removes the "third-party cookies blocked" failure mode entirely.
- The Eventbrite event page handles the entire registration form, validation, capacity, sold-out state, confirmation emails, and the attendee dashboard. None of that needs to be mirrored in the site.
- No Eventbrite credentials (private tokens) need to be stored or shipped. The constitution's "frontend-only, no secrets" boundary remains intact.

**Alternatives considered**:
- **Embed the Eventbrite Embedded Checkout widget (modal and inline iframe)**: previously the chosen approach; rejected after confirming that neither Mexico nor Colombia ships the widget. The widget added third-party JavaScript on the critical render path, an extra failure mode (third-party cookies blocked), and an API surface (`window.EBWidgets.createWidget(...)`, `widgetType`, `iFrameContainerHeight`, etc.) that needed verification against Eventbrite's docs before each release. The link-only approach has no such moving parts.
- **Use Eventbrite REST API to read attendee count or guest list**: requires a private API token. Storing the token in this repo (even server-only) breaks the "no secrets in the frontend" constraint and adds operational responsibility (rotation, rate limits at 1000 req/h). Deferred to a follow-up feature if the organizers later decide to display "X registered" on the home; that feature would justify the added complexity.
- **Build an internal registration form**: rejected during planning; adds backend, persistence, and admin scope that breaks the constitution and the user's stated minimum scope.

## R3. Multi-edition routing in Next.js App Router

**Decision**: Dual route tree with shared templates. The current edition lives at the bare paths (`/`, `/speakers`, `/schedule`, ...). Past editions live under `/editions/[year]/...`. Both branches resolve their data through the same `getEdition(year)` loader and feed the same templates (`HomeTemplate`, `SpeakersTemplate`, ...) under `components/templates/`.

**Rationale**:
- Predictable routing: each path is a real Next.js route, sitemap and metadata generation enumerates the tree directly, and SEO is unambiguous (the current edition has stable canonicals at the bare URLs).
- Static generation is straightforward: `generateStaticParams` reads the `content/editions/` directory and emits a year list for the `/editions/[year]/...` tree.
- Switching the current edition (year over year) requires only flipping `CURRENT_EDITION` and adding the new content folder; the past-edition tree picks up the previous year automatically. This satisfies the "no refactor when 2027 arrives" constraint.

**Alternatives considered**:
- **Single tree with `next.config.ts` rewrites mapping `/speakers` -> `/editions/2026/speakers`**: more clever, but harder to reason about for future maintainers, and complicates `generateStaticParams` because both trees must be exhausted from a single source.
- **Year-prefixed for everyone, including current (`/2026`, `/2027`, ...) with `/` redirecting**: simpler internally, but breaks the user's stated requirement that the bare URL serve the current edition without redirect.

## R4. Content-as-code in TypeScript

**Decision**: Per-edition content lives under `content/editions/{year}/` as plain JSON (sponsors, organizers, FAQ, venue, event metadata) plus MDX (code of conduct). Loaders in `lib/content/*.ts` import the files (TypeScript native JSON imports under `resolveJsonModule: true`) and `z.parse` them at module load. The build fails loudly with a clear error if validation drifts.

**Rationale**:
- This is the pattern the AWS Community Day ecosystem (Taiwan, India, Brasil, Mumbai) uses for editorial content. It eliminates a backend, lets organizers iterate via PR, and gives Git history for editorial changes.
- TypeScript strict + Zod gives the same type-level guarantees a database with schemas would, with zero runtime infrastructure.
- The `.mdx` source keeps the code of conduct human-readable. The implemented renderer intentionally supports only the required Markdown subset and does not execute embedded JSX or components.

**Alternatives considered**:
- **YAML for content**: similar shape but more error-prone (indentation, type ambiguity) and adds a parser dep. Rejected.
- **Headless CMS (Sanity/Decap/Payload)**: introduces a runtime service, an admin UI, and access management. Rejected for this edition; explicitly considered as a future option if editorial volume grows.

## R5. Empty-state strategy

**Decision**: Introduce a first-class `EmptyState` organism used by `SpeakersGrid`, `ScheduleGrid`, `SponsorsBoard`, and any other section that depends on data that may be missing. Extend the typed `fetch` client (`lib/api/client.ts`) with a `tolerateMissing: boolean` option. When set, 404 responses and JSON-parse failures resolve to `null` (or the zero value of the response shape) instead of throwing. List endpoints in `lib/api/sessionize.ts` use `tolerateMissing: true` and convert `null` to `[]` so callers always receive a typed list.

**Rationale**:
- The constitution requires the static event content to render when the backend is unreachable. Empty states make this explicit and testable.
- `tolerateMissing` keeps the fault tolerance one layer below the page so individual pages don't need defensive `try`/`catch`.
- The home page can show "Speakers próximamente" without coupling its render to Sessionize uptime.

**Alternatives considered**:
- **Suspense boundaries with error boundaries everywhere**: works, but more verbose per page and harder to enforce consistently.
- **Hard-fail when Sessionize is empty**: rejected; explicitly violates FR-013 and FR-014 and US8.

## R6. Image strategy

**Decision**: Use `next/image` with `next.config.ts` `images.remotePatterns` configured for `sessionize.com` (speaker headshots) and `img.evbuc.com` (Eventbrite assets if shown). Same-origin assets (sponsor logos and organizer photos) live under `public/logos/` and `public/team/` respectively when self-hosted, or use external HTTPS URLs already configured per content. Every `<Image>` instance receives explicit `width`, `height`, and `sizes` per Principle V.

**Rationale**:
- `next/image` provides automatic responsive variants and lazy loading, which keeps Lighthouse Performance >= 90 (FR-032).
- Limiting `remotePatterns` to known hosts mitigates abuse and ensures all images flow through Next's optimizer.

**Alternatives considered**:
- **Plain `<img>` tags**: cheaper to wire but no automatic optimization or responsive sizes; would jeopardize the Lighthouse target.
- **Self-host every image**: cleaner for offline scenarios but adds editorial overhead and contradicts the "no carga manual" requirement. Sponsor logos are an exception because the pattern in similar sites is to host them in the repo.

## R7. Time zone handling

**Decision**: All schedule rendering uses `Intl.DateTimeFormat` with `timeZone: 'America/Asuncion'` and a small wrapper in `lib/utils/datetime.ts` (`formatDate`, `formatTime`, `formatRange`). Sessionize returns ISO-8601 timestamps; we treat them as authoritative and let `Intl` localize. The schedule page renders day-by-day, so a session that starts before midnight and ends after midnight is shown on the day of its start time and includes a small visual hint when the end time crosses the day boundary.

**Rationale**:
- `Intl.DateTimeFormat` is built-in, accurate, and widely supported. No dependency required.
- Day-by-day grouping matches the GridSmart view in Sessionize and keeps the UX consistent with the data structure.
- Asunción does not currently observe daylight saving time, so the offset is stable; treating a session as belonging to its start day is the least surprising rule.

**Alternatives considered**:
- **Bring in `date-fns-tz` or `luxon`**: bigger bundle and unnecessary given `Intl` covers the use cases.
- **Render in UTC with a TZ note**: confusing for attendees on the day of the event.

## R8. Slug derivation for speakers

**Decision**: `slugify(firstName + ' ' + lastName)` where `slugify` lowercases, strips diacritics (`String.normalize('NFD').replace(/[\u0300-\u036f]/g, '')`), replaces non-alphanumerics with `-`, collapses runs, and trims. When two speakers in the same edition would resolve to the same slug, the second receives a `-2` suffix, the third `-3`, and so on, ordered by Sessionize speaker `id` so the assignment is deterministic. The Sessionize speaker `id` is also exposed as a stable identifier in the data layer so callers can disambiguate without scraping URLs.

**Rationale**:
- Predictable, human-readable URLs.
- Deterministic disambiguation prevents confusing URL drift when two speakers share names.

**Alternatives considered**:
- **Use Sessionize numeric id directly as the slug**: ugly URLs that hurt SEO.
- **Use the speaker's email or social handle**: not always available and risks PII exposure.

## R9. SEO and structured data

**Decision**: Each route exports `metadata` (title, description, OG, Twitter card, canonical). Server components emit JSON-LD `<script type="application/ld+json">` blocks for `Event` (home and per-edition home), `Person` (speaker detail), and `BreadcrumbList` (sub-routes). The dynamic Open Graph image is generated at `app/opengraph-image.tsx` per edition, reading `event.json` for the title, date, and location.

**Rationale**:
- Direct alignment with FR-025 to FR-029 and Principle V.
- Server-emitted JSON-LD is recognized by Google and other crawlers without client JS.

**Alternatives considered**:
- **A library like `next-seo`**: unnecessary because Next.js 16 supports `metadata` natively; adds a dep without adding capability.
- **Static OG images per edition**: simpler but leads to a staged image asset workflow. The dynamic OG image keeps the editorial workflow JSON-only.

## R10. Testing strategy

**Decision**:
- **Unit tests** (Vitest, jsdom): every Zod schema, every loader, every utility (`slug`, `datetime`, `seo`). Sessionize fixtures are captured from the public demo event id `jl4ktls0` and stored under `tests/fixtures/sessionize/` so tests are deterministic and offline.
- **Component tests** (Vitest + React Testing Library): atoms with non-trivial states (Button), key molecules (SpeakerCard, FAQItem), and key organisms (EmptyState, SpeakersGrid populated and empty, ScheduleGrid, SponsorsBoard, FAQList accordion behavior, Countdown reduced-motion behavior, EventbriteRegisterButton with and without URL).
- **End-to-end** (Playwright): home rendering with empty data, navigation across routes (mobile and desktop viewports), `/speakers` populated and empty, `/schedule` populated, `/register` external-link and upcoming-state behavior, `/cfp` external link attributes, `/editions/{year}` round-trip.

**Rationale**:
- Pyramid: more unit tests than component, more component than E2E. Each layer catches the failures the layer below cannot reach.
- Fixtures rather than hitting live Sessionize keep CI fast and reproducible. The `tolerateMissing` path is exercised in unit tests by mocking `fetch` to return 404.

**Alternatives considered**:
- **Hit Sessionize live in CI**: flaky and slow; rejected.
- **Snapshot tests for everything**: noisy and gives false confidence; rejected in favor of behavior-driven assertions.
