# Contract: Palette tokens

This document is the authoritative contract for the color palette of the AWS Community Day Paraguay site after the visual refresh. It binds every consumer (atoms, molecules, organisms, templates, pages) to a single source of truth: `app/globals.css`.

## Source of truth

- File: `app/globals.css`
- Mechanism: Tailwind v4 `@theme { ... }` block for the light scheme, plus `@media (prefers-color-scheme: dark) { @theme { ... } }` for the dark scheme.
- No other file in the repository (under `app/`, `components/`, `lib/`) MAY declare a color literal (hex, rgb, rgba, hsl, hsla). Allowed exceptions: `currentColor`, `inherit`, `transparent`, `none`.

## Token inventory

The full token list with values per mode lives in `data-model.md`. This contract restates the rules that govern its use:

- Token names are stable. Renaming requires a constitution-amendment-grade discussion; values may be tweaked freely.
- Every new token added in the future MUST be added in `app/globals.css` first, then consumed.
- Every legacy v1 token (`--color-accent`, `--color-action`, `--color-surface*`, `--color-text*`, `--color-tier-*`, `--color-focus`, etc.) MUST keep resolving. Values may change; names may NOT.

## Consumer rules

- A component MAY consume a token via `var(--color-foo)` in inline `style`, in a CSS class string used by Tailwind, or via Tailwind utilities that derive from `@theme`.
- A component MUST NOT inline a hex like `#FF9900` or `rgb(...)`. The lint rule (see `lint-color-rule.md`) enforces this.
- Sponsor tier colors MUST always be paired with text or icon (constitution Principle VI). The `Badge` atom already does this; new components reusing tier colors MUST do the same.
- The hero surface (`--color-surface-hero`) is reserved for hero sections and dark callout blocks. Other sections use `--color-surface` and `--color-surface-muted` alternated.

## Mode rules

- The site honors the user OS preference via `prefers-color-scheme`.
- No JavaScript toggle is shipped in this iteration.
- Both modes MUST satisfy AA contrast on every documented foreground/background pair.

## Verification

- `npm run lint` MUST pass with the no-color-literals rule.
- A unit test under `tests/unit/lib-utils-tokens.test.ts` parses `app/globals.css` and asserts that every token name listed in `data-model.md` is present in both modes.
- A manual contrast check (using a public WCAG calculator) MUST be recorded once per release for each pair in the contrast verification matrix.

## Out of scope

- Theming for branded sub-events (e.g. workshops with sponsor color overrides).
- Gradients beyond a flat surface (none are introduced).
- Per-edition palette overrides (every edition uses the same palette today).
