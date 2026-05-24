# public/assets

Static assets consumed by the AWS Community Day Paraguay site after the visual
refresh. Files in this tree are referenced by relative path from `public/`
(e.g. `/assets/team/jane-doe.jpg`). The full contract lives in
`specs/002-visual-refresh/contracts/public-assets.md`.

## Layout

```
public/assets/
  hero/
    pattern.svg                         # Optional custom hero pattern
  team/
    <organizer-slug>.jpg                # Per-organizer photo (1:1, 400x400)
  venue/
    cover.jpg                           # Venue cover image (16:9, 1280x720)
  sponsors/
    <sponsor-id>.<ext>                  # Optional self-hosted sponsor logo
  gallery/
    <edition-year>/<filename>           # Past-edition gallery (no UI in v1)
  icons/
    aws-architecture/
      README.md                         # Source URL, version date, attribution
      *.svg                             # Curated AWS Architecture Icons
```

## Filename conventions

- Slugs match the corresponding content slug (`Organizer.slug`, `Sponsor.id`,
  edition year). The file basename is the slug, the extension is the format.
- Photos are `.jpg` or `.png`. Vector assets are `.svg`.

## Aspect ratios

| Category   | Ratio | Recommended size | Used by                  |
|------------|-------|------------------|--------------------------|
| `team`     | 1:1   | 400x400          | `OrganizerCard` avatar   |
| `sponsors` | 4:1   | 320x80           | `SponsorCard` logo slot  |
| `venue`    | 16:9  | 1280x720         | `VenueCard` cover        |
| `hero`     | n/a   | n/a              | `DecorativePattern`      |
| `gallery`  | 3:2   | 1200x800         | Future gallery component |

## Placeholder behavior

When a file is missing, the consuming molecule renders the `Placeholder` atom
with the same aspect ratio and a token-themed background. Once the file is
added (or replaced), the next render uses `next/image` and occupies the same
reserved space without layout shift.

## Speaker headshots

Speaker headshots are NOT in `public/assets/`. They come from the Sessionize
public API via `Speaker.profilePicture`.

## No-scraping policy

Do not commit any SVG, PNG, WEBP, or JPG taken verbatim from the AWS Community
Day Mexico, Colombia, or any other community-day site. Those sites are
inspiration only. Use the AWS Architecture Icons drop, token-only SVG drawn
for this repo, or assets uploaded by organizers.
