# Phase 1 Data Model: Visual refresh token map

This feature does not introduce backend or content entities. The "data model" here is the **token map**: the semantic palette tokens that every page consumes, their values per mode, and the AA-verified contrast pairs.

## Semantic tokens

The following table lists every token introduced or refreshed by this feature. Light values resolve under the default scheme; dark values resolve under `@media (prefers-color-scheme: dark)`.

### Brand and action

| Token                       | Light value | Dark value  | Intended usage                                            |
|-----------------------------|-------------|-------------|-----------------------------------------------------------|
| `--color-brand-primary`     | `#232F3E`   | `#161E2D`   | Primary brand surface (hero, footer band, dark callouts). |
| `--color-action`            | `#FF9900`   | `#FF9900`   | Primary CTA background (Smile Orange).                    |
| `--color-action-strong`     | `#EC7211`   | `#EC7211`   | Primary CTA hover/active.                                 |
| `--color-accent`            | `#0073BB`   | `#3FA0E0`   | Links and accent fills (Hyperlink Blue).                  |
| `--color-accent-strong`     | `#005A91`   | `#0073BB`   | Accent hover/active.                                      |
| `--color-accent-soft`       | `#E6F0F7`   | `#1A2D52`   | Soft accent backgrounds (badges, avatar fallbacks).       |

### Surfaces

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-surface`           | `#FFFFFF`   | `#0B1626`   | Page surface (default `Section tone="default"`).     |
| `--color-surface-muted`     | `#F4F6FA`   | `#131F33`   | Alternating section surface.                         |
| `--color-surface-elevated`  | `#FFFFFF`   | `#1A2638`   | Elevated card surface.                               |
| `--color-surface-inverse`   | `#0B1626`   | `#FFFFFF`   | Inverted surface (legacy v1 alias, kept).            |
| `--color-surface-hero`      | `#232F3E`   | `#161E2D`   | Hero section surface (Squid Ink / Anchor).           |

### Text

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-text-primary`      | `#0B1626`   | `#F5F7FA`   | Body and headings on default surface.                |
| `--color-text-secondary`    | `#364152`   | `#C5CCD6`   | Secondary copy on default surface.                   |
| `--color-text-muted`        | `#5C6573`   | `#97A0AE`   | Muted copy (captions, footnotes).                    |
| `--color-text-on-action`    | `#001022`   | `#001022`   | Text on `--color-action`.                            |
| `--color-text-on-accent`    | `#FFFFFF`   | `#0B1626`   | Text on `--color-accent`.                            |
| `--color-text-on-inverse`   | `#FFFFFF`   | `#0B1626`   | Text on `--color-surface-inverse` (legacy alias).    |
| `--color-text-on-hero`      | `#FFFFFF`   | `#F5F7FA`   | Text on `--color-surface-hero`.                      |

### Borders

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-border-subtle`     | `#E5E9F0`   | `#1A2638`   | Hairline dividers inside cards/sections.             |
| `--color-border-strong`     | `#5C6573`   | `#97A0AE`   | Outline buttons, focus areas needing high contrast.  |

### State

| Token                | Light value | Dark value  | Intended usage                            |
|----------------------|-------------|-------------|-------------------------------------------|
| `--color-focus`      | `#0073BB`   | `#3FA0E0`   | Visible focus ring (matches accent).      |
| `--color-success`    | `#1F7A3A`   | `#52C97A`   | Success badges/inline messages.           |
| `--color-warning`    | `#B26200`   | `#FFB85C`   | Warning badges/inline messages.           |
| `--color-danger`     | `#B3261E`   | `#FF7A6E`   | Error badges/inline messages.             |

### Sponsor tier (preserved from v1, recolored to match palette)

| Token                       | Light value | Dark value  | Notes                                       |
|-----------------------------|-------------|-------------|---------------------------------------------|
| `--color-tier-platinum`     | `#2A2E36`   | `#C5CCD6`   | Always paired with text label.              |
| `--color-tier-gold`         | `#B07F00`   | `#FFB85C`   | Always paired with text label.              |
| `--color-tier-silver`       | `#6B7280`   | `#A1A8B6`   | Always paired with text label.              |
| `--color-tier-bronze`       | `#8A4B1A`   | `#D69262`   | Always paired with text label.              |
| `--color-tier-community`    | `#1F7A3A`   | `#52C97A`   | Always paired with text label.              |

## Contrast verification

Each foreground/background pair below MUST meet WCAG AA (>=4.5:1 for normal text, >=3:1 for large text). The matrix below records the required pair, the computed contrast in light mode, and the computed contrast in dark mode. Concrete values are validated by the implementation task that introduces the tokens.

| Foreground             | Background              | Light  | Dark   | AA bar |
|------------------------|-------------------------|--------|--------|--------|
| `text-primary`         | `surface`               | >=12:1 | >=12:1 | 4.5:1  |
| `text-secondary`       | `surface`               | >=8:1  | >=7:1  | 4.5:1  |
| `text-muted`           | `surface`               | >=5:1  | >=4.5:1| 4.5:1  |
| `text-primary`         | `surface-muted`         | >=11:1 | >=11:1 | 4.5:1  |
| `text-on-hero`         | `surface-hero`          | >=12:1 | >=14:1 | 4.5:1  |
| `text-on-action`       | `action`                | >=11:1 | >=11:1 | 4.5:1  |
| `text-on-accent`       | `accent`                | >=4.6:1| >=5:1  | 4.5:1  |
| `accent` (link inline) | `surface`               | >=4.6:1| >=4.6:1| 4.5:1  |

## Aliases preserved from v1

To avoid touching v1 component code, the following names continue to resolve. Their values are refreshed (per the table above) but the names are not changed.

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

These primitives have no runtime state, no fetching, and no validation. They are pure render functions of their props.
