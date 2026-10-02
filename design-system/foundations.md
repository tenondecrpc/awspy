# Foundations

The current values live in `app/globals.css`. This guide describes their use;
the CSS is authoritative when values change.

## Color

The 2026 event artwork provides the midnight, flag blue, and Paraguayan red
palette. Warm paper grounds the light theme. The dark theme keeps the navy
family and adapts text, borders, and cards.

| Role | Tokens | Use |
| --- | --- | --- |
| Paper and cards | `surface`, `surface-muted`, `surface-warm`, `surface-elevated` | Page background and reading sections |
| Navy | `surface-inverse`, `surface-hero` | Hero, venue, and closing panels |
| Flag | `national-red`, `national-white`, `accent` | Identity rule, emphasis, and links |
| Action | `action`, `action-strong`, `action-label` | Registration button and its states |
| Text and borders | `text-*`, `border-*` | Semantic contrast on each surface |
| Feedback | `focus`, `success`, `warning`, `danger` | Keyboard focus and named status |
| Sponsors | `tier-*`, `surface-logo-plate` | Labeled tiers and unchanged logo artwork |

Never use color as the only signal. The flag's white band and sponsor logo
plates stay white in both themes. Verify pairs with
`node design-system/scripts/check-contrast.mjs` and the rendered accessibility
checks.

## Typography

Young Serif is used for `h1` and `h2`; Atkinson Hyperlegible Next is used for
body text, controls, `h3`, and `h4`. The font variables are attached to `<html>`
because the root tokens reference them. Type steps `-1` through `1` follow
viewport width with rem floors and ceilings. Display steps `2` through `4`
also respond to viewport height; their rem floors remain intact at 200% zoom.
Do not synthesize bold Young Serif.

## Spacing and layout

`WRAP` limits line length and gives the page responsive gutters.
`--space-section-y` controls inner-page vertical rhythm. Corners are mostly
square; borders and rules replace shadows. A home section can use
`.fit-screen`, which has a minimum viewport height and grows with its content.
Scroll snap is proximity-based on sufficiently large screens, so tall content
remains reachable. No section, statistic, or agenda item is hidden because a
window is short.

The home hero places the photograph above its text panel on phones and beside
it on wide screens. The projected-figures band shows all configured values.
Agenda rails stay directly below the sticky header via `--header-h`.

## Motion and images

Hover changes color or decoration, and active buttons shift by one pixel.
Kiro retains its masked mesh shader and motion, with a reduced-motion path.
Use `next/image` with dimensions or `fill` and `sizes`. Square portraits keep
the person's face visible; sponsor logos use `object-contain` on a white plate.
Do not stretch low-resolution photos beyond useful clarity.

## Actions and access

`BTN_PRIMARY` is the registration action; `BTN_OUTLINE` and
`BTN_OUTLINE_ON_DARK` serve secondary actions. Inline links remain underlined.
Touch targets use `--size-touch` (44px). Every route has one `h1`, a skip link,
visible focus, semantic landmarks, and descriptive image alternatives. Body
copy must remain readable and operable at 200% zoom.

`tieLast()` keeps short final word pairs together in headings and labels.
It preserves line breaks and should not alter long prose or session
descriptions. Phone numbers and times do not split across lines.
