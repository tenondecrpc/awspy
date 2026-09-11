# Phase 1 Data Model: Visual refresh token map

This feature does not introduce backend or content entities. The "data model" here is the **token map**: the semantic palette tokens that every page consumes, their values per mode, and the AA-verified contrast pairs.

## Semantic tokens

The following table lists every token introduced or refreshed by this feature. Light values resolve by default; dark values resolve under the OS preference or an explicit `data-theme="dark"` override.

### Brand, action, and national identity

The palette is AWS-forward: **Amazon Orange** (`#FF9900`) is the accent/action,
**Squid Ink** (`#232F3E`) is the structural dark, and **white** is the light
surface. Paraguay red is retained as the secondary national-identity accent.

Because bright Amazon Orange cannot carry legible text on white (2.1:1) nor
read as text on white, the light mode uses two orange families: `action` is the
loud CTA fill (bright `#FF9900` with Squid-Ink text), while `accent` is a deep
burnt orange for links/accent text that must be legible on white (with white
`text-on-accent`). In dark mode both collapse to bright `#FF9900`, which passes
on Squid-Ink surfaces.

| Token                       | Light value | Dark value  | Intended usage                                            |
|-----------------------------|-------------|-------------|-----------------------------------------------------------|
| `--color-brand-primary`     | `#232F3E`   | `#FF9900`   | Squid-Ink brand surface (light); Amazon-Orange brand (dark). |
| `--color-action`            | `#FF9900`   | `#FF9900`   | Primary CTA background; Amazon Orange.                    |
| `--color-action-strong`     | `#E88C00`   | `#FFAC33`   | Primary CTA hover/active (dark text stays AA).            |
| `--color-action-label`      | `#9A5200`   | `#FF9900`   | Accessible orange text on normal/muted surfaces.          |
| `--color-accent`            | `#9A5200`   | `#FF9900`   | Links and accent fills legible as text on the surface.    |
| `--color-accent-strong`     | `#7A4200`   | `#FFAC33`   | Accent hover/active and text on accent-soft.               |
| `--color-accent-soft`       | `#FFF3E0`   | `#3D2E12`   | Soft orange backgrounds (badges, avatar fallbacks).       |
| `--color-national-red`      | `#F02F3B`   | `#FF4B5B`   | Decorative Paraguay-red fills; never body text.           |
| `--color-national-red-label` | `#C4152F`  | `#FF6D75`   | Paraguay-red text on normal and muted surfaces.           |
| `--color-national-red-on-dark` | `#FF5566` | `#FF5566` | Paraguay-red text on inverse and hero surfaces.           |

### Surfaces

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-surface`           | `#FFFFFF`   | `#232F3E`   | Page surface (default `Section tone="default"`).     |
| `--color-surface-muted`     | `#F2F3F3`   | `#1B2530`   | Alternating tinted section surface.                  |
| `--color-surface-elevated`  | `#FFFFFF`   | `#2E3B4E`   | Elevated card surface.                               |
| `--color-surface-inverse`   | `#161E2D`   | `#161E2D`   | Consistently dark inverse/callout surface.           |
| `--color-surface-hero`      | `#161E2D`   | `#161E2D`   | Squid-Ink anchor hero surface.                       |
| `--color-overlay`           | `#161E2DB3` | `#0F151CB3` | Modal/drawer backdrop; not used for text contrast.   |
| `--color-scrim-strong`      | `#161E2DEB` | `#0F151CEB` | Base of the photo scrim that reveals a talk title.   |
| `--color-glass`             | `#FFFFFF14` | `#FFFFFF14` | Frosted panel fill over dark surfaces.               |
| `--color-glass-border`      | `#FFFFFF3D` | `#FFFFFF33` | Frosted panel hairline over dark surfaces.           |

### Decorative glow

Used only as the outer color stop of a card `box-shadow` on hover or focus. Never behind text, so no contrast pair applies.

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-glow-action`       | `#FF990052` | `#FF99003D` | Glow paired with `--color-action` borders.           |
| `--color-glow-accent`       | `#FF990052` | `#FF99003D` | Glow paired with `--color-accent` borders.           |
| `--color-glow-red`          | `#F02F3B52` | `#FF4B5B3D` | Glow paired with `--color-national-red` borders.     |

### Text

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-text-primary`      | `#161E2D`   | `#FFFFFF`   | Body and headings on default surface.                |
| `--color-text-secondary`    | `#414D5C`   | `#D5DBDB`   | Secondary copy on default surface.                   |
| `--color-text-muted`        | `#5F6B7A`   | `#A9B4C0`   | Muted copy (captions, footnotes).                    |
| `--color-text-on-action`    | `#232F3E`   | `#232F3E`   | Text on `--color-action` (Squid Ink on orange).      |
| `--color-text-on-accent`    | `#FFFFFF`   | `#232F3E`   | Text on `--color-accent`.                            |
| `--color-text-on-inverse`   | `#FFFFFF`   | `#FFFFFF`   | Text on `--color-surface-inverse`.                   |
| `--color-text-on-hero`      | `#FFFFFF`   | `#FFFFFF`   | Text on `--color-surface-hero`.                      |
| `--color-text-on-tier`      | `#FFFFFF`   | `#0B1626`   | Text on sponsor-tier badges.                         |

### Borders

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-border-subtle`     | `#E9EBED`   | `#3A4553`   | Hairline dividers inside cards/sections.             |
| `--color-border-strong`     | `#5F6B7A`   | `#8D99A8`   | Outline buttons, focus areas needing high contrast.  |

### State

| Token                | Light value | Dark value  | Intended usage                            |
|----------------------|-------------|-------------|-------------------------------------------|
| `--color-focus`      | `#0972D3`   | `#FF9900`   | Visible focus ring on normal surfaces.    |
| `--color-focus-on-hero` | `#FF9900` | `#FF9900` | Visible focus ring on dark callouts.      |
| `--color-success`    | `#1F7A3A`   | `#52C97A`   | Success badges/inline messages.           |
| `--color-success-soft` | `#E5F5EA` | `#14361F`   | Success badge background.                 |
| `--color-warning`    | `#965000`   | `#FFB85C`   | Warning badges/inline messages.           |
| `--color-warning-soft` | `#FFF1DD` | `#3A2A12`   | Warning badge background.                 |
| `--color-danger`     | `#B3261E`   | `#FF7A6E`   | Error badges/inline messages.             |
| `--color-danger-soft` | `#FCE4E2`  | `#3A1B17`   | Error badge background.                   |

### Sponsor tier (preserved from v1)

| Token                       | Light value | Dark value  | Notes                                       |
|-----------------------------|-------------|-------------|---------------------------------------------|
| `--color-tier-platinum`     | `#2A2E36`   | `#C5CCD6`   | Always paired with text label.              |
| `--color-tier-gold`         | `#8A6300`   | `#FFB85C`   | Always paired with text label.              |
| `--color-tier-silver`       | `#6B7280`   | `#A1A8B6`   | Always paired with text label.              |
| `--color-tier-bronze`       | `#8A4B1A`   | `#D69262`   | Always paired with text label.              |
| `--color-tier-community`    | `#1F7A3A`   | `#52C97A`   | Always paired with text label.              |

## Contrast verification

Each foreground/background pair below MUST meet WCAG AA (>=4.5:1 for normal text and >=3:1 for component boundaries). The matrix records ratios calculated by `tests/unit/lib-utils-tokens.test.ts` from the actual CSS values.

| Foreground             | Background              | Light  | Dark   | AA bar |
|------------------------|-------------------------|--------|--------|--------|
| `text-primary`         | `surface`               | 16.70:1 | 13.57:1 | 4.5:1 |
| `text-secondary`       | `surface`               | 8.60:1  | 9.68:1  | 4.5:1 |
| `text-muted`           | `surface`               | 5.43:1  | 6.45:1  | 4.5:1 |
| `text-primary`         | `surface-muted`         | 15.02:1 | 15.51:1 | 4.5:1 |
| `text-on-action`       | `action`                | 6.34:1  | 6.34:1  | 4.5:1 |
| `text-on-action`       | `action-strong`         | 5.29:1  | 7.24:1  | 4.5:1 |
| `action-label`         | `surface`               | 5.86:1  | 6.34:1  | 4.5:1 |
| `action-label`         | `surface-muted`         | 5.28:1  | 7.24:1  | 4.5:1 |
| `text-on-accent`       | `accent`                | 5.86:1  | 6.34:1  | 4.5:1 |
| `text-on-accent`       | `accent-strong`         | 8.06:1  | 7.24:1  | 4.5:1 |
| `accent-strong`        | `accent-soft`           | 7.35:1  | 7.01:1  | 4.5:1 |
| `accent`               | `surface`               | 5.86:1  | 6.34:1  | 4.5:1 |
| `accent`               | `surface-muted`         | 5.28:1  | 7.24:1  | 4.5:1 |
| `national-red-label`   | `surface`               | 6.01:1  | 4.97:1  | 4.5:1 |
| `national-red-label`   | `surface-muted`         | 5.40:1  | 5.68:1  | 4.5:1 |
| `national-red-on-dark` | `surface-inverse`       | 5.36:1  | 5.36:1  | 4.5:1 |
| `national-red-on-dark` | `surface-hero`          | 5.36:1  | 5.36:1  | 4.5:1 |
| `text-on-inverse`      | `surface-inverse`       | 16.70:1 | 16.70:1 | 4.5:1 |
| `text-on-hero`         | `surface-hero`          | 16.70:1 | 16.70:1 | 4.5:1 |
| `success`              | `success-soft`          | 4.76:1  | 6.34:1  | 4.5:1 |
| `warning`              | `warning-soft`          | 5.48:1  | 8.07:1  | 4.5:1 |
| `danger`               | `danger-soft`           | 5.40:1  | 6.12:1  | 4.5:1 |
| `text-on-tier`         | `tier-platinum`         | 13.61:1 | 11.22:1 | 4.5:1 |
| `text-on-tier`         | `tier-gold`             | 5.43:1  | 10.60:1 | 4.5:1 |
| `text-on-tier`         | `tier-silver`           | 4.83:1  | 7.60:1  | 4.5:1 |
| `text-on-tier`         | `tier-bronze`           | 6.77:1  | 7.04:1  | 4.5:1 |
| `text-on-tier`         | `tier-community`        | 5.38:1  | 8.64:1  | 4.5:1 |
| `focus`                | `surface`               | 4.82:1  | 6.34:1  | 3:1   |
| `focus-on-hero`        | `surface-hero`          | 7.80:1  | 7.80:1  | 3:1   |
| `border-strong`        | `surface`               | 5.43:1  | 4.69:1  | 3:1   |

## Aliases preserved from v1

To avoid unnecessary churn in v1 component code, the following names continue to resolve. Their values are refreshed (per the table above) but the names are not changed. The three `national-red` roles are additive and are consumed only where local identity is intentional.

`--color-accent`, `--color-accent-strong`, `--color-accent-soft`, `--color-action`, `--color-action-strong`, `--color-surface`, `--color-surface-muted`, `--color-surface-elevated`, `--color-surface-inverse`, `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`, `--color-text-on-accent`, `--color-text-on-action`, `--color-text-on-inverse`, `--color-focus`, `--color-success`, `--color-warning`, `--color-danger`, `--color-tier-*`.

## Layout and radius tokens (carried over from v1)

`--container-max`, `--container-padding`, `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-pill` remain unchanged.

## Conceptual atoms used by the refresh

These are not data entities, but they are the "shape" of the new visual primitives:

- **Token semantico**: a logical name (`--color-action`) bound to two values (light, dark). Defined exclusively in `app/globals.css`.
- **Placeholder**: a div with a fixed `aspect-ratio` and a token-themed background, used to reserve space for an upcoming image.
- **DecorativePattern**: a grid of `aria-hidden` SVG icons rendered at low opacity over a brand surface. Density and opacity are props.
- **EmptyStateIllustration**: a token-only inline SVG with no embedded text, decorative.
- **LoadingGrid**: a skeleton with the same column count, gap, and item template as the populated grid. Exposes `aria-busy` and a Spanish loading label.
- **SectionHeading**: eyebrow pill, large title with an optional accent-tinted trailing phrase, and a lead paragraph. The single source of the section rhythm shared by the home page and every inner page.
- **EyebrowPill**: the uppercase, letter-spaced label above a section title. Typographic only; `Badge` remains the component for state (registration, sponsor tier).
- **GlyphIcon**: inline `aria-hidden` concept glyphs (date, place, time, community) that inherit `currentColor`. Always adjacent to a visible text label.
- **`.glass-panel` / `.media-card` / `.media-card__scrim`**: composite helpers declared in `app/globals.css` because they combine several color stops. Consumers set `--card-accent` and `--card-glow` from palette tokens; the accent is decorative and every card also carries its information as text.

These primitives have no runtime state, no fetching, and no validation. They are pure render functions of their props.
