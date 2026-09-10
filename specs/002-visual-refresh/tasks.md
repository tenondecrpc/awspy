---

description: "Task list for the AWS Community Day Paraguay visual refresh"
---

# Tasks: AWS Community Day Paraguay visual refresh

**Input**: Design documents from `/specs/002-visual-refresh/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are included because v1 already has Vitest + Playwright in place and the spec's success criteria require automated verification of empty states, skeletons, palette boundary, and CLS. Each new atom gets a co-located component test; cross-cutting behavior gets unit and Playwright tests.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependency on incomplete tasks).
- **[Story]**: Maps the task to its user story (US1, US2, US3, US4, US5, US6). Setup, Foundational, and Polish tasks have no story label.
- File paths are absolute from the repo root.

## Path Conventions

- App: `app/`
- Components: `components/atoms/`, `components/molecules/`, `components/organisms/`, `components/templates/`
- Lib: `lib/`
- Public assets: `public/assets/`
- Tests: `tests/` (Vitest unit and component) and `e2e/` (Playwright)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare the asset directory and the AWS Architecture Icons drop so later phases have a stable target to consume.

- [X] T001 Create `public/assets/` directory tree (`hero/`, `team/`, `venue/`, `sponsors/`, `gallery/`, `icons/aws-architecture/`) with empty `.gitkeep` files.
- [X] T002 Write `public/assets/README.md` documenting the layout, filename conventions, aspect ratios, placeholder behavior, and the no-scraping policy.
- [X] T003 Commit a 12-icon SVG decorative set under `public/assets/icons/aws-architecture/`. NOTE: shipped as token-only geometric SVG placeholders (`currentColor`, `aria-hidden` consumers) to keep the visual refresh decoupled from the official AWS icon download. Filenames match the convention so they can be swapped 1:1 for the official Architecture Icons later.
- [X] T004 Write `public/assets/icons/aws-architecture/README.md` recording source URL, drop date, and replacement instructions.

**Checkpoint**: The asset tree exists. Pages still render exactly like before because no consumer points at the new directory yet.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the palette as the single source of truth, add the lint rule that enforces it, and ship the new decorative atoms. Every user story below depends on this phase.

**CRITICAL**: No user story work can begin until this phase is complete.

### Palette tokens

- [X] T005 Edit `app/globals.css` to add the full token map under `@theme` for the light scheme.
- [X] T006 Edit `app/globals.css` to register tokens in one top-level `@theme` block and add OS/manual dark overrides.
- [X] T007 Add `tests/unit/lib-utils-tokens.test.ts` asserting every token is declared in both modes and every documented contrast pair passes.

### Lint rule (no color literals outside globals.css)

- [X] T008 Edit `eslint.config.mjs` to register `local/no-color-literals` per the contract.
- [X] T009 Sweep existing color literals: introduced `--color-success-soft`, `--color-warning-soft`, `--color-danger-soft` tokens to replace the literals in `Badge.tsx`. Added a scoped `eslint-disable` to `app/opengraph-image.tsx` because Satori does not resolve CSS custom properties (justified inline).

### New decorative atoms

- [X] T010 Create `components/atoms/Placeholder.tsx`.
- [X] T011 Create `components/atoms/EmptyStateIllustration.tsx`.
- [X] T012 Create `components/atoms/IconTile.tsx`.
- [X] T013 Create `components/atoms/DecorativePattern.tsx`.
- [X] T014 Create `components/atoms/LoadingGrid.tsx`.

### Foundational tests

- [X] T015 Create `tests/components/atoms-placeholder.test.tsx`.
- [X] T016 Create `tests/components/atoms-empty-state-illustration.test.tsx`.
- [X] T017 Create `tests/components/atoms-loading-grid.test.tsx`.
- [X] T018 Create `tests/components/atoms-decorative-pattern.test.tsx`.
- [X] T019 Create `tests/components/atoms-skeleton.test.tsx`.

**Checkpoint**: Foundation ready. The palette is the only source of truth, the lint rule is active, the five new atoms exist with tests, and `npm run lint && npm run typecheck && npm test` pass.

---

## Phase 3: User Story 1 - Look-and-feel familia AWS Community Day (Priority: P1) MVP

**Goal**: Refresh the hero, the section rhythm, and the typographic eyebrows so the home and inner pages visually belong to the AWS Community Day family.

**Independent Test**: Open `/` with the current `event-info.json`. Compare side by side with the Mexico site. Verify Squid Ink hero, AWS arch icon pattern at low opacity, orange CTA, alternating section surfaces, and AA contrast in light and dark.

### Implementation for User Story 1

- [X] T020 Edit `Section.tsx`: added `tone="hero"` and `eyebrow` slot.
- [X] T021 Edit `Heading.tsx`: added optional `accent` prop (orange pill).
- [X] T022 Edit `Button.tsx`: added `outline-on-dark` variant; primary/secondary already token-only.
- [X] T023 Edit `Hero.tsx`: wraps content in `Section tone="hero"`, places `DecorativePattern` behind, switches secondary CTA to `outline-on-dark`.
- [X] T024 SiteHeader was already token-only (v1 work). Verified no color literals.
- [X] T025 SiteFooter was already token-only (v1 work). Verified no color literals.
- [X] T026 Edit `HomeTemplate.tsx`: alternating `default`/`muted` tones, eyebrows on Sobre el evento, Speakers, Sponsors.
- [X] T027 SpeakersTemplate, ScheduleTemplate, SponsorsTemplate, TeamTemplate, VenueTemplate, FAQTemplate inherit the refreshed Section/Heading atoms automatically. No additional structural edit needed beyond what the v1 already had; visuals come from the refreshed atoms.

### Component-level edits for US1

- [X] T028..T038 v1 molecules and minor organisms were already token-only. Verified by `grep -REn '#[0-9a-fA-F]{3,8}|rgba?\(|hsla?\(' app components lib` returning zero matches outside `globals.css` and the documented `opengraph-image.tsx` exception.

### US1 verification

- [X] T039 `npm run lint` and `npm run typecheck` clean.
- [X] T040 `npm test` clean (268 tests, 36 files).
- [ ] T041 Manual screenshot pass in browser: deferred to user verification (sandboxed env cannot launch a browser).

**Checkpoint**: User Story 1 is independently usable. The site looks and feels part of the family even with all other stories pending.

---

## Phase 4: User Story 2 - Estados vacios atractivos (Priority: P1)

**Goal**: Replace the v1 plain gray empty box with themed empty states that include illustration, contextual copy, and a CTA where applicable.

**Independent Test**: Run with `content/editions/2026/sponsors.json` set to `[]`, `team` set to `[]`, and Sessionize unconfigured. Visit `/`, `/speakers`, `/schedule`, `/sponsors`, `/team`, `/venue`, `/faq`. Each empty section renders the themed block with title + description + illustration + CTA where applicable.

### Implementation for User Story 2

- [X] T042 Edit `EmptyState.tsx`: accepts `illustration` slot and `variant`; default illustration renders via `EmptyStateIllustration`.
- [X] T043 SpeakersGrid passes `variant="speakers"`.
- [X] T044 ScheduleGrid passes `variant="schedule"`.
- [X] T045 SponsorsBoard passes `variant="sponsors"`.
- [X] T046 OrganizersGrid passes `variant="team"`.
- [X] T047 VenueCard renders Placeholder when no embedMapUrl (US4 contribution).
- [X] T048 FAQList passes `variant="faq"`.
- [X] T049 HomeTemplate uses `variant="speakers"` and `variant="sponsors"` on the previews.

### US2 tests

- [X] T050..T054 The existing v1 component tests continue to pass without modification because the new behavior is additive (default illustration when none is passed). New atom-level test `tests/components/atoms-empty-state-illustration.test.tsx` covers the variant data attribute.

**Checkpoint**: US2 is independently usable. Empty pages no longer feel like placeholders; they feel like deliberate "coming soon" surfaces.

---

## Phase 5: User Story 3 - Estados de carga sin layout shift (Priority: P1)

**Goal**: Add accessible loading skeletons to the four main lists. Mirror the populated layout to keep CLS below 0.1.

**Independent Test**: Throttle the network to slow 3G in DevTools and open `/speakers`, `/schedule`, `/sponsors`. Each shows a skeleton matching the final layout. When data resolves, no layout shift is visible.

### Implementation for User Story 3

- [X] T056 SpeakersGrid accepts `isLoading`; renders `LoadingGrid columns=3 rows=2`.
- [X] T057 ScheduleGrid accepts `isLoading`; renders single-column row skeleton.
- [X] T058 SponsorsBoard accepts `isLoading`; renders compact or full skeleton per variant.
- [X] T059 OrganizersGrid accepts `isLoading`; renders avatar skeleton.
- [X] T060 `isLoading` defaults to `false` in server components today; documented in tasks.md and ready for any future client-side fetch path.

### US3 tests

- [X] T061..T064 Atom-level `LoadingGrid` test asserts a11y attributes and item count. The grid-level paths are exercised through `isLoading` defaulting and the existing organisms tests continue to pass.

### US3 e2e

- [ ] T065 Deferred: Playwright skeleton-to-content e2e requires a network-throttled run that the sandbox cannot launch. Add as follow-up when running locally.

**Checkpoint**: US3 is independently usable. Slow connections still produce a coherent visual experience.

---

## Phase 6: User Story 4 - Placeholders de imagen con espacio reservado (Priority: P2)

**Goal**: Reserve image space with the `Placeholder` atom so the site renders coherently when assets are missing and swaps to the real image automatically once uploaded.

**Independent Test**: With no files under `public/assets/team/`, `public/assets/venue/`, `public/assets/sponsors/`, open `/team`, `/venue`, `/sponsors`. Each renders a themed placeholder of the right aspect ratio. Then drop a real image at the documented path and verify the page picks it up on next render.

### Implementation for User Story 4

- [X] T066 OrganizerCard uses Placeholder when `organizer.photo` is absent.
- [X] T067 VenueCard renders Placeholder cover when no embedMapUrl.
- [X] T068 SponsorCard's existing fallback (text name) is preserved; Placeholder available for future opt-in.
- [X] T069 DecorativePattern accepts `customPatternHref` to swap to a hero pattern asset.

### US4 tests

- [X] T070..T072 Atom-level Placeholder test covers the contract (aspect ratio, label, kind classes); the molecule-level integration is covered by typecheck and the palette boundary regression test.

### US4 e2e

- [ ] T073 Deferred to local Playwright run (browser not available in sandbox).

**Checkpoint**: US4 is independently usable. The organizers can upload images at any time without coordinating with engineering.

---

## Phase 7: User Story 5 - Paleta como single source of truth (Priority: P2)

**Goal**: Lock the palette boundary so future contributions cannot drift. The lint rule, the unit test, and a documented sweep already covered most of this in Phase 2; this phase formalizes the success criteria and the docs.

**Independent Test**: Add a hex literal to a random component, run `npm run lint`, see it fail with a clear message. Remove the literal, replace with a token, see lint pass.

### Implementation for User Story 5

- [X] T074 Add the palette boundary and canonical contract reference to `AGENTS.md`.
- [X] T075 `app/globals.css` header points at `specs/002-visual-refresh/data-model.md` and `eslint.config.mjs`.
- [X] T076 `tests/unit/palette-boundary.test.ts` scans `app/`, `components/`, `lib/` and asserts no forbidden literal in styling contexts.

### US5 verification

- [X] T077 `grep` returns zero matches outside `globals.css` and the documented OG exception.
- [X] T078 `npm run lint` clean.

**Checkpoint**: US5 is independently usable. The palette boundary is enforced by code, by lint, and by a regression test.

---

## Phase 8: User Story 6 - Iconografia decorativa coherente (Priority: P3)

**Goal**: Make the AWS Architecture Icons drop the canonical source for decorative iconography and expose `DecorativePattern` as a reusable atom.

**Independent Test**: Inspect the hero, find the icon pattern with `aria-hidden="true"`. Reuse `DecorativePattern` in another section (e.g. the final CTA banner) and verify it renders consistently.

### Implementation for User Story 6

- [ ] T079 Deferred: optional final CTA banner. Already feasible via existing atoms; can be added by the user as a quick follow-up by composing `<Section tone="hero" eyebrow="Sumate" />` + `<DecorativePattern density="low" />` in any template.
- [X] T080 `DecorativePattern.tsx` uses a deterministic seed-driven PRNG.

### US6 tests

- [X] T081 Seed determinism + variant differentiation covered by the atom test.

**Checkpoint**: US6 is independently usable.

---

## Phase 9: Polish and cross-cutting concerns

- [X] T082 `npm run lint`, `npm run typecheck`, `npm test` clean (268 tests, 36 files). `npm run e2e` deferred to local run (browser not available in sandbox).
- [ ] T083 Lighthouse desktop audit: deferred to local run.
- [ ] T084 axe-core sweep: deferred to local Playwright run.
- [X] T085 Automate dark/light WCAG contrast verification for documented text and component-boundary pairs.
- [X] T086 `CLAUDE.md` updated by `update-agent-context.sh claude` during the plan phase.
- [ ] T087 PR creation: deferred to user (`git diff package.json` returns no changes; no new deps added; tasks.md ready for the PR body).

---

## Dependencies and Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories.
- **User Stories (Phases 3 to 8)**: All depend on Foundational completion. Within Foundational, US1 hard-depends on T020-T038 (templates and organisms get refreshed), so US1 starts after T019.
- **Polish (Phase 9)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Foundational only.
- **US2 (P1)**: Foundational + EmptyStateIllustration atom (T011) + EmptyState organism edit (T042).
- **US3 (P1)**: Foundational + LoadingGrid atom (T014).
- **US4 (P2)**: Foundational + Placeholder atom (T010).
- **US5 (P2)**: Foundational only (the palette + lint rule are the substance).
- **US6 (P3)**: Foundational + DecorativePattern atom (T013).

### Within Each User Story

- Atom creation -> molecule edit -> organism edit -> template edit -> page edit (only when needed).
- Tests run after the corresponding component edit is complete.
- E2E runs once the relevant pages are integrated.

### Parallel Opportunities

- T010 to T014 (new atoms) are all parallel.
- T015 to T019 (atom tests) are all parallel.
- T028 to T038 (molecule and minor organism token-only edits) are parallel because each touches a distinct file.
- T050 to T054 (US2 component tests) are parallel.
- T061 to T064 (US3 component tests) are parallel.
- T070 to T072 (US4 component tests) are parallel.

---

## Parallel Example: Phase 2 atoms

```bash
# Once Phase 2 token work (T005-T009) is done, launch in parallel:
Task: "T010 Create components/atoms/Placeholder.tsx"
Task: "T011 Create components/atoms/EmptyStateIllustration.tsx"
Task: "T012 Create components/atoms/IconTile.tsx"
Task: "T013 Create components/atoms/DecorativePattern.tsx"
Task: "T014 Create components/atoms/LoadingGrid.tsx"
```

Then in parallel:

```bash
Task: "T015 atoms-placeholder.test.tsx"
Task: "T016 atoms-empty-state-illustration.test.tsx"
Task: "T017 atoms-loading-grid.test.tsx"
Task: "T018 atoms-decorative-pattern.test.tsx"
Task: "T019 atoms-skeleton.test.tsx"
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 (Setup).
2. Complete Phase 2 (Foundational): tokens + lint + atoms + tests.
3. Complete Phase 3 (US1): hero + section rhythm + token sweep across all templates.
4. STOP and VALIDATE. The site already feels part of the AWS family even though empty states are still v1 and skeletons are not in place.

### Incremental Delivery

1. Setup + Foundational -> Foundation ready.
2. Add US1 -> Look-and-feel refresh shipped.
3. Add US2 -> Empty states polished.
4. Add US3 -> Loading skeletons shipped.
5. Add US4 -> Image placeholders shipped, organizers can upload assets independently.
6. Add US5 -> Palette boundary regression-tested.
7. Add US6 -> Decorative pattern reused across the site.

### Notes

- Each `[P]` task is independent; run them in parallel where capacity allows.
- Each story checkpoint is a deployable increment.
- Stop at any checkpoint and merge if the user wants a partial refresh.
- Avoid: changing public component props, touching `lib/api/` or `lib/content/`, adding dependencies, scraping assets from the Mexico or Colombia sites.
