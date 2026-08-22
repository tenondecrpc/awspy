# Implementation Plan: AWS Community Day Paraguay visual refresh

**Branch**: `002-visual-refresh` | **Date**: 2026-05-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-visual-refresh/spec.md`

## Summary

Refresh the visual layer of the AWS Community Day Paraguay public website so it feels part of the regional AWS Community Day family (Mexico and Colombia as visual references), without changing routes, data flow, component contracts, or the data layer. Concretely:

- Centralize the color palette as the single source of truth in `app/globals.css` via Tailwind v4 `@theme` tokens. Every other file under `app/`, `components/`, and `lib/` consumes those tokens via CSS custom properties or Tailwind utilities. A lint rule enforces the boundary.
- Adopt an AWS-aligned palette (Squid Ink navy, Smile Orange, Hyperlink Blue, neutrals) with semantic token names that work in both light and dark modes (`prefers-color-scheme`-driven, no manual toggle in this iteration).
- Replace the bare "Proximamente" gray box with themed empty states (title, short description, decorative SVG illustration, contextual CTA) on `/speakers`, `/schedule`, `/sponsors`, `/team`, `/venue`, `/faq`, and the home previews.
- Add accessible loading skeletons that mirror the final content shape on `SpeakersGrid`, `ScheduleGrid`, `SponsorsBoard`, and `OrganizersGrid` so suspense states do not produce CLS and respect `prefers-reduced-motion`.
- Reserve image space with explicit aspect ratios under `public/assets/{hero,team,venue,sponsors,gallery,icons/aws-architecture}/`. The site renders themed placeholders when the file is missing and uses the real asset automatically once it is added.
- Decorate the hero with a low-opacity pattern of AWS Architecture Icons (the official public set distributed by AWS), shipped via a reusable `DecorativePattern` atom. No SVG/PNG/WEBP is taken from the Mexico or Colombia sites.

The refresh is visual-only. It does not touch `lib/api/`, `lib/content/`, route handlers, server actions, public component props, Zod schemas, or the revalidation contract. It does not introduce new third-party dependencies.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js 24.15.0 runtime
**Primary Dependencies**: Next.js 16.3.2 (App Router, Server Components), React 19.2.4, Tailwind CSS 4.x (`@theme` tokens), already installed
**Storage**: None. Static visual assets under `public/assets/`. No persistence touched
**Testing**: Vitest 4.x with jsdom for unit and component tests, React Testing Library 16.x with `@testing-library/jest-dom`, Playwright 1.59 for end-to-end (empty states and skeletons under `e2e/empty-states.spec.ts`)
**Target Platform**: Same as v1 (AWS Amplify Hosting primary, cloud-agnostic build). Modern evergreen browsers, mobile and desktop
**Project Type**: Single Next.js application (frontend only, no backend in this repo); reuses the structure scaffolded by feature 001
**Performance Goals**: Same as v1 home Lighthouse on desktop: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95. CLS < 0.1 with simulated 3-5s latency on `/speakers` and `/schedule`
**Constraints**: AA contrast on every text/background pair in light and dark modes; `prefers-reduced-motion` honored on every animation introduced (skeleton pulse, hero pattern fade, section enter); no axios or other HTTP libraries (none added regardless); no new third-party packages; no changes to public component props, routes, or the data layer; build MUST keep failing on malformed `content/editions/{year}/*` files (untouched by this feature); site MUST keep rendering when Sessionize is empty or unreachable (the new empty states and skeletons reinforce this, not change it)
**Scale/Scope**: Same as v1 (~30-50 speakers, ~40-60 sessions per edition, single concurrent edition). The refresh affects every visible surface but a bounded set of files: `app/globals.css`, every `components/` tier (additive plus className-level edits), and a small number of new decorative atoms under `components/atoms/`

## Constitution Check

The constitution at `.specify/memory/constitution.md` is version 1.0.0. This plan is evaluated against each principle:

### Principle I - Frontend-Only Boundary (NON-NEGOTIABLE)

- **PASS**. The feature is visual-only. No backend, no Route Handler with persistent state, no Server Action that owns persistence. No new endpoint is consumed; Sessionize and Eventbrite remain untouched. No secret is read or stored.

### Principle II - Atomic Design Layering

- **PASS**. New decorative pieces (`DecorativePattern`, `IconTile`, `EmptyStateIllustration`, `Placeholder`, `LoadingGrid`) live under `components/atoms/`. They depend only on atoms (`cn`, tokens) and are consumed by molecules/organisms. No atom imports a molecule. Templates compose organisms only. Pages own data fetching as before.

### Principle III - Typed API Boundary with Zod Validation (NON-NEGOTIABLE)

- **PASS**. The data layer (`lib/api/*`, `lib/content/*`) is not modified. No new payload crosses the boundary; all visual data already flows through the validated schemas from feature 001.

### Principle IV - State Layering (Server vs Client)

- **PASS**. No server state is introduced. The skeleton and empty state are pure render-time decisions based on already-validated data; they do not duplicate cache state into Zustand. Existing `useState` islands (mobile drawer, FAQ accordion) are not affected.

### Principle V - Server-First, Statically Rendered Content

- **PASS**. The new empty-state illustrations and decorative patterns are static SVG/CSS rendered server-side. Skeletons render in server components when data is empty/loading. No client-only fetching is introduced. Lighthouse targets stay at the v1 thresholds; CLS is constrained to < 0.1.

### Principle VI - Accessibility Non-Negotiables (NON-NEGOTIABLE)

- **PASS**. AA contrast verified for every token pair (claro and oscuro). Focus rings stay visible (the existing `:focus-visible` rule in `app/globals.css` is preserved). Reduced-motion media query already exists globally and is reused for the new skeleton pulse and hero fade. Decorative SVG is `aria-hidden="true"`. Empty-state blocks expose `role="status"` with `aria-live="polite"`. Skeletons expose `aria-busy="true"` plus an accessible loading label in Spanish. No information is communicated by color alone.

### Principle VII - Language and Formatting Discipline

- **PASS**. Every new code identifier and comment is English ASCII. Every new visible string is Spanish (with proper accents and inverted punctuation when used). No em dashes / en dashes anywhere in the produced markdown, code, or commits.

### Stack and Tooling Constraints

- **PASS**. No new dependency in `package.json`. No CSS framework swap. The lint rule that enforces "no color literals outside `app/globals.css`" is implemented with the existing ESLint plus the existing flat-config setup; it does not require a new package (uses `no-restricted-syntax` on the existing ESLint, or a tiny custom rule in a local plugin file under `eslint.config.mjs`).

### Verification Workflow

- **PASS**. Every task lists the verification scope. Final acceptance requires `npm run lint`, `npm run typecheck`, `npm test`, and at least one Playwright run that exercises empty states (`e2e/empty-states.spec.ts` already exists from v1; tasks extend it to cover the skeleton path).

**Result**: All seven principles plus the stack and verification constraints pass. No constitution violations. The "Complexity Tracking" table at the end of this plan is empty.

A second Constitution Check is performed after Phase 1 artifacts (`research.md`, `data-model.md`, `contracts/`, `quickstart.md`) are produced.

## Project Structure

### Documentation (this feature)

```text
specs/002-visual-refresh/
├── spec.md                                # /speckit.specify output
├── checklists/
│   └── requirements.md                    # /speckit.specify quality checklist
├── plan.md                                # /speckit.plan output (this file)
├── research.md                            # /speckit.plan Phase 0 output
├── data-model.md                          # /speckit.plan Phase 1 output (token map)
├── quickstart.md                          # /speckit.plan Phase 1 output
├── contracts/
│   ├── palette-tokens.md                  # Single source of truth for color tokens
│   ├── public-assets.md                   # Path conventions and placeholder fallbacks
│   └── lint-color-rule.md                 # The lint rule that enforces FR-001 / FR-027
└── tasks.md                               # /speckit.tasks output (NOT created by /speckit.plan)
```

### Source Code (repository root)

The structure scaffolded by feature 001 is reused. Files marked `(new)` are added by this feature; files marked `(edit)` are modified in place; files not listed are not touched.

```text
app/
├── globals.css                            (edit: extend @theme tokens, add light/dark pairs, keep v1 aliases)
├── layout.tsx                             (no edit)
├── page.tsx                               (no edit; consumes the refreshed HomeTemplate)
└── (other routes)                         (no edit; consume refreshed templates)

components/
├── atoms/
│   ├── Badge.tsx                          (edit: token-only colors)
│   ├── Button.tsx                         (edit: token-only colors)
│   ├── Container.tsx                      (no edit)
│   ├── Heading.tsx                        (edit: optional decorative pill prop, opt-in)
│   ├── Link.tsx                           (edit: token-only colors)
│   ├── Section.tsx                        (edit: add `tone="hero"` and `eyebrow` slot)
│   ├── Skeleton.tsx                       (edit: harden a11y attrs and reduced-motion)
│   ├── DecorativePattern.tsx              (new: low-opacity grid of AWS arch icons)
│   ├── EmptyStateIllustration.tsx         (new: token-driven SVG illustrations)
│   ├── Placeholder.tsx                    (new: aspect-ratio reserved image fallback)
│   ├── IconTile.tsx                       (new: square tile with optional AWS icon)
│   └── LoadingGrid.tsx                    (new: skeleton grid building block)
├── molecules/
│   ├── EditionPill.tsx                    (edit: token-only colors)
│   ├── FAQItem.tsx                        (edit: token-only colors)
│   ├── NavLink.tsx                        (edit: token-only colors)
│   ├── OrganizerCard.tsx                  (edit: use Placeholder for avatar fallback)
│   ├── ScheduleSlot.tsx                   (edit: token-only colors)
│   ├── SpeakerCard.tsx                    (edit: refine spacing + token-only colors)
│   └── SponsorCard.tsx                    (edit: use Placeholder for logo fallback)
├── organisms/
│   ├── Countdown.tsx                      (edit: token-only colors, reduced motion)
│   ├── EmptyState.tsx                     (edit: accept illustration slot; default illustration)
│   ├── EventbriteRegisterButton.tsx       (edit: token-only colors)
│   ├── FAQList.tsx                        (edit: token-only colors)
│   ├── Hero.tsx                           (edit: use tone="hero" Section + DecorativePattern)
│   ├── OrganizersGrid.tsx                 (edit: optional skeleton when isLoading)
│   ├── PrivacyFooterNote.tsx              (edit: token-only colors)
│   ├── ScheduleGrid.tsx                   (edit: optional skeleton when isLoading)
│   ├── SessionizeCFPCallout.tsx           (edit: token-only colors)
│   ├── SiteFooter.tsx                     (edit: token-only colors, structure tweaks)
│   ├── SiteHeader.tsx                     (edit: token-only colors, sticky shadow)
│   ├── SpeakersGrid.tsx                   (edit: optional skeleton when isLoading)
│   ├── SponsorsBoard.tsx                  (edit: optional skeleton when isLoading)
│   └── VenueCard.tsx                      (edit: use Placeholder for cover image)
└── templates/
    ├── HomeTemplate.tsx                   (edit: section order, eyebrows, hero tone)
    ├── SpeakersTemplate.tsx               (edit: empty/loading polish)
    ├── ScheduleTemplate.tsx               (edit: empty/loading polish)
    ├── SponsorsTemplate.tsx               (edit: empty/loading polish)
    ├── TeamTemplate.tsx                   (edit: empty/loading polish)
    ├── VenueTemplate.tsx                  (edit: cover placeholder)
    ├── FAQTemplate.tsx                    (edit: empty polish)
    ├── CodeOfConductTemplate.tsx          (no edit)
    ├── CFPTemplate.tsx                    (edit: empty polish)
    ├── RegisterTemplate.tsx               (edit: empty polish)
    ├── EditionsIndexTemplate.tsx          (edit: section polish)
    └── SpeakerDetailTemplate.tsx          (edit: token-only colors)

eslint.config.mjs                          (edit: add no-color-literals rule for src dirs)

public/
└── assets/
    ├── README.md                          (new: documents path conventions)
    ├── hero/                              (new dir; placeholder when empty)
    ├── team/                              (new dir; per-organizer slug)
    ├── venue/                             (new dir; cover.jpg conventional path)
    ├── sponsors/                          (new dir; per-sponsor id, optional)
    ├── gallery/                           (new dir; for past editions)
    └── icons/
        └── aws-architecture/
            ├── README.md                  (new: AWS Architecture Icons attribution)
            └── (a small curated subset of AWS arch SVG icons; ~12-20 files)

tests/
├── unit/
│   └── lib-utils-tokens.test.ts           (new: smoke test that token names exist in CSS)
└── components/
    ├── atoms-decorative-pattern.test.tsx  (new)
    ├── atoms-placeholder.test.tsx         (new)
    ├── atoms-loading-grid.test.tsx        (new)
    ├── atoms-empty-state-illustration.test.tsx (new)
    ├── atoms-skeleton.test.tsx            (new: a11y attrs + reduced-motion)
    ├── organisms-empty-state.test.tsx     (edit: assert illustration slot)
    ├── organisms-speakers-grid.test.tsx   (edit: assert skeleton when isLoading)
    ├── organisms-schedule-grid.test.tsx   (edit: assert skeleton when isLoading)
    ├── organisms-sponsors-board.test.tsx  (edit: assert skeleton when isLoading)
    └── organisms-organizers-grid.test.tsx (edit: assert skeleton when isLoading)

e2e/
├── empty-states.spec.ts                   (edit: assert themed illustration is visible)
└── visual-refresh.spec.ts                 (new: hero pattern, skeleton-to-content, asset placeholder)
```

**Structure Decision**: Single Next.js application at the repository root, reusing the v1 scaffold. The refresh is bounded to `app/globals.css`, the existing `components/` tree (className-level edits and ~5 new decorative atoms), `eslint.config.mjs` (one new rule), and a new `public/assets/` directory with documented conventions. No file is moved between atomic tiers. No new package.

## Phase 0: Outline & Research

`research.md` (companion file) consolidates the decisions that informed the Technical Context above and the contracts produced in Phase 1. Topics resolved in research:

1. **Palette numerical values aligned with AWS public branding**
   - Decision: Use Squid Ink (`#232F3E`) as `--color-brand-primary` (also the hero surface in light mode), Smile Orange (`#FF9900`) as `--color-action`, Hyperlink Blue (`#0073BB`) as `--color-accent`, plus a small set of derived strong/soft variants and AA-verified neutrals.
   - Rationale: These are the colors AWS uses across its own properties and the regional Community Day sites consistently echo them. Using the same hues makes the Paraguay site sit in the same family without copying any specific design.
   - Alternatives considered: Pure-white + magenta (rejected, breaks AWS visual language); gradient-heavy hero (rejected, hurts contrast and Lighthouse).

2. **Single source of truth for tokens**
   - Decision: Tailwind v4 `@theme { ... }` block in `app/globals.css` for both modes; the existing v1 token names are preserved as aliases so v1 components keep working without edits.
   - Rationale: Tailwind v4 already exposes those tokens to utility class generation and to `var(--color-*)` references. One file, two entries (light + dark).
   - Alternatives considered: A separate `tokens.css` (rejected, moves the source of truth and keeps both files in sync); a TypeScript constants file (rejected, would not be reachable from Tailwind utilities).

3. **Lint rule that prohibits color literals outside `app/globals.css`**
   - Decision: ESLint `no-restricted-syntax` selector matching string literals or template literals that contain hex, rgb, rgba, hsl, or hsla, scoped to `app/`, `components/`, and `lib/`. The rule excludes `app/globals.css` (CSS is not linted by ESLint anyway, but the path is ignored explicitly to be safe).
   - Rationale: Zero new dependency, deterministic detection, easy to extend with named-color exceptions. The custom check runs as part of the existing `npm run lint`.
   - Alternatives considered: A Stylelint pipeline (rejected, new dependency); a CI-only `grep` step (rejected, slower feedback).

4. **Decorative iconography source**
   - Decision: Use AWS Architecture Icons (the official public asset pack distributed by AWS, refreshed periodically). A curated subset of ~12-20 SVG icons is committed under `public/assets/icons/aws-architecture/`, with `README.md` documenting the version and source URL.
   - Rationale: Officially published, free for community use, and visually consistent with the AWS design language. Keeps us off third-party CDNs and provides a stable license footprint.
   - Alternatives considered: Reusing SVGs from Mexico's `Pattern.svg` or Colombia's tier graphics (rejected, those are works of authorship from those communities); a Lucide / Heroicons mix (rejected, lacks the AWS visual signal).

5. **Empty-state visual treatment**
   - Decision: A reusable `EmptyStateIllustration` atom that draws a token-only SVG (curves and subtle shapes, no text inside). The existing `EmptyState` organism gets an optional `illustration` slot; when omitted, the default illustration renders.
   - Rationale: One illustration vocabulary across the site, no PNG dependency, no copyright concern, fully themable in light/dark.
   - Alternatives considered: PNG illustrations from a stock set (rejected, license risk and weight); per-section bespoke SVG (rejected, premature variety).

6. **Loading skeleton shape parity**
   - Decision: For each list/grid that today renders an empty state, expose an optional `isLoading` prop. When `true`, render a `LoadingGrid` skeleton with the same row count, gap, and item template as the populated state. The pulse animation is paused under `prefers-reduced-motion`.
   - Rationale: Eliminates CLS, communicates progress, and is intrinsically accessible (`aria-busy`, `role="status"`, Spanish hidden label).
   - Alternatives considered: A spinner (rejected, less informative and prone to jank); rendering the empty state with a fade (rejected, conflates "loading" with "empty").

7. **Image placeholder strategy**
   - Decision: A `Placeholder` atom that takes `aspectRatio`, `kind` (avatar | logo | cover | hero), and an optional `label` (e.g. initials). When a real file is later added under `public/assets/...`, the consuming molecule swaps from `Placeholder` to `next/image` without layout shift.
   - Rationale: Reserves space, avoids 404 image flashes, and keeps the asset upload flow purely a content task with no code change.
   - Alternatives considered: `next/image` with a placeholder data-URI (rejected, requires the URL to exist already); blur-up placeholders (rejected, requires an image upstream).

8. **Dark mode behavior**
   - Decision: Driven by `prefers-color-scheme` only. No JS toggle. Both modes share the same semantic token names; only the values differ in the `@media (prefers-color-scheme: dark)` block.
   - Rationale: Keeps the surface area minimal for v1 of the refresh and respects user OS preference.
   - Alternatives considered: A manual toggle (deferred to a future feature); a system-driven toggle that overrides user OS (rejected as user-hostile).

9. **Hero composition**
   - Decision: A `Section` with `tone="hero"` (new variant on the existing atom) wraps the hero content. A `DecorativePattern` atom renders the low-opacity AWS Arch icons grid behind the heading. The CTAs reuse the existing `Button` variants with action-orange primary and ghost-on-dark secondary.
   - Rationale: Keeps the hero composable from primitives, decorative pattern is reusable in other sections (e.g. CTA banners), and CTA semantics do not change.
   - Alternatives considered: A gradient hero (rejected, hurts contrast); a video hero (rejected, weight, motion concerns).

10. **Animation intensity**
    - Decision: Subtle defaults, all suppressed under `prefers-reduced-motion: reduce` by the global rule already in `app/globals.css`. Animations introduced: the skeleton pulse, a 200ms fade-in on the hero pattern, and a 150ms ease-in on Section enter (used sparingly).
    - Rationale: Adds polish without competing with content. The global reduced-motion rule already neutralizes everything.
    - Alternatives considered: Heavier scroll animations (rejected, motion fatigue); zero animation (rejected, the skeleton needs a pulse to read as "loading").

**Output**: `research.md` with all NEEDS CLARIFICATION resolved.

## Phase 1: Design & Contracts

`data-model.md`, `contracts/palette-tokens.md`, `contracts/public-assets.md`, `contracts/lint-color-rule.md`, and `quickstart.md` are produced as companion files in this feature directory.

### data-model.md

This feature does not introduce backend or content entities. The `data-model.md` documents the **token map** (the only "data" this refresh adds): the list of semantic tokens, the values assigned in each mode (light and dark), the AA-verified contrast pairs, and the legacy v1 tokens that are kept as aliases.

### contracts/

- `contracts/palette-tokens.md`: the authoritative list of tokens (`--color-brand-primary`, `--color-action`, `--color-accent`, `--color-surface`, `--color-surface-muted`, `--color-surface-hero`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-on-action`, `--color-text-on-accent`, `--color-text-on-hero`, `--color-border-subtle`, `--color-border-strong`, `--color-focus`, `--color-success`, `--color-warning`, `--color-danger`, plus the v1 aliases). Each token gets: light value, dark value, intended usage, and the contrast pair(s) it must satisfy.
- `contracts/public-assets.md`: the path conventions for `public/assets/{hero,team,venue,sponsors,gallery,icons/aws-architecture}/`, the expected aspect ratios per category, the file-name conventions (e.g. `team/<slug>.jpg`, `sponsors/<id>.png`, `venue/cover.jpg`), the placeholder behavior when the file is missing, and the no-scraping policy for MX and CO.
- `contracts/lint-color-rule.md`: the ESLint rule definition: matched patterns (hex `#abc`/`#aabbcc`, `rgb(`, `rgba(`, `hsl(`, `hsla(`), scope (`app/`, `components/`, `lib/`), exceptions (`currentColor`, `inherit`, `transparent`, `none`, the `app/globals.css` file itself), and how it integrates with the existing `npm run lint` flow.

### quickstart.md

A short "from zero to running" guide for a contributor who picks up the refresh: where the tokens live, how to add a new section that respects the palette, how to use `Placeholder` and `LoadingGrid`, how to add an asset under `public/assets/`, and how to verify the refresh locally (lint, typecheck, vitest, playwright, dev server).

### Agent context update

`update-agent-context.sh claude` is run at the end of Phase 1 to refresh the agent-specific context file with the small set of additions (no new tech, just a curated AWS Architecture Icons drop and a custom ESLint rule).

## Post-Design Constitution Re-check

Re-evaluating each principle after the Phase 1 artifacts are produced:

- **Frontend-Only Boundary**: contracts confirm no backend, no Route Handler with persistent state, no secret. PASS.
- **Atomic Design Layering**: the token map and the public-assets contract make explicit which tier owns what. The five new atoms have no upward dependency. PASS.
- **Typed API Boundary with Zod Validation**: `lib/api/*` and `lib/content/*` are not edited. PASS.
- **State Layering**: skeletons are render-time decisions; no client store is touched. PASS.
- **Server-First, Statically Rendered Content**: every new piece is a server-rendered atom. Lighthouse/CLS targets are recorded as SC-005 and SC-003 in the spec. PASS.
- **Accessibility Non-Negotiables**: contracts reaffirm AA contrast on each token pair, `aria-hidden` on every decorative SVG, `role="status"` on the empty state, `aria-busy` on the skeleton, focus visible. PASS.
- **Language and Formatting Discipline**: all artifacts produced are English ASCII; user-facing strings are Spanish. PASS.

**Result**: Post-design check passes. No deviations to record.

## Complexity Tracking

> Fill ONLY if Constitution Check has violations that must be justified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|

(No violations.)
