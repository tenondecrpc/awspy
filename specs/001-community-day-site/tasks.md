---
description: "Task list for AWS Community Day Paraguay public website implementation"
---

# Tasks: AWS Community Day Paraguay public website

**Input**: Design documents from `/specs/001-community-day-site/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: explicitly requested by the spec (each user story's "Independent Test" block plus the per-story acceptance scenarios). Tests are mandatory in this feature.

**Organization**: tasks are grouped by user story so each story can be implemented, tested, and demoed independently. The ordering within a story respects: tests first, atoms before molecules before organisms before templates before pages.

## Format: `[ID] [P?] [Story?] Description with file path`

- **[P]**: parallelizable (touches different files, no dependency on other unfinished tasks)
- **[Story]**: required only on user-story phases (US1 through US9). Setup, Foundational, and Polish phases carry no story label.

## Path conventions

Single Next.js application at the repo root. All paths in tasks below are relative to the repository root unless they start with `/Users/...`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: project-wide configuration, scaffolding, and tooling that does not yet implement any user-story behavior.

- [X] T001 Add `@next/mdx`, `@types/mdx`, `@mdx-js/react`, `@mdx-js/loader` to `package.json` dev/dependencies and run `npm install`.
- [X] T002 [P] Configure MDX support in `next.config.ts` (register `pageExtensions` to include `mdx` and add `withMDX`); add `images.remotePatterns` allow-listing `sessionize.com`, `img.evbuc.com`, and any sponsor logo CDN; keep TypeScript strict.
- [X] T003 [P] Update `.env.example` with `CURRENT_EDITION=2026`, the local `NEXT_PUBLIC_SITE_URL=http://localhost:3000` value plus the documented production value `https://awscommunitydayparaguay.com`, and an optional commented `NEXT_PUBLIC_SESSIONIZE_BASE_URL` override; document each variable.
- [X] T004 [P] Create the directory scaffolding under the repo root: `components/atoms/`, `components/molecules/`, `components/organisms/`, `components/templates/`, `lib/api/` (already exists), `lib/content/`, `lib/utils/`, `content/editions/2026/`, `public/og/`, `public/logos/`, `public/team/`, `tests/unit/`, `tests/components/`, `tests/fixtures/sessionize/`, `e2e/`. Add a `.gitkeep` to any directory that would otherwise be empty.
- [X] T005 [P] Define Tailwind v4 theme tokens in `app/globals.css` using `@theme`: brand colors (AWS-aligned palette with verified AA contrast), spacing scale, typography scale, container widths, focus-ring color, and a semantic mapping for `text`, `surface`, `accent`, `muted`. Document the AA contrast pairs in a comment block.
- [X] T006 Create a small class-name helper at `lib/utils/cn.ts` (a thin `clsx`-like join with `undefined`/`false` filtering) and corresponding test at `tests/unit/utils-cn.test.ts`.
- [X] T007 Confirm `vitest.config.mts` resolves `tests/setup.ts`, runs jsdom by default, and includes both `tests/unit/**` and `tests/components/**` patterns; add the `@testing-library/jest-dom` import to `tests/setup.ts` if missing.
- [X] T008 Confirm `playwright.config.ts` starts `npm run dev` automatically with `webServer` config; configure two projects (mobile and desktop viewports) and a base URL of `http://localhost:3000`.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: typed boundaries (HTTP client, content schemas, utils) and shared atoms/organisms used by every user story. No user story can begin until this phase is complete.

### Typed HTTP boundary

- [X] T009 Extend `lib/api/client.ts` to support a `tolerateMissing?: boolean` option that, when `true`, converts `404` and JSON parse failures to `null` (or `[]` for list-shaped schemas) instead of throwing; preserve the existing Zod-on-response contract for the success path. Update the JSDoc with the new option.
- [X] T010 Add unit tests at `tests/unit/lib-api-client.test.ts` covering: successful parse, schema mismatch throws, `404` with `tolerateMissing: true` returns the empty fallback, `5xx` with `tolerateMissing: true` returns the empty fallback, `5xx` without `tolerateMissing` throws `ApiError`.

### Utilities

- [X] T011 [P] Implement `lib/utils/slug.ts` exporting `slugify(name: string): string` (NFD normalize, strip diacritics, lowercase, replace non-alphanumerics with `-`, collapse, trim) and `disambiguateSlugs<T extends { id: string; slug: string }>(items: T[]): T[]` deterministic by `id` ascending; add unit tests at `tests/unit/utils-slug.test.ts` covering accents, collisions, empty input, and stable ordering.
- [X] T012 [P] Implement `lib/utils/datetime.ts` with `formatDate`, `formatTime`, `formatDateTime`, and `formatTimeRange` helpers wrapping `Intl.DateTimeFormat` with `timeZone: 'America/Asuncion'` and Spanish locale (`es-PY` falling back to `es`); add unit tests at `tests/unit/utils-datetime.test.ts` for known timestamps and ranges crossing midnight.
- [X] T013 [P] Implement `lib/utils/seo.ts` with `buildPageMetadata({ title, description, path, ogImage })`, `buildEventJsonLd(eventInfo)`, `buildPersonJsonLd(speaker)`, and `buildBreadcrumbJsonLd(items)`; add unit tests at `tests/unit/utils-seo.test.ts` asserting required schema.org keys.

### Content boundary

- [X] T014 Implement `lib/content/event-info.ts` exporting `EventInfoSchema`, the inferred `EventInfo` type, and `getEventInfo(year: string): EventInfo` reading `content/editions/{year}/event.json`; on validation failure, throw a `ZodError` with the file path included in the message.
- [X] T015 [P] Implement `lib/content/sponsors.ts` per `contracts/content-schemas.md`, with `getSponsors(year)` and the duplicate-id `superRefine` already specified.
- [X] T016 [P] Implement `lib/content/organizers.ts` per `contracts/content-schemas.md`, with `getOrganizers(year)` and duplicate-id detection.
- [X] T017 [P] Implement `lib/content/faq.ts` per `contracts/content-schemas.md`, with `getFAQ(year)` and duplicate-id detection.
- [X] T018 [P] Implement `lib/content/venue.ts` per `contracts/content-schemas.md`, with `getVenue(year)` enforcing the trusted-host list for `embedMapUrl`.
- [X] T019 [P] Implement `lib/content/code-of-conduct.ts` exporting `CodeOfConductFrontmatterSchema`, `getCodeOfConduct(year)` returning `{ frontmatter, content }` (where `content` is the compiled MDX module path or AST suitable for the renderer chosen in T002).
- [X] T020 Implement `lib/content/editions.ts` exporting `currentEdition()` (reads `process.env.CURRENT_EDITION`, defaults to `'2026'`, validates `^\\d{4}$`), `listEditions()` (reads `content/editions/` directory entries, validates each is a 4-digit year, sorted descending), and `getEdition(year)` (delegates to the per-resource loaders above and returns the aggregated `Edition`).
- [X] T021 Add unit tests at `tests/unit/lib-content-editions.test.ts` and `tests/unit/lib-content-schemas.test.ts` covering: every loader rejects invalid input with a clear message, `currentEdition()` honors env var with default fallback, `listEditions()` ignores non-year directories, `getEdition('2026')` returns the seeded fixture cleanly.

### Sessionize integration

- [X] T022 Implement `lib/api/sessionize.ts` per `contracts/sessionize-api.md`: Zod schemas `SessionizeSpeakerSchema`, `SpeakersListSchema`, `SessionizeSessionSchema`, `SessionsListSchema`, `ScheduleGridSchema`, `SpeakerWallSchema`; helper `buildSessionizeUrl(eventId, view)`; functions `listSpeakers(eventId)`, `getSpeakerBySlug(eventId, slug)`, `listSessions(eventId)`, `getScheduleGrid(eventId)`, `getSpeakerWall(eventId)`; all calls go through `apiFetch` with `tolerateMissing: true` and `next: { revalidate: 600, tags: [`sessionize:${eventId}`] }`.
- [X] T023 Capture Sessionize fixtures from the public demo event id `jl4ktls0` (Speakers, Sessions, GridSmart, SpeakerWall) into `tests/fixtures/sessionize/{view}.json`. Add a script entry in `package.json` (`fixtures:sessionize`) that re-fetches them via `curl`.
- [X] T024 Add unit tests at `tests/unit/lib-api-sessionize.test.ts` mocking `fetch`: speakers parse from fixture, sessions parse from fixture, grid parses from fixture, missing event id returns `[]`, malformed payload with `tolerateMissing: true` returns `[]`, `getSpeakerBySlug` finds the right speaker and disambiguates collisions deterministically.

### Eventbrite integration

- [X] T025 [P] (Originally: implement `lib/api/eventbrite.ts` exporting `extractEventId`, `getCheckoutWidgetConfig`, and `getEventbriteScriptUrl` for the Embedded Checkout widget.) **Superseded by the C1 link-only migration**: `lib/api/eventbrite.ts` was removed because the site no longer loads the widget script or builds widget configs; registration is delegated to a plain external link rendered by `EventbriteRegisterButton`. See the rewritten `contracts/eventbrite-embed.md` for the current contract.
- [X] T026 [P] (Originally: unit tests at `tests/unit/lib-api-eventbrite.test.ts` for `extractEventId` and `getCheckoutWidgetConfig`.) **Superseded by the C1 link-only migration**: the test file was removed alongside `lib/api/eventbrite.ts`. The link-only behavior is now covered by the component test at `tests/components/organisms-eventbrite-register-button.test.tsx`.

### Atoms

- [X] T027 [P] Implement `components/atoms/Container.tsx`, `components/atoms/Section.tsx`, and `components/atoms/Heading.tsx` (semantic, type-safe, no logic).
- [X] T028 [P] Implement `components/atoms/Button.tsx` with variants (primary, secondary, ghost), sizes, `as` polymorphism (`<button>` vs `<a>`), focus-visible ring, and `disabled` styling that does not rely on color alone (adds an icon or visible label change). Add a test at `tests/components/atoms-button.test.tsx` covering: roles, keyboard activation, focus visible, disabled state announces correctly.
- [X] T029 [P] Implement `components/atoms/Badge.tsx` (variants per sponsor tier, status flag, etc.) ensuring color is always paired with text or icon (Principle VI).
- [X] T030 [P] Implement `components/atoms/Skeleton.tsx` (CSS-only shimmer; respects `prefers-reduced-motion`) and `components/atoms/Link.tsx` (wraps `next/link` with consistent focus styles and external-link safety attributes).

### Shared organisms

- [X] T031 Implement `components/organisms/EmptyState.tsx` with props `{ title, description, actionHref?, actionLabel?, icon? }`, default Spanish copy, and AA contrast. Add a test at `tests/components/organisms-empty-state.test.tsx` for default render, action button render, and Spanish-character handling.
- [X] T032 Seed `content/editions/2026/event.json` with placeholder values consistent with the schema (year `"2026"`, name `"AWS Community Day Paraguay 2026"`, dates within the next event window, statuses `"upcoming"` for both, `sessionizeEventId: null`, `eventbriteEventUrl: null`, `cfpSubmissionUrl: null`, `contactEmail: "hola@awscommunitydayparaguay.com"` placeholder); seed `sponsors.json: []`, `organizers.json: []`, `faq.json` with three example items, `venue.json` with placeholder venue, `code-of-conduct.mdx` with the standard AWS UG Brasil text translated to Spanish or a one-paragraph Spanish placeholder labeled "Borrador" plus optional frontmatter.

**Checkpoint**: typed HTTP client, content loaders, utilities, atoms, EmptyState, and seed content are all in place. User stories can begin in parallel.

---

## Phase 3: User Story 1 - Discover the event from the home page (Priority: P1) [MVP]

**Goal**: a visitor lands on `/` and sees the hero, countdown, about section, navigation, and footer for the current edition; missing dynamic data renders Spanish empty states.

**Independent Test**: with `CURRENT_EDITION=2026` and Sessionize deterministically unavailable, opening `/` returns 200, renders the hero/countdown/footer, navigation reaches every other top-level route, and Lighthouse on desktop scores >= the targets in FR-032.

### Tests for User Story 1

- [X] T033 [P] [US1] Component test at `tests/components/molecules-nav-link.test.tsx` for `NavLink` (active state, focus, accessible label).
- [X] T034 [P] [US1] Component test at `tests/components/organisms-site-header.test.tsx` for `SiteHeader` (skip link, mobile menu toggle, navigation reachable by keyboard, no color-only state).
- [X] T035 [P] [US1] Component test at `tests/components/organisms-site-footer.test.tsx` for `SiteFooter` (privacy footer note present, contact email visible, social links open in new tab with safe rel).
- [X] T036 [P] [US1] Component test at `tests/components/organisms-countdown.test.tsx` for `Countdown` (renders, respects `prefers-reduced-motion` by suppressing animation, accessible label updates).
- [X] T037 [P] [US1] E2E test at `e2e/home.spec.ts` (mobile and desktop): `/` renders, hero, countdown, footer visible, primary CTAs to `/register` and `/cfp` visible, `aria-label`s present.
- [X] T038 [P] [US1] E2E test at `e2e/navigation.spec.ts` for the navigation across all top-level routes (mobile menu and desktop inline links).

### Implementation for User Story 1

- [X] T039 [P] [US1] Implement `components/molecules/NavLink.tsx`.
- [X] T040 [P] [US1] Implement `components/molecules/EditionPill.tsx`.
- [X] T041 [US1] Implement `components/organisms/SiteHeader.tsx` (skip link, brand mark, desktop nav, mobile drawer with focus trap and `Escape` close).
- [X] T042 [US1] Implement `components/organisms/PrivacyFooterNote.tsx` (FR-036 Spanish copy plus link to Eventbrite's privacy policy).
- [X] T043 [US1] Implement `components/organisms/SiteFooter.tsx` (uses `PrivacyFooterNote`, contact email, social links, edition pill).
- [X] T044 [US1] Implement `components/organisms/Hero.tsx` consuming `EventInfo` (heroTitle, heroSubtitle, dates, location.summary, CTAs to `/register` and `/cfp`).
- [X] T045 [US1] Implement `components/organisms/Countdown.tsx` (client component; respects `prefers-reduced-motion` by snapping value transitions; aria-live polite).
- [X] T046 [US1] Implement `components/templates/HomeTemplate.tsx` composing `Hero`, `Countdown`, an "About" section, a speakers preview slot (uses `EmptyState` for now), a sponsors preview slot, and a CFP/register CTA block.
- [X] T047 [US1] Update `app/layout.tsx` to wrap `<Providers>` with `<SiteHeader />` and `<SiteFooter />`, set `<html lang="es-PY">`, and import the AA-compliant font stack via `next/font` (Geist already configured; verify).
- [X] T048 [US1] Implement `app/page.tsx` as a server component: load `getEdition(currentEdition())`, render `HomeTemplate`, export `metadata` via `buildPageMetadata`, emit `Event` JSON-LD via `buildEventJsonLd`. Page must render correctly with `sessionizeEventId: null`.
- [X] T049 [US1] Implement `app/not-found.tsx` and `app/error.tsx` with Spanish copy and a link back to `/`.

**Checkpoint US1 complete**: `npm run dev` shows a complete home page with placeholder data; `npm test` passes; `npm run e2e -- e2e/home.spec.ts e2e/navigation.spec.ts` passes.

---

## Phase 4: User Story 2 - Browse confirmed speakers (Priority: P1)

**Goal**: a visitor browses `/speakers` and `/speakers/[slug]` populated by Sessionize; without an event id or with an empty list, the page renders the empty state.

**Independent Test**: set `content/editions/2026/event.json.sessionizeEventId` to `"jl4ktls0"` (the demo) and verify `/speakers` lists the demo speakers with working detail pages; set it back to `null` and verify the empty state.

### Tests for User Story 2

- [X] T050 [P] [US2] Component test at `tests/components/molecules-speaker-card.test.tsx` for `SpeakerCard` (name, photo, tagline, link to detail).
- [X] T051 [P] [US2] Component test at `tests/components/organisms-speakers-grid.test.tsx` for `SpeakersGrid` (populated render, empty fallback delegates to `EmptyState`).
- [ ] T052 [P] [US2] Complete deterministic E2E coverage at `e2e/speakers.spec.ts` for a populated list and detail click-through. The empty fallback is covered; populated browser fixtures remain under TEST-002.

### Implementation for User Story 2

- [X] T053 [P] [US2] Implement `components/molecules/SpeakerCard.tsx` using `next/image` with explicit width/height/sizes; falls back to initials when photo missing.
- [X] T054 [US2] Implement `components/organisms/SpeakersGrid.tsx` accepting `Speaker[]` and rendering `EmptyState` when empty.
- [X] T055 [US2] Implement `components/templates/SpeakersTemplate.tsx` composing the grid plus heading and intro copy.
- [X] T056 [US2] Implement `components/templates/SpeakerDetailTemplate.tsx` rendering bio, links, and the speaker's sessions; includes `Person` JSON-LD via `buildPersonJsonLd`.
- [X] T057 [US2] Implement `app/speakers/page.tsx`: load `getEdition(currentEdition())`, then `listSpeakers(eventInfo.sessionizeEventId)`; render `SpeakersTemplate`; export `metadata`.
- [X] T058 [US2] Implement `app/speakers/[slug]/page.tsx`: `generateStaticParams` enumerates all speaker slugs for the current edition; the page loads speaker plus sessions; renders `SpeakerDetailTemplate`; emits `Person` JSON-LD; `notFound()` for unknown slug.
- [X] T059 [US2] Update `HomeTemplate` to populate the speakers preview slot via `getSpeakerWall(eventInfo.sessionizeEventId)` (or `listSpeakers` limited to 6), keeping the empty fallback when null.

**Checkpoint US2 partial**: component and contract tests cover populated data, and browser tests cover the empty fallback. Populated browser coverage remains under TEST-002.

---

## Phase 5: User Story 3 - Consult the event schedule (Priority: P1)

**Goal**: a visitor browses `/schedule` and sees the grid; without a published schedule, the empty state appears.

**Independent Test**: with the demo event id, `/schedule` shows the demo grid with rooms, days, sessions; with `sessionizeEventId: null`, the page shows "Agenda próximamente".

### Tests for User Story 3

- [X] T060 [P] [US3] Component test at `tests/components/molecules-schedule-slot.test.tsx` for `ScheduleSlot` (title, time range, speakers, link to speaker).
- [ ] T061 [P] [US3] Complete component coverage at `tests/components/organisms-schedule-grid.test.tsx` for `ScheduleGrid`. Empty, ordering, matched/unmatched speakers, and midnight-crossing behavior are covered. Verified multi-day/multi-room and provider plenary semantics remain tracked under TEST-002.
- [ ] T062 [P] [US3] Complete deterministic E2E coverage at `e2e/schedule.spec.ts` for populated multi-room data. The empty fallback is covered; populated browser fixtures remain under TEST-002.

### Implementation for User Story 3

- [X] T063 [P] [US3] Implement `components/molecules/ScheduleSlot.tsx` using `formatTimeRange` from `lib/utils/datetime.ts`.
- [X] T064 [US3] Implement `components/organisms/ScheduleGrid.tsx` accepting the `ScheduleGrid` data; renders empty state when `[]`.
- [X] T065 [US3] Implement `components/templates/ScheduleTemplate.tsx` composing the grid plus a date selector (server-rendered tab list).
- [X] T066 [US3] Implement `app/schedule/page.tsx`: load `getEdition(currentEdition())`, then `getScheduleGrid(eventInfo.sessionizeEventId)`; render `ScheduleTemplate`; export `metadata`.

**Checkpoint US3 partial**: component and contract tests cover populated data, and browser tests cover the empty fallback. Populated multi-room browser coverage remains under TEST-002.

---

## Phase 6: User Story 4 - Find practical event information (Priority: P2)

**Goal**: visitors browse `/sponsors`, `/venue`, `/team`, `/faq`, and `/code-of-conduct`. All five pages render placeholders from `content/editions/2026/`.

**Independent Test**: each route returns 200, renders the seed content, and links work.

### Tests for User Story 4

- [X] T067 [P] [US4] Component test at `tests/components/molecules-sponsor-card.test.tsx` (logo light/dark, link out, AA contrast on tier badge).
- [X] T068 [P] [US4] Component test at `tests/components/organisms-sponsors-board.test.tsx` (tier ordering Platinum -> Gold -> Silver -> Bronze -> Community, empty fallback).
- [X] T069 [P] [US4] Component test at `tests/components/molecules-faq-item.test.tsx` (`aria-expanded`, keyboard `Enter`/`Space`/arrow keys, multiple expansions allowed).
- [X] T070 [P] [US4] Component test at `tests/components/organisms-faq-list.test.tsx`.
- [X] T071 [P] [US4] Component test at `tests/components/organisms-organizers-grid.test.tsx`.

### Implementation for User Story 4

- [X] T072 [P] [US4] Implement `components/molecules/SponsorCard.tsx`. The card MUST render the sponsor's name as a visible fallback when the logo fails to load (via `onError` on the image element or a same-tier text-only fallback rendered behind the image), so an unavailable logo URL never breaks the layout (spec Edge Case "sponsor logo URL becomes unavailable").
- [X] T073 [US4] Implement `components/organisms/SponsorsBoard.tsx` (tier-grouped, empty fallback, with a `variant: 'full' | 'compact'` prop: `'full'` is the default used on `/sponsors` and groups by tier with full-size logos; `'compact'` is used on the home preview and renders a single dense row of logos sized for the hero context).
- [X] T074 [US4] Implement `components/templates/SponsorsTemplate.tsx` (board plus "¿Querés ser sponsor?" mailto block linking to `eventInfo.contactEmail`).
- [X] T075 [US4] Implement `app/sponsors/page.tsx`.
- [X] T076 [P] [US4] Implement `components/organisms/VenueCard.tsx` (name, address, transport list, optional embed iframe lazy-loaded).
- [X] T077 [US4] Implement `components/templates/VenueTemplate.tsx` and `app/venue/page.tsx`.
- [X] T078 [P] [US4] Implement `components/molecules/OrganizerCard.tsx`.
- [X] T079 [US4] Implement `components/organisms/OrganizersGrid.tsx`.
- [X] T080 [US4] Implement `components/templates/TeamTemplate.tsx` and `app/team/page.tsx`.
- [X] T081 [P] [US4] Implement `components/molecules/FAQItem.tsx` (accordion with `aria-expanded`, `aria-controls`, keyboard support per FR-024).
- [X] T082 [US4] Implement `components/organisms/FAQList.tsx`.
- [X] T083 [US4] Implement `components/templates/FAQTemplate.tsx` and `app/faq/page.tsx`.
- [X] T084 [US4] Implement `components/templates/CodeOfConductTemplate.tsx` (renders MDX body via the renderer chosen in T002; shows `frontmatter.lastUpdated` if present).
- [X] T085 [US4] Implement `app/code-of-conduct/page.tsx`.
- [X] T086 [US4] Update `HomeTemplate` sponsors preview slot to use `SponsorsBoard` (compact mode), keeping the empty fallback when no sponsors are seeded.

**Checkpoint US4 complete**: all five pages render with seed content, accessibility checks pass on the FAQ.

---

## Phase 7: User Story 5 - Register as attendee or submit a talk (Priority: P2)

**Goal**: `/register` and `/cfp` render the right CTAs depending on the current status flags and on whether `eventbriteEventUrl` and `cfpSubmissionUrl` are set.

**Independent Test**: with `registrationStatus: "upcoming"` and `eventbriteEventUrl: null`, `/register` shows the "Registro próximamente" alternative with a mailto button; with `"open"` and a URL, it renders a primary "Registrarme" external link to Eventbrite (`target="_blank"`, `rel="noopener noreferrer"`) and no Eventbrite widget script is loaded. Same matrix for `/cfp` against Sessionize.

### Tests for User Story 5

- [X] T087 [P] [US5] Component test at `tests/components/organisms-eventbrite-register-button.test.tsx`. After the C1 link-only migration the test asserts the new behavior: with a URL, the component renders an `<a>` with `href={eventbriteEventUrl}`, `target="_blank"`, and `rel="noopener noreferrer"`; without a URL, it renders the "Registro próximamente" alternative with the mailto button; in both cases no `<script>` tag is injected. Custom labels are honored.
- [X] T088 [P] [US5] (Originally: component test at `tests/components/organisms-eventbrite-checkout-embed.test.tsx` for the inline iframe widget.) **Superseded by the C1 link-only migration**: the embed component and its test were removed because the site no longer renders the inline iframe. The link-only behavior is covered by T087.
- [X] T089 [P] [US5] Component test at `tests/components/organisms-sessionize-cfp-callout.test.tsx` (open/upcoming/closed states render correct copy and CTA state).
- [X] T090 [P] [US5] E2E test at `e2e/register.spec.ts` (with seed `null` URL: shows alternative; if local fixture flips status to `open` with a known URL: button renders and external link is correct; lazy script tag is present in DOM).

### Implementation for User Story 5

- [X] T091 [US5] Implement `components/organisms/EventbriteRegisterButton.tsx` per `contracts/eventbrite-embed.md` after the C1 link-only migration: server-rendered component (no `"use client"`) that renders a `Button as="a"` with `href={eventbriteEventUrl}`, `target="_blank"`, `rel="noopener noreferrer"`, and the configurable label. When the URL is `null`, renders the "Registro próximamente" alternative plus a mailto-styled button (`mailto:` to `contactEmail` with the "Avisame cuando abra el registro" subject). No widget script is loaded, no `useEffect`, no `EBWidgets`. Honors the constitution: keyboard reachable, AA contrast, no color-only state.
- [X] T092 [US5] (Originally: implement `components/organisms/EventbriteCheckoutEmbed.tsx` as the inline iframe checkout.) **Superseded by the C1 link-only migration**: the inline iframe embed was removed because the regional reference sites (Mexico, Colombia) do not embed the widget either. `RegisterTemplate` now uses only the link-based `EventbriteRegisterButton` for both the "open" and "upcoming" status branches.
- [X] T093 [US5] Implement `components/organisms/SessionizeCFPCallout.tsx` (handles open/upcoming/closed; shows deadline; shows CTA disabled state per FR-024 patterns; external link with safe rel/target).
- [X] T094 [US5] Implement `components/templates/RegisterTemplate.tsx` consuming `EventInfo.registrationStatus` and `EventInfo.eventbriteEventUrl`; renders the appropriate copy and composes `EventbriteRegisterButton` for the "open" and "upcoming" branches. The "closed" branch and the `archived` mode for past-edition routes (FR-035) render a static notice with no register button.
- [X] T095 [US5] Implement `components/templates/CFPTemplate.tsx` similarly for CFP.
- [X] T096 [US5] Implement `app/register/page.tsx` and `app/cfp/page.tsx`.

**Checkpoint US5 complete**: both pages adapt to status flags and missing URLs; tests green.

---

## Phase 8: User Story 6 - Access past editions (Priority: P2)

**Goal**: `/editions` lists past editions; `/editions/[year]/...` mirrors every current-edition route. `cfp` and `register` past-edition routes always render "Esta edición ya finalizó" per FR-035.

**Independent Test**: scaffold a placeholder past-edition folder (e.g., `content/editions/2025/` with minimal valid files) and verify the routes; remove the folder and verify it disappears from `/editions`.

### Tests for User Story 6

- [X] T097 [P] [US6] Component test at `tests/components/templates-editions-index.test.tsx` for `EditionsIndexTemplate` (lists past editions, hides current, links work).
- [X] T098 [P] [US6] E2E test at `e2e/editions.spec.ts` covering: `/editions` lists current and past, `/editions/2026` mirrors `/`, `/editions/9999` returns 404, `/editions/2026/cfp` and `/editions/2026/register` show "Esta edición ya finalizó" regardless of status flags.

### Implementation for User Story 6

- [X] T099 [US6] Implement `components/templates/EditionsIndexTemplate.tsx`.
- [X] T100 [US6] Implement `app/editions/page.tsx` (lists from `listEditions()`).
- [X] T101 [US6] Implement `app/editions/[year]/page.tsx` (calls `getEdition(params.year)`, calls `notFound()` if missing, renders `HomeTemplate`); add `generateStaticParams` from `listEditions()`.
- [X] T102 [P] [US6] Implement the per-year mirror routes by reusing the templates: `app/editions/[year]/speakers/page.tsx`, `app/editions/[year]/speakers/[slug]/page.tsx`, `app/editions/[year]/schedule/page.tsx`, `app/editions/[year]/sponsors/page.tsx`, `app/editions/[year]/venue/page.tsx`, `app/editions/[year]/team/page.tsx`, `app/editions/[year]/faq/page.tsx`, `app/editions/[year]/code-of-conduct/page.tsx`. Each calls `getEdition(params.year)` and renders the same template the current-edition route uses.
- [X] T103 [US6] Implement `app/editions/[year]/cfp/page.tsx` and `app/editions/[year]/register/page.tsx` to render a "Esta edición ya finalizó" message regardless of status flags (FR-035).

**Checkpoint US6 complete**: past editions reachable, current edition still served at `/`, archived flows behave per FR-035.

---

## Phase 9: User Story 7 - Be discovered through search and social shares (Priority: P3)

**Goal**: complete SEO surface (sitemap, robots, OG image, JSON-LD on home and speakers, BreadcrumbList on sub-routes).

**Independent Test**: fetch `/sitemap.xml`, `/robots.txt`, and `/opengraph-image` in the dev server; inspect the home and a speaker detail page for the expected JSON-LD.

### Tests for User Story 7

- [X] T104 [P] [US7] Unit test at `tests/unit/sitemap.test.ts` asserting all expected URLs are present (current-edition routes plus past-edition routes derived from `listEditions()`).
- [X] T105 [P] [US7] Unit test at `tests/unit/robots.test.ts` asserting Allow + Sitemap reference.

### Implementation for User Story 7

- [X] T106 [US7] Implement `app/sitemap.ts` iterating current and past editions.
- [X] T107 [US7] Implement `app/robots.ts`.
- [X] T108 [US7] Implement `app/opengraph-image.tsx` (Next.js OG image renderer using `EventInfo.name`, dates, location).
- [X] T109 [US7] Audit every `app/**/page.tsx` to ensure each exports `metadata` via `buildPageMetadata`; add `BreadcrumbList` JSON-LD to sub-routes.

**Checkpoint US7 complete**: SEO checks pass per `quickstart.md` "Verifying a release" steps.

---

## Phase 10: User Story 8 - Stay usable when external services fail (Priority: P3)

**Goal**: the site renders with empty states everywhere external data is missing or failing; build-time validation fails loudly on malformed local content.

**Independent Test**: forcing a Sessionize fetch failure (`NEXT_PUBLIC_SESSIONIZE_BASE_URL=https://invalid.example`) keeps `/`, `/speakers`, and `/schedule` rendering with empty states. Introducing a malformed `event.json` fails `npm run build`.

### Tests for User Story 8

- [X] T110 [P] [US8] E2E test at `e2e/empty-states.spec.ts` running with `NEXT_PUBLIC_SESSIONIZE_BASE_URL` pointed at an invalid host: every route returns 200 and shows the appropriate Spanish empty state.
- [X] T111 [P] [US8] Unit test at `tests/unit/lib-content-build-failure.test.ts` writing a malformed JSON to a temp directory and asserting that the loader throws a `ZodError` referencing the bad field (does NOT actually fail the suite; uses the loader directly with the temp path).

### Implementation for User Story 8

- [X] T112 [US8] Audit every page that consumes Sessionize to ensure `tolerateMissing` flows correctly: `app/page.tsx`, `app/speakers/page.tsx`, `app/speakers/[slug]/page.tsx`, `app/schedule/page.tsx`, and the per-edition mirrors. Add explicit `try/catch` boundaries only where unavoidable.
- [X] T113 [US8] Manually run an axe pass on `/` and `/speakers` (document outcome in PR notes); fix any AA-blocking issue uncovered.
- [X] T114 [US8] Manually verify `prefers-reduced-motion` on `/` and `/schedule`; record in PR notes.

**Checkpoint US8 complete**: resilience scenarios pass; constitution accessibility subset verified manually.

---

## Phase 11: User Story 9 - Reach the public domain reliably (Priority: P3)

**Goal**: production deploy on AWS Amplify Hosting (primary target), reachable, with the right edition served and revalidation working. The build remains cloud-agnostic so a future migration to Vercel, OpenNext on raw AWS, Netlify, or self-hosted Node.js requires no code change (see `docs/deployment.md`).

### Tests for User Story 9

- [X] T115 [P] [US9] E2E smoke at `e2e/deploy-smoke.spec.ts` that, when run with `BASE_URL=https://<deployed-preview-url>`, hits every top-level route and asserts a 200 plus the presence of the page heading. The spec is host-agnostic.

### Implementation for User Story 9

- [ ] T116 [US9] Configure the AWS Amplify Hosting app: connect the GitHub repo, select the `main` branch, set production env vars (`CURRENT_EDITION=2026`, `NEXT_PUBLIC_SITE_URL=https://awscommunitydayparaguay.com`), confirm the committed `amplify.yml` is honored, and verify the build passes on a preview branch deploy. Production app `d2dgeqbarexvjr`, `main`, and the environment variables were verified on 2026-08-21; the preview branch validation remains open. Lint, typecheck, and unit tests are gated by the build per `amplify.yml`.
- [ ] T117 [US9] Configure the custom domain `awscommunitydayparaguay.com` in the Amplify Console (Domain management). The Amplify association, ACM certificate, Route 53 hosted zone, and records were verified on 2026-08-21. Public reachability remains open until the registrant email is verified and Route 53 removes `clientHold`; then verify HTTPS plus the `www` redirect.
- [ ] T118 [US9] Run a desktop Lighthouse pass on the Amplify preview URL (`npx lighthouse <url> --view`); record results; fix any regression that drops below FR-032 thresholds.

**Checkpoint US9 complete**: site live, all post-deploy quickstart checks pass.

---

## Phase 12: Polish & Cross-Cutting Concerns

- [X] T119 [P] Run `npm run lint` and resolve any warning to keep the linter green going forward.
- [X] T120 [P] Run `npm run typecheck` and resolve any drift introduced during implementation.
- [X] T121 [P] Run `npm test` (full suite) and ensure 100 percent of suites pass.
- [X] T122 [P] Run `npm run e2e` (full suite) and ensure 100 percent of specs pass on both the mobile and desktop projects.
- [X] T123 Walk through `quickstart.md` step-by-step on a clean clone in a temp directory; fix any inaccuracy or missing step.
- [X] T124 Remove any temporary fixture files, dummy test pages, or `/test-*` routes that may have been used during early development.
- [ ] T125 Commit and push, opening a PR titled `feat(site): AWS Community Day Paraguay 2026 public website (US1-US9)`. The PR description references this `tasks.md` and includes the verification matrix (lint, typecheck, test, e2e, manual axe, Lighthouse, sitemap fetch).

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: independent. Start immediately.
- **Foundational (Phase 2)**: depends on Setup. Blocks every user story.
- **User Stories (Phases 3 through 11)**: each depends on Foundational (Phase 2). User stories may run in parallel by different developers once Foundational is done; in this single-agent execution they run sequentially in priority order P1 -> P2 -> P3.
- **Polish (Phase 12)**: depends on all user stories the team intends to ship.

### User Story Dependencies

- **US1 (P1)**: independent. MVP boundary.
- **US2 (P1)**: depends on the typed Sessionize client (Phase 2 T022); independent of US3, US4, US5, US6, US7, US8, US9 in functionality. Updates `HomeTemplate` to surface a speakers preview, but the home itself shipped with an empty preview in US1.
- **US3 (P1)**: depends on the typed Sessionize client (Phase 2 T022); independent of others.
- **US4 (P2)**: depends only on Phase 2 content loaders. Independent of US1-US3.
- **US5 (P2)**: depends on Phase 2 Eventbrite helpers. Independent of US2/US3 (does not consume Sessionize speaker/session data); shares EventInfo with all stories.
- **US6 (P2)**: depends on US1-US5 templates because past-edition routes reuse them. Last among the P2 set.
- **US7 (P3)**: depends on every page existing (US1-US6) so the sitemap covers them.
- **US8 (P3)**: depends on US1-US7 to audit resilience and accessibility.
- **US9 (P3)**: depends on US1-US8 (deploy is the last step).

### Within each user story

- Tests precede implementation (TDD posture); each `[P]` test task may run in parallel with the others within the story.
- Atoms before molecules before organisms before templates before pages.
- Page tasks come last in their story.

### Parallel opportunities

- All `[P]` tasks in Setup (T002-T005) can run in parallel.
- All `[P]` utility tasks in Foundational (T011-T013) can run in parallel.
- All `[P]` content schema tasks (T015-T019) can run in parallel after T014.
- All `[P]` atom tasks (T027-T030) can run in parallel.
- Within each user story, all `[P]` test tasks and `[P]` molecule tasks can run in parallel.

---

## Implementation Strategy

### MVP First (User Story 1 only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational), in particular T009-T013, T020-T021, T027-T031, T032 to make `app/page.tsx` renderable.
3. Complete Phase 3 (US1).
4. **STOP and VALIDATE**: open `/` in `npm run dev`; confirm hero, countdown, navigation, footer, empty placeholders.
5. Optional early demo to the user / organizers.

### Incremental Delivery

After MVP:

1. US2 -> demo `/speakers` populated and empty.
2. US3 -> demo `/schedule` populated and empty.
3. US4 -> demo all five content pages.
4. US5 -> demo `/register` and `/cfp` matrix.
5. US6 -> demo past-edition routing with a placeholder 2025 folder.
6. US7 -> SEO surface (sitemap, robots, OG, JSON-LD).
7. US8 -> resilience + accessibility audit.
8. US9 -> AWS Amplify deploy.

### Single-developer Strategy (this execution)

Run sequentially: Phase 1 -> Phase 2 -> Phase 3 -> ... -> Phase 12. Use the `[P]` markers to batch related file creations into single editing sessions when possible (e.g., create all five content schema files in one pass).

---

## Notes

- All routes, file names, identifiers, and comments are in English; user-visible copy is in Spanish (constitution Principle VII).
- Each task includes its file path so an LLM can execute it without further context.
- Verify tests fail before implementing the corresponding feature.
- Commit after each user-story checkpoint (US1, US2, ...).
- Stop at any checkpoint to validate the story independently in `npm run dev` and via the Vitest/Playwright suites.
- Avoid: introducing `axios` or any other HTTP library, adding server state to Zustand, implementing persistence in this repo, breaking the atomic-design tier direction.

## Modernization follow-up - 2026-08-23

- [X] T126 Remove the unused TanStack Query provider, Zustand package, and inactive MDX compiler packages after characterization tests and bundle measurement confirmed no consumers.
- [X] T127 Document the restricted Markdown renderer as the current code-of-conduct contract and verify LF and CRLF frontmatter parsing.
- [ ] T128 Validate a populated, multi-room Sessionize schedule in deterministic E2E fixtures before claiming the plenary-layout requirement is complete.
