# Preview data

Placeholder data for the sections that ship with no real content yet:
sponsors, the organizing team, the venue, the schedule and the speakers.
None of it reaches a deployed build.

## One command

```bash
npm run dev:preview
```

Next.js allows a single dev server per directory, so stop a running
`npm run dev` first. Extra arguments are forwarded:
`npm run dev:preview -- -p 3001`.

That wires up two things and nothing else:

1. `CONTENT_PREVIEW=1`, which makes the content loaders prefer a
   `<name>.example.json` sibling over the live file when one exists. The
   resolver is `editionFile` in `lib/content/_fs.ts`.
2. `NEXT_PUBLIC_SESSIONIZE_BASE_URL` pointed at a local fixture server, so
   `/schedule` and `/speakers` get a full day of sessions instead of the
   empty state. That override is the one `.env.example` already documents.

**The live content files are never modified**, so there is nothing to revert
and no way to commit placeholder records by accident.

## Why a production build ignores it

The site is public. Placeholder sponsors or team members must not be
reachable from a deployed build even if `CONTENT_PREVIEW` were set in the
hosting environment, so `editionFile` returns the live path whenever
`NODE_ENV` is `production`. `tests/unit/lib-content-preview.test.ts` locks
that behavior down.

## What is in here

### `sessionize/`

A full event day on the real date (2026-10-17) across four rooms, so the
per-room accents, the plenary badges and the time chips all have something to
render. Four views are served, matching the real API shape: `GridSmart`,
`Speakers`, `Sessions`, `SpeakerWall`.

`scripts/preview-sessionize.mjs` answers the same URL shape as Sessionize
(`/{eventId}/view/{View}`); the event id is ignored. Run it on its own with
`npm run preview:data` to point something else at it.

### `../editions/2026/*.example.json`

| Live file          | Placeholder file           |
|--------------------|----------------------------|
| `sponsors.json`    | `sponsors.example.json`    |
| `organizers.json`  | `organizers.example.json`  |
| `venue.json`       | `venue.example.json`       |

They validate against the same Zod schemas as production content, so a
placeholder that would not load as real content fails the test suite.

Adding an `*.example.json` sibling for another edition file is enough to make
it available; the loader has to call `editionFile` rather than building the
path itself, which `sponsors`, `organizers` and `venue` already do.

## The names are fake on purpose

Every placeholder reads as a placeholder ("Demo Cloud", "Ana Demo"). A
real-looking sponsor wall or team list would mislead attendees if it ever
reached production. Replace the placeholders with real records rather than
editing the fake ones.

The sponsor logos they point at live in `public/logos/demo-*.svg` and are
placeholder marks, not real brand assets.
