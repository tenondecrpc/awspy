# Quickstart: Visual refresh

A short guide for anyone (human or agent) picking up the visual refresh.

## What this feature changes

- Centralizes the color palette in `app/globals.css` via Tailwind v4 `@theme` tokens.
- Adds five new decorative atoms: `DecorativePattern`, `Placeholder`, `LoadingGrid`, `IconTile`, `EmptyStateIllustration`.
- Polishes empty states (illustration + CTA) and adds loading skeletons that mirror the populated layout.
- Introduces `public/assets/{hero,team,venue,sponsors,gallery,icons/aws-architecture}/` with documented conventions.
- Adds an ESLint rule that forbids color literals outside `app/globals.css`.

## What this feature does NOT change

- Public component props or types.
- Routes, server actions, route handlers.
- The data layer (`lib/api/*`, `lib/content/*`, Zod schemas).
- The package manifest (`package.json`).
- Sessionize-driven speaker headshots (still come from the API).

## Prerequisites

- Node.js 20.x and npm.
- The repository scaffolded by feature 001 (already in place).

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`.

## Where to look

- Tokens: `app/globals.css` (the only place). The full token map is in `specs/002-visual-refresh/data-model.md`.
- New atoms: `components/atoms/DecorativePattern.tsx`, `Placeholder.tsx`, `LoadingGrid.tsx`, `IconTile.tsx`, `EmptyStateIllustration.tsx`.
- Refreshed organisms: `Hero.tsx`, `EmptyState.tsx`, `SpeakersGrid.tsx`, `ScheduleGrid.tsx`, `SponsorsBoard.tsx`, `OrganizersGrid.tsx`, `VenueCard.tsx`, `SiteHeader.tsx`, `SiteFooter.tsx`.
- Asset conventions: `public/assets/README.md` and `specs/002-visual-refresh/contracts/public-assets.md`.

## Common tasks

### Add a new section to a template

1. Compose a `<Section tone="default">` (or `tone="muted"`, or `tone="hero"`).
2. Use `<Heading level={2}>` for the title.
3. Pull copy and CTAs from `event-info` or props; do not hardcode Spanish strings inside atoms.
4. If the section renders a list, accept an optional `isLoading?: boolean` and render `<LoadingGrid>` when `true` and the list is empty; render `<EmptyState>` when the list is empty and `isLoading` is `false` or absent.

### Use a palette token in a component

```tsx
// Tailwind v4 utilities derived from @theme:
<div className="bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]" />

// or via inline style:
<span style={{ color: "var(--color-accent)" }} />
```

Do NOT inline a hex literal. The lint rule will fail.

### Reserve image space with a Placeholder

```tsx
import { Placeholder } from "@/components/atoms/Placeholder";

<Placeholder kind="avatar" aspectRatio={1} label="JD" />
<Placeholder kind="cover" aspectRatio={16 / 9} />
```

When a real file is uploaded under `public/assets/team/<slug>.jpg` (or `public/assets/venue/cover.jpg`, etc.), the consuming molecule renders `next/image` instead, with the same aspect ratio. No code change required to swap.

### Add a new asset

1. Place the file under the right sub-directory of `public/assets/` (see `public/assets/README.md`).
2. Use the documented filename convention (`<slug>.jpg`, `cover.jpg`, etc.).
3. Reload the dev server. The page renders the real asset on next request.

### Add a new AWS Architecture Icon

1. Download the SVG from the official AWS Architecture Icons distribution.
2. Save it under `public/assets/icons/aws-architecture/`.
3. Update `public/assets/icons/aws-architecture/README.md` if the version date changed.

## Verification

Before reporting the refresh complete, run all of:

```bash
npm run lint
npm run typecheck
npm test
npm run e2e
```

Manually verify in a browser:

- The home page hero shows Squid Ink navy with the AWS icon pattern at low opacity, an orange CTA, and an outline secondary CTA.
- `/speakers`, `/schedule`, `/sponsors`, `/team`, `/venue` show themed empty states (title + description + illustration + CTA where applicable) when their data sources are empty.
- Throttling the network in DevTools (slow 3G) on `/speakers` shows a skeleton grid that matches the final layout, and the layout does not shift when data loads.
- Toggling the OS to dark mode flips the palette without breaking contrast.

## Common pitfalls

- Forgetting to escape Spanish characters in `aria-label`. The repository allows accents and inverted punctuation in user-facing strings; in `aria-label` they should still read naturally.
- Adding a hex literal "just for now". The lint rule will catch it; use a token from the start.
- Reusing an SVG from the Mexico or Colombia community sites. Forbidden by the contract; use the official AWS Architecture Icons drop or a token-only SVG drawn for this repo.

## Next steps

After running `/speckit.tasks`, `tasks.md` will contain the dependency-ordered task list. Run `/speckit.implement` (or work the tasks manually) to apply the refresh.
