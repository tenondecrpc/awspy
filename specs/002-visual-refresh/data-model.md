# Visual refresh token model

This feature introduces no backend or content entity. Its data model is the
semantic token map. `app/globals.css` is the source of truth; values below
describe the reconciled PR 29 implementation. Earlier proposal and plan files
in this specification record their original design direction, including
components later removed by the editorial redesign. They are historical
planning records, not a current component inventory.

## Palette and theme

The light palette uses warm paper and midnight ink sampled from the Paraguay
event artwork. The dark palette keeps the blue family. Amazon Orange is the
registration action; flag blue is the link accent; Paraguayan red is identity
and inline-link decoration. Light is the default. An explicit
`html[data-theme="dark"]` override selects dark, including when chosen by the
header control. Operating-system preference alone does not select dark.

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| `--color-surface` | `#f7f2e8` | `#010928` | Page ground |
| `--color-surface-muted` | `#ece3d0` | `#071438` | Alternate reading surface |
| `--color-surface-warm` | `#f4e6d2` | `#16142e` | Warm section |
| `--color-surface-elevated` | `#ffffff` | `#0d1b46` | Cards |
| `--color-surface-inverse` | `#08152f` | `#08152f` | Navy panels |
| `--color-surface-hero` | `#000c2f` | `#01051d` | Hero and closing panels |
| `--color-surface-logo-plate` | `#ffffff` | `#ffffff` | Unaltered sponsor marks |
| `--color-text-primary` | `#08152f` | `#f7f8ff` | Main reading text |
| `--color-text-secondary` | `#34415f` | `#c5ccea` | Secondary text |
| `--color-text-muted` | `#4f586e` | `#9aa5ca` | Metadata |
| `--color-accent` | `#0038a8` | `#74a8ff` | Links and blue identity |
| `--color-action` | `#ff9900` | `#ff9900` | Registration CTA |
| `--color-action-label` | `#9a5200` | `#ff9900` | Accessible action-colored text |
| `--color-national-red` | `#f02f3b` | `#ff4b5b` | Flag and decoration |
| `--color-national-white` | `#ffffff` | `#ffffff` | White flag band |
| `--color-focus` | `#0a4db8` | `#74a8ff` | Normal-surface focus |
| `--color-focus-on-hero` | `#ff5566` | `#ff5566` | Navy-surface focus |

The CSS also defines explicit text-on-action, inverse text, border, status,
category, and sponsor-tier tokens. Tier colors always accompany written
labels; the flag and category colors never carry meaning alone. The sponsor
logo plate and national white are fixed across both themes.

## Type and layout

Young Serif is the display face for `h1` and `h2`. Atkinson Hyperlegible Next
is the reading face and supplies `h3`, `h4`, and controls. The `next/font`
variables are attached to `<html>`. Type steps `-1` to `1` use rem floors and
width-based fluid growth without viewport-height caps so 200% zoom can enlarge
reading text. Display steps `2` to `4` may use a height cap, but keep rem floors.

`--size-touch` is 2.75rem. `--space-section-y` controls inner-page spacing.
`.fit-screen` uses minimum height and can grow when content needs more room.
Agenda rails use `--header-h` for their sticky offset. The current component
inventory is in `design-system/components.md`.

## Verification

The color-pair and token assertions in `tests/unit/lib-utils-tokens.test.ts`
and `design-system/scripts/check-contrast.mjs` use the CSS values. Rendered
accessibility and zoom checks verify combinations that static token tests
cannot cover. Do not copy the ratio table from the original proposal: its
Squid Ink and white-surface values no longer describe this site.
