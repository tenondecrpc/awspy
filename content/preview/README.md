# Preview data

Placeholder data for the sections that ship with no real content yet:
sponsors, the organizing team, the venue, the schedule and the speakers.
None of it reaches a deployed build.

## Two ways in

### Sponsors, team and venue: nothing to configure

These three come from version-controlled JSON, and preview mode is on by
default, so your normal command already shows them:

```bash
npm run dev
```

Each substituted file is announced once in the terminal, so there is never
any doubt about which mode a page is rendering:

```
[content] preview mode: serving placeholder sponsors.json from its .example
sibling. Set CONTENT_PREVIEW=0 to turn it off.
```

### All five sections, including the schedule: `npm run dev:preview`

The schedule and the speakers come from the Sessionize API rather than these
files, so they also need the local fixture server. One command starts both:

```bash
npm run dev:preview
```

It starts the fixture server, points `NEXT_PUBLIC_SESSIONIZE_BASE_URL` at it
and then runs `next dev`, forwarding any arguments
(`npm run dev:preview -- -p 3001`).

**Stop a running `npm run dev` first.** Next.js allows one dev server per
directory, and the lock is per directory rather than per port, so a second
one is refused even on a different port - while the first keeps answering and
the schedule still looks empty. `dev:preview` reads `.next/dev/lock` and
refuses up front with the offending pid rather than letting that happen
quietly.

**The live content files are never modified**, either way, so there is
nothing to revert and no way to commit placeholder records by accident.

## On by default, deployed builds included

This is on everywhere until it is switched off:

| `CONTENT_PREVIEW`  | Result                     |
|--------------------|----------------------------|
| unset / `1` / `true` | **on** (the default)     |
| `0` / `false`      | off, serve the real content |

That is a deliberate choice for this stage of the project, and it has a
consequence worth stating plainly: **the deployed public site serves
placeholder sponsors, a placeholder organizing team and a placeholder venue
address to real visitors**, alongside the real speakers and the real
registration link. Every substituted file logs a warning on boot:

```
[content] WARNING: serving placeholder sponsors.json to visitors.
Set CONTENT_PREVIEW=0 and redeploy to serve the real content.
```

Two ways to switch off:

- **Everything**: set `CONTENT_PREVIEW=0` in the Amplify environment
  variables and redeploy.
- **One section**: delete its `*.example.json`. Only files with a sibling are
  ever substituted, so `venue.example.json` can go while the sponsors stay -
  useful because the placeholder venue carries a fake street address, which
  is the most consequential thing here for someone reading it as real.

`tests/unit/lib-content-preview.test.ts` locks every cell of that table down.

## What is in here

### `sessionize/`

A full event day on the real date (2026-10-17) across four rooms, so the
per-room accents, the plenary badges and the time chips all have something to
render. Four views are served, matching the real API shape: `GridSmart`,
`Speakers`, `Sessions`, `SpeakerWall`.

The two agenda views (`Sessions`, `GridSmart`) read as a real programme rather
than announcing themselves as sample text: the topics a Community Day
actually runs (serverless, observability, FinOps, identity, data, containers,
a Bedrock and a CDK workshop), billed to eight invented but plausible names.
It is deliberate and temporary - it stands in while the real talks, speakers
and rooms are organised, and Sessionize takes over the day the `GridSmart`
view has a session.

What marks those records instead is an internal boolean: every placeholder
session carries `"isMockup": true`, declared on the session schemas in
`lib/api/sessionize.ts` and left `undefined` otherwise - which is exactly what
a live Sessionize payload parses to, since the provider never sends the field.
Anything that has to tell the two apart reads it, and
`tests/unit/lib-api-sessionize-preview.test.ts` keeps both halves honest: the
flag on every fixture session, and no "ejemplo" / "mockup" wording in the
copy. The invented names were checked against this edition's live Sessionize
roster so none of them collides with a real speaker.

The two people views (`Speakers`, `SpeakerWall`) are **not** part of that and
keep their obviously-fake "Demo" names. They are also the views least likely
to be seen: the live roster for this edition is already populated, so the
fixture only stands in locally and in the e2e run. The visible consequence
there is that `/speakers` lists Ana Demo while `/schedule` bills Lucía
Benítez; in a deployed build the two never coexist, because only the empty
view is ever substituted.

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

## Two different kinds of placeholder

The **content** placeholders read as placeholders. Sponsors, the organising
team and the venue all carry obviously fake names ("Demo Cloud"), because a
real-looking sponsor wall or team list would mislead attendees if it ever
reached production. Replace them with real records rather than editing the
fake ones.

The **agenda** placeholder under `sessionize/` does the opposite, on purpose,
so the schedule can be reviewed as a design while the real one is being
organised. Nothing in its wording says "example"; the `isMockup` flag does.
The trade is worth stating plainly: a deployed build with `CONTENT_PREVIEW` on
shows visitors a plausible programme, with plausible speaker names, that
nobody has confirmed. Three things keep that in check - the flag, the warning
`lib/api/sessionize-preview.ts` logs on every boot, and the fact that the
fixture only appears while the live view is empty. `CONTENT_PREVIEW=0`
restores the empty state.

The sponsor logos they point at live in `public/logos/demo-*.svg` and are
placeholder marks, not real brand assets.
