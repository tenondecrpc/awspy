# Phase 1 Data Model: Visual refresh token map

This feature does not introduce backend or content entities. The "data model" here is the **token map**: the semantic palette tokens that every page consumes, their values per mode, and the AA-verified contrast pairs.

## Semantic tokens

The following table lists every token introduced or refreshed by this feature. Light values resolve by default; dark values resolve under the OS preference or an explicit `data-theme="dark"` override.

### Brand and action

| Token                       | Light value | Dark value  | Intended usage                                            |
|-----------------------------|-------------|-------------|-----------------------------------------------------------|
| `--color-brand-primary`     | `#232F3E`   | `#161E2D`   | Primary brand surface (hero, footer band, dark callouts). |
| `--color-action`            | `#FF9900`   | `#FF9900`   | Primary CTA background (Smile Orange).                    |
| `--color-action-strong`     | `#EC7211`   | `#EC7211`   | Primary CTA hover/active.                                 |
| `--color-action-label`      | `#8A4B00`   | `#FFB85C`   | Accessible orange-like text on normal surfaces.           |
| `--color-accent`            | `#0073BB`   | `#3FA0E0`   | Links and accent fills (Hyperlink Blue).                  |
| `--color-accent-strong`     | `#005A91`   | `#74C1EF`   | Accent hover/active and text on accent-soft.               |
| `--color-accent-soft`       | `#E6F0F7`   | `#1A2D52`   | Soft accent backgrounds (badges, avatar fallbacks).       |

### Surfaces

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-surface`           | `#FFFFFF`   | `#0B1626`   | Page surface (default `Section tone="default"`).     |
| `--color-surface-muted`     | `#F4F6FA`   | `#131F33`   | Alternating section surface.                         |
| `--color-surface-elevated`  | `#FFFFFF`   | `#1A2638`   | Elevated card surface.                               |
| `--color-surface-inverse`   | `#0B1626`   | `#161E2D`   | Consistently dark inverse/callout surface.           |
| `--color-surface-hero`      | `#232F3E`   | `#161E2D`   | Hero section surface (Squid Ink / Anchor).           |
| `--color-overlay`           | `#0B1626B3` | `#000000B3` | Modal/drawer backdrop; not used for text contrast.   |

### Text

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-text-primary`      | `#0B1626`   | `#F5F7FA`   | Body and headings on default surface.                |
| `--color-text-secondary`    | `#364152`   | `#C5CCD6`   | Secondary copy on default surface.                   |
| `--color-text-muted`        | `#5C6573`   | `#97A0AE`   | Muted copy (captions, footnotes).                    |
| `--color-text-on-action`    | `#001022`   | `#001022`   | Text on `--color-action`.                            |
| `--color-text-on-accent`    | `#FFFFFF`   | `#0B1626`   | Text on `--color-accent`.                            |
| `--color-text-on-inverse`   | `#FFFFFF`   | `#F5F7FA`   | Text on `--color-surface-inverse` (legacy alias).    |
| `--color-text-on-hero`      | `#FFFFFF`   | `#F5F7FA`   | Text on `--color-surface-hero`.                      |
| `--color-text-on-tier`      | `#FFFFFF`   | `#0B1626`   | Text on sponsor-tier badges.                         |

### Borders

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-border-subtle`     | `#E5E9F0`   | `#1A2638`   | Hairline dividers inside cards/sections.             |
| `--color-border-strong`     | `#5C6573`   | `#97A0AE`   | Outline buttons, focus areas needing high contrast.  |

### State

| Token                | Light value | Dark value  | Intended usage                            |
|----------------------|-------------|-------------|-------------------------------------------|
| `--color-focus`      | `#0073BB`   | `#3FA0E0`   | Visible focus ring on normal surfaces.    |
| `--color-focus-on-hero` | `#FFB85C` | `#FFB85C` | Visible focus ring on dark callouts.      |
| `--color-success`    | `#1F7A3A`   | `#52C97A`   | Success badges/inline messages.           |
| `--color-success-soft` | `#E5F5EA` | `#14361F`   | Success badge background.                 |
| `--color-warning`    | `#965000`   | `#FFB85C`   | Warning badges/inline messages.           |
| `--color-warning-soft` | `#FFF1DD` | `#3A2A12`   | Warning badge background.                 |
| `--color-danger`     | `#B3261E`   | `#FF7A6E`   | Error badges/inline messages.             |
| `--color-danger-soft` | `#FCE4E2`  | `#3A1B17`   | Error badge background.                   |

### Sponsor tier (preserved from v1, recolored to match palette)

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
| `text-primary`         | `surface`               | 18.15:1 | 16.91:1 | 4.5:1 |
| `text-secondary`       | `surface`               | 10.32:1 | 11.22:1 | 4.5:1 |
| `text-muted`           | `surface`               | 5.89:1  | 6.88:1  | 4.5:1 |
| `text-primary`         | `surface-muted`         | 16.78:1 | 15.39:1 | 4.5:1 |
| `text-on-action`       | `action`                | 8.94:1  | 8.94:1  | 4.5:1 |
| `text-on-action`       | `action-strong`         | 6.36:1  | 6.36:1  | 4.5:1 |
| `action-label`         | `surface`               | 6.80:1  | 10.60:1 | 4.5:1 |
| `action-label`         | `surface-muted`         | 6.29:1  | 9.64:1  | 4.5:1 |
| `text-on-accent`       | `accent`                | 5.04:1  | 6.32:1  | 4.5:1 |
| `text-on-accent`       | `accent-strong`         | 7.31:1  | 9.18:1  | 4.5:1 |
| `accent-strong`        | `accent-soft`           | 6.33:1  | 6.89:1  | 4.5:1 |
| `text-on-inverse`      | `surface-inverse`       | 18.15:1 | 15.56:1 | 4.5:1 |
| `text-on-hero`         | `surface-hero`          | 13.57:1 | 15.56:1 | 4.5:1 |
| `success`              | `success-soft`          | 4.76:1  | 6.34:1  | 4.5:1 |
| `warning`              | `warning-soft`          | 5.48:1  | 8.07:1  | 4.5:1 |
| `danger`               | `danger-soft`           | 5.40:1  | 6.12:1  | 4.5:1 |
| `text-on-tier`         | `tier-platinum`         | 13.61:1 | 11.22:1 | 4.5:1 |
| `text-on-tier`         | `tier-gold`             | 5.43:1  | 10.60:1 | 4.5:1 |
| `text-on-tier`         | `tier-silver`           | 4.83:1  | 7.60:1  | 4.5:1 |
| `text-on-tier`         | `tier-bronze`           | 6.77:1  | 7.04:1  | 4.5:1 |
| `text-on-tier`         | `tier-community`        | 5.38:1  | 8.64:1  | 4.5:1 |
| `focus`                | `surface`               | 5.04:1  | 6.32:1  | 3:1   |
| `focus-on-hero`        | `surface-hero`          | 7.92:1  | 9.75:1  | 3:1   |
| `border-strong`        | `surface`               | 5.89:1  | 6.88:1  | 3:1   |

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
