# Preview data

Placeholder data used to look at sections that have no real content yet. **No
application code reads anything in this directory**, and none of it ships to
the deployed site.

## Sessionize views (`sessionize/`)

`/schedule`, and the "Sus charlas" block on a speaker page, come from the
public Sessionize API. The real 2026 event has not published its grid yet, so
those sections render their empty state. To work on them with content:

```bash
# terminal 1
npm run preview:data

# terminal 2
NEXT_PUBLIC_SESSIONIZE_BASE_URL=http://127.0.0.1:8799 npm run dev
```

`scripts/preview-sessionize.mjs` answers the same URL shape as Sessionize
(`/{eventId}/view/{View}`) from `sessionize/*.json`. The override env var is
the one already documented in `.env.example`.

The fixture day is the real event date (2026-10-17) across four rooms, so the
per-room accents, the plenary badge and the time chips all have something to
render.

## Edition content (`../editions/2026/*.example.json`)

Sponsors, the organizing team and the venue are version-controlled JSON. The
live files are intentionally empty or minimal, which is why those pages show
their empty state. Each one has an `*.example.json` sibling with placeholder
data:

| Live file          | Placeholder file           |
|--------------------|----------------------------|
| `sponsors.json`    | `sponsors.example.json`    |
| `organizers.json`  | `organizers.example.json`  |
| `venue.json`       | `venue.example.json`       |

To preview one, copy it over the live file and revert when you are done:

```bash
cp content/editions/2026/sponsors.example.json content/editions/2026/sponsors.json
# ... look at /sponsors ...
git checkout content/editions/2026/sponsors.json
```

Every name in the placeholder data is obviously fake ("Demo Cloud",
"Ana Demo") on purpose: the site is public, and a real-looking sponsor wall or
team list would mislead attendees if it ever reached production. Replace the
placeholders with real records rather than editing the fake ones.

The sponsor logos those files point at live in `public/logos/demo-*.svg` and
are placeholder marks, not real brand assets.
