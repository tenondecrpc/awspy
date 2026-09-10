# Contract: Palette tokens

This document is the authoritative contract for the color palette of the AWS Community Day Paraguay site after the visual refresh. It binds every consumer (atoms, molecules, organisms, templates, pages) to a single source of truth: `app/globals.css`.

## Source of truth

- File: `app/globals.css`
- Mechanism: one top-level Tailwind v4 `@theme { ... }` block registers the semantic utilities. Regular CSS overrides the same variables for the OS dark preference and `html[data-theme="dark"]`.
- No other file in the repository (under `app/`, `components/`, `lib/`) MAY declare a color literal or a Tailwind named color utility. Allowed exceptions: `currentColor`, `inherit`, `transparent`, `none`, and the documented Satori boundary in `app/opengraph-image.tsx`.

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
- Blue action tokens own links, navigation, and CTA fills. National red MUST NOT replace danger semantics or primary actions.
- `--color-national-red` is decorative only. Red text uses `--color-national-red-label` on normal surfaces and `--color-national-red-on-dark` on hero/inverse surfaces.

## Mode rules

- The site honors the user OS preference via `prefers-color-scheme`.
- A subtle header toggle can override the active mode with `data-theme="light|dark"`; its validated choice is persisted under the versioned site theme key.
- A synchronous, static initialization script applies the saved or OS-derived mode before hydration to prevent an incorrect-theme flash.
- Both modes MUST satisfy AA contrast on every documented foreground/background pair.

## Verification

- `npm run lint` MUST pass with the no-color-literals rule.
- A unit test under `tests/unit/lib-utils-tokens.test.ts` parses `app/globals.css`, asserts that every token is present in both modes, and calculates every documented WCAG contrast ratio.
- Component and Playwright tests verify the accessible toggle state and persistence across reloads.

## Out of scope

- Theming for branded sub-events (e.g. workshops with sponsor color overrides).
- Gradients beyond a flat surface (none are introduced).
- Per-edition palette overrides (every edition uses the same palette today).
