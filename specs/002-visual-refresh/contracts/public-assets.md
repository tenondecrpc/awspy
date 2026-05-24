# Contract: public/assets layout and placeholder behavior

This document binds the visual refresh to a stable convention for static assets under `public/`. The convention lets organizers swap real images in by uploading a file (no code change) and lets the site render coherent placeholders when files are missing.

## Directory layout

```text
public/assets/
├── README.md                              # Documents the layout and placeholder behavior
├── hero/
│   └── pattern.svg                        # Optional custom hero pattern; falls back to AWS arch icons
├── team/
│   └── <organizer-slug>.jpg               # Per-organizer photo (1:1, 400x400 recommended)
├── venue/
│   └── cover.jpg                          # Venue cover image (16:9)
├── sponsors/
│   └── <sponsor-id>.<ext>                 # Optional self-hosted logo (default source: Sponsor.logo.light)
├── gallery/
│   └── <edition-year>/<filename>          # Optional past-edition gallery (no UI in v1 of refresh)
└── icons/
    └── aws-architecture/
        ├── README.md                      # Source URL, version date, attribution
        └── *.svg                          # Curated subset of AWS Architecture Icons (12-20 files)
```

## Path conventions

- Files are referenced by relative path from `public/`. Example: `/assets/team/jane-doe.jpg`.
- Slugs MUST match the slug field already present in the relevant content schema (`Organizer.slug`, `Sponsor.id`, edition year, etc.).
- File extensions: `.jpg` or `.png` for photos, `.svg` for vector assets.

## Aspect ratios

| Category   | Ratio  | Recommended size | Used by                    |
|------------|--------|------------------|----------------------------|
| `team`     | 1:1    | 400x400          | `OrganizerCard` avatar     |
| `sponsors` | 4:1    | 320x80           | `SponsorCard` logo slot    |
| `venue`    | 16:9   | 1280x720         | `VenueCard` cover          |
| `hero`     | n/a    | n/a              | `DecorativePattern` (SVG)  |
| `gallery`  | 3:2    | 1200x800         | Future gallery component   |

The `Placeholder` atom uses these ratios to reserve space.

## Placeholder behavior

- When a file at the expected path is missing, the consuming molecule renders a `Placeholder` atom with the same aspect ratio and a token-themed background. No 404 image flash, no layout shift.
- The placeholder MAY include a label (e.g. organizer initials, sponsor name) to keep the block informative.
- When the file is later added, the next render uses `next/image` (or an `<img>` for SVG patterns) and occupies the same reserved space without layout shift.

## Speaker headshots

- Speaker headshots are NOT part of `public/assets/`. They continue to come from the Sessionize public API via `Speaker.profilePicture`.
- The existing `SpeakerCard` initials fallback covers the case where Sessionize does not provide a picture. This contract does not change that.

## Hero pattern

- If `public/assets/hero/pattern.svg` exists, the hero uses it directly as a CSS background.
- If absent, `DecorativePattern` renders a low-opacity grid of AWS Architecture Icons drawn from `public/assets/icons/aws-architecture/`.
- In both cases the pattern is `aria-hidden="true"` and never carries information.

## AWS Architecture Icons drop

- Source: AWS Architecture Icons, distributed officially by AWS for community use.
- Files committed: a curated subset of 12 to 20 SVG icons that read well at small sizes (storage, compute, networking, database, AI/ML, security).
- Each file MUST be the unedited official SVG. If a tint is needed, the consuming component overrides it via CSS `currentColor`.
- The `README.md` next to the SVG drop records: source URL, version date, license note ("AWS Architecture Icons - free for community use, official AWS distribution").

## No-scraping policy

- No SVG, PNG, WEBP, or JPG taken from `https://day.awscommunity.mx/`, `https://awscommunitydaycolombia.com/`, or any other community-day site MAY be added under `public/assets/`. Those sites are referenced only as visual inspiration.
- Anything that looks like it was taken verbatim from those sites MUST be removed and replaced with either an AWS Architecture Icon, a token-only SVG drawn for this repo, or an asset uploaded by the organizers themselves.

## Verification

- The site renders without error when `public/assets/` contains only `README.md` (no images at all).
- Adding a file at `public/assets/team/jane-doe.jpg` makes `OrganizerCard` for `jane-doe` use the real photo on the next render, without code changes.
- Removing a previously present file falls back to the placeholder cleanly.
