# Phase 1 Data Model: Visual refresh token map

This feature does not introduce backend or content entities. The "data model" here is the **token map**: the semantic palette tokens that every page consumes, their values per mode, and the AA-verified contrast pairs.

## Semantic tokens

The following table lists every token introduced or refreshed by this feature. Light values resolve by default; dark values resolve under the OS preference or an explicit `data-theme="dark"` override.

### Brand, action, and national identity

| Token                       | Light value | Dark value  | Intended usage                                            |
|-----------------------------|-------------|-------------|-----------------------------------------------------------|
| `--color-brand-primary`     | `#041A53`   | `#041A53`   | Deep-blue brand surface sampled from the event artwork.   |
| `--color-action`            | `#0038A8`   | `#6EA1FF`   | Primary CTA background; Paraguay flag blue.               |
| `--color-action-strong`     | `#002B7A`   | `#91B8FF`   | Primary CTA hover/active.                                 |
| `--color-action-label`      | `#0038A8`   | `#8BB4FF`   | Accessible action-blue text on normal surfaces.           |
| `--color-accent`            | `#0A4DB8`   | `#74A8FF`   | Links and electric-blue accent fills.                     |
| `--color-accent-strong`     | `#00368F`   | `#9BBFFF`   | Accent hover/active and text on accent-soft.               |
| `--color-accent-soft`       | `#E8EFFF`   | `#11285C`   | Soft blue backgrounds (badges, avatar fallbacks).         |
| `--color-national-red`      | `#F02F3B`   | `#FF4B5B`   | Decorative Paraguay-red fills; never body text.           |
| `--color-national-red-label` | `#A91431`  | `#FF7A86`   | Paraguay-red text on normal and muted surfaces.           |
| `--color-national-red-on-dark` | `#FF6673` | `#FF6673` | Paraguay-red text on inverse and hero surfaces.           |

### Surfaces

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-surface`           | `#FFFFFF`   | `#010928`   | Page surface (default `Section tone="default"`).     |
| `--color-surface-muted`     | `#F4F6FC`   | `#071438`   | Alternating blue-tinted section surface.             |
| `--color-surface-elevated`  | `#FFFFFF`   | `#0D1B46`   | Elevated card surface.                               |
| `--color-surface-inverse`   | `#041A53`   | `#000C2F`   | Consistently dark inverse/callout surface.           |
| `--color-surface-hero`      | `#000C2F`   | `#01051D`   | Night-sky hero surface inspired by the artwork.      |
| `--color-overlay`           | `#000C2FB3` | `#000C2FB3` | Modal/drawer backdrop; not used for text contrast.   |

### Text

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-text-primary`      | `#08152F`   | `#F7F8FF`   | Body and headings on default surface.                |
| `--color-text-secondary`    | `#34415F`   | `#C5CCEA`   | Secondary copy on default surface.                   |
| `--color-text-muted`        | `#5B647A`   | `#9AA5CA`   | Muted copy (captions, footnotes).                    |
| `--color-text-on-action`    | `#FFFFFF`   | `#000C2F`   | Text on `--color-action`.                            |
| `--color-text-on-accent`    | `#FFFFFF`   | `#000C2F`   | Text on `--color-accent`.                            |
| `--color-text-on-inverse`   | `#FFFFFF`   | `#F7F8FF`   | Text on `--color-surface-inverse` (legacy alias).    |
| `--color-text-on-hero`      | `#F7F8FF`   | `#F7F8FF`   | Text on `--color-surface-hero`.                      |
| `--color-text-on-tier`      | `#FFFFFF`   | `#0B1626`   | Text on sponsor-tier badges.                         |

### Borders

| Token                       | Light value | Dark value  | Intended usage                                       |
|-----------------------------|-------------|-------------|------------------------------------------------------|
| `--color-border-subtle`     | `#DFE4F2`   | `#1B2D5B`   | Hairline dividers inside cards/sections.             |
| `--color-border-strong`     | `#5B647A`   | `#9AA5CA`   | Outline buttons, focus areas needing high contrast.  |

### State

| Token                | Light value | Dark value  | Intended usage                            |
|----------------------|-------------|-------------|-------------------------------------------|
| `--color-focus`      | `#0A4DB8`   | `#74A8FF`   | Visible focus ring on normal surfaces.    |
| `--color-focus-on-hero` | `#FF6673` | `#FF6673` | Visible focus ring on dark callouts.      |
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
| `text-primary`         | `surface`               | 18.12:1 | 18.51:1 | 4.5:1 |
| `text-secondary`       | `surface`               | 10.16:1 | 12.32:1 | 4.5:1 |
| `text-muted`           | `surface`               | 5.92:1  | 8.04:1  | 4.5:1 |
| `text-primary`         | `surface-muted`         | 16.77:1 | 17.00:1 | 4.5:1 |
| `text-on-action`       | `action`                | 9.85:1  | 7.50:1  | 4.5:1 |
| `text-on-action`       | `action-strong`         | 12.91:1 | 9.60:1  | 4.5:1 |
| `action-label`         | `surface`               | 9.85:1  | 9.40:1  | 4.5:1 |
| `action-label`         | `surface-muted`         | 9.12:1  | 8.64:1  | 4.5:1 |
| `text-on-accent`       | `accent`                | 7.59:1  | 8.04:1  | 4.5:1 |
| `text-on-accent`       | `accent-strong`         | 10.91:1 | 10.32:1 | 4.5:1 |
| `accent-strong`        | `accent-soft`           | 9.47:1  | 7.62:1  | 4.5:1 |
| `accent`               | `surface`               | 7.59:1  | 8.21:1  | 4.5:1 |
| `accent`               | `surface-muted`         | 7.02:1  | 7.54:1  | 4.5:1 |
| `national-red-label`   | `surface`               | 7.42:1  | 7.82:1  | 4.5:1 |
| `national-red-label`   | `surface-muted`         | 6.86:1  | 7.19:1  | 4.5:1 |
| `national-red-on-dark` | `surface-inverse`       | 5.79:1  | 6.77:1  | 4.5:1 |
| `national-red-on-dark` | `surface-hero`          | 6.77:1  | 7.11:1  | 4.5:1 |
| `text-on-inverse`      | `surface-inverse`       | 16.43:1 | 18.13:1 | 4.5:1 |
| `text-on-hero`         | `surface-hero`          | 18.13:1 | 19.05:1 | 4.5:1 |
| `success`              | `success-soft`          | 4.76:1  | 6.34:1  | 4.5:1 |
| `warning`              | `warning-soft`          | 5.48:1  | 8.07:1  | 4.5:1 |
| `danger`               | `danger-soft`           | 5.40:1  | 6.12:1  | 4.5:1 |
| `text-on-tier`         | `tier-platinum`         | 13.61:1 | 11.22:1 | 4.5:1 |
| `text-on-tier`         | `tier-gold`             | 5.43:1  | 10.60:1 | 4.5:1 |
| `text-on-tier`         | `tier-silver`           | 4.83:1  | 7.60:1  | 4.5:1 |
| `text-on-tier`         | `tier-bronze`           | 6.77:1  | 7.04:1  | 4.5:1 |
| `text-on-tier`         | `tier-community`        | 5.38:1  | 8.64:1  | 4.5:1 |
| `focus`                | `surface`               | 7.59:1  | 8.21:1  | 3:1   |
| `focus-on-hero`        | `surface-hero`          | 6.77:1  | 7.11:1  | 3:1   |
| `border-strong`        | `surface`               | 5.92:1  | 8.04:1  | 3:1   |

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

These primitives have no runtime state, no fetching, and no validation. They are pure render functions of their props.
