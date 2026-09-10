# Preview data

Placeholder data for the sections that ship with no real content yet:
sponsors, the organizing team, the venue, the schedule and the speakers.
None of it reaches a deployed build.

## Two ways in

### Sponsors, team and venue: your normal `npm run dev`

These three come from version-controlled JSON, so all they need is
`CONTENT_PREVIEW=1`. Put it in `.env.local`, which is gitignored, and the dev
server you already run picks it up:

```bash
echo "CONTENT_PREVIEW=1" >> .env.local
npm run dev
```

Each substituted file is announced once in the terminal, so there is never
any doubt about which mode you are looking at:

```
[content] CONTENT_PREVIEW=1: serving placeholder sponsors.json from its
.example sibling. Not what a deployed build serves.
```

Remove the line from `.env.local` to go back to the real (empty) content.

### All five sections, including the schedule: `npm run dev:preview`

The schedule and the speakers come from the Sessionize API rather than these
files, so they also need the local fixture server. One command starts both:

```bash
npm run dev:preview
```

It sets `CONTENT_PREVIEW=1`, starts the fixture server, points
`NEXT_PUBLIC_SESSIONIZE_BASE_URL` at it and then runs `next dev`, forwarding
any arguments (`npm run dev:preview -- -p 3001`).

**Stop a running `npm run dev` first.** Next.js allows one dev server per
directory, and the lock is per directory rather than per port, so a second
one is refused even on a different port - while the first keeps answering and
the sections still look empty. `dev:preview` reads `.next/dev/lock` and
refuses up front with the offending pid rather than letting that happen
quietly.

**The live content files are never modified**, either way, so there is
nothing to revert and no way to commit placeholder records by accident.

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
