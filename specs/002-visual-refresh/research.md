# Phase 0 Research: Visual refresh

This document records the technical decisions taken during Phase 0 of the visual refresh, the rationale, and the alternatives considered. It resolves every "NEEDS CLARIFICATION" in `plan.md`.

## R1. Palette numerical values aligned with AWS public branding

**Decision**: Adopt the following base values for the brand-aligned palette:

- Brand primary (Squid Ink navy): `#232F3E`
- Action (Smile Orange): `#FF9900`
- Action strong (orange darker, hover/active): `#EC7211`
- Accent (Hyperlink Blue): `#0073BB`
- Accent strong: `#005A91`
- Accent soft (background tint): `#E6F0F7`
- Anchor (very dark navy, used by hero in dark mode): `#161E2D`
- Neutral surfaces: `#FFFFFF`, `#F4F6FA`, `#E5E9F0`
- Text scale: `#0B1626` (primary), `#364152` (secondary), `#5C6573` (muted)
- State: `#1F7A3A` (success), `#B26200` (warning), `#B3261E` (danger)

All token-to-value pairs are formalized in `contracts/palette-tokens.md`.

**Rationale**: These hues are the ones AWS uses across `aws.amazon.com`, `community.aws`, and the AWS Architecture Icons set. Using the same values gives the Paraguay site immediate visual association with the AWS family without copying any specific community design. AA contrast is verified per pair (see contracts).

**Alternatives considered**:

- A custom palette inspired by Paraguay flag colors. Rejected because it weakens the AWS visual signal that the user explicitly asked for.
- Pure Tailwind defaults (`slate`, `orange-500`). Rejected because the resulting tokens drift from the AWS hues and require constant manual overrides.

## R2. Single source of truth for tokens

**Decision**: All tokens live in `app/globals.css` as Tailwind v4 `@theme { ... }` declarations, with a second `@media (prefers-color-scheme: dark) { @theme { ... } }` block for the dark variant. Existing v1 tokens (`--color-accent`, `--color-action`, etc.) are kept under their original names. New tokens introduced by this feature are added alongside.

**Rationale**: Tailwind v4 already exposes `@theme` tokens as both utility classes and CSS custom properties. Components can consume `var(--color-action)` directly or use generated utilities; either way, the source is one file. No build step is added.

**Alternatives considered**:

- A separate `tokens.css` imported from `globals.css`. Rejected because it splits the source of truth and requires keeping both files synchronized.
- A TypeScript constants file consumed via Tailwind plugin. Rejected because it pulls Tailwind back into JS land and adds plugin code with no proportional benefit.

## R3. Lint rule that prohibits color literals outside `app/globals.css`

**Decision**: Add a custom ESLint rule (or a `no-restricted-syntax` selector) that flags any string literal or template literal containing a hex color (`#[0-9a-fA-F]{3}`, `#[0-9a-fA-F]{6}`, `#[0-9a-fA-F]{8}`), or any `rgb(`, `rgba(`, `hsl(`, `hsla(` token. The rule applies to files under `app/`, `components/`, and `lib/`. CSS files are not linted by ESLint, so `app/globals.css` is naturally excluded; the rule explicitly excludes any file matching `globals.css` for safety. Allowed exceptions: `currentColor`, `inherit`, `transparent`, `none`.

**Rationale**: Zero new dependencies, runs as part of the existing `npm run lint`, deterministic feedback, easy to extend.

**Alternatives considered**:

- Stylelint pipeline. Rejected because it adds a dependency and a parallel linting story for CSS we do not maintain by hand.
- A CI-only `grep` step. Rejected because the feedback loop is at PR-level, not editor-level.

The rule is fully specified in `contracts/lint-color-rule.md`.

## R4. Decorative iconography source

**Decision**: Use the AWS Architecture Icons set distributed officially by AWS. A curated subset of 12 to 20 SVG files is committed under `public/assets/icons/aws-architecture/`, with a `README.md` recording the source URL and version date. The decorative pattern uses these icons at low opacity. They are `aria-hidden="true"` and never carry information.

**Rationale**: The Architecture Icons are designed for free reuse in community materials, render cleanly at any size, and reinforce the AWS visual language. They are vector and already neutral in color (white/grey), making them easy to tint via `currentColor` and the palette tokens.

**Alternatives considered**:

- Reusing decorative SVGs from `day.awscommunity.mx/img/Pattern.svg` or `awscommunitydaycolombia.com/assets/images/svg/*.svg`. Rejected: those are works of authorship belonging to those communities and reusing them would be a copyright issue. They are referenced only as visual inspiration in the spec.
- Lucide or Heroicons. Rejected because they lack the AWS service signal.
- A bespoke decorative pattern. Deferred. We can iterate to a custom pattern later; for v1 of the refresh, the AWS icons are the most direct way to produce the family look.

## R5. Empty-state visual treatment

**Decision**: A new atom `EmptyStateIllustration` renders an inline SVG using only palette tokens (`var(--color-accent-soft)`, `var(--color-action)`, `var(--color-border-subtle)`). The existing `EmptyState` organism gains an optional `illustration` slot; when omitted, the default illustration renders. The block keeps `role="status"` and `aria-live="polite"` from v1 and the illustration carries `aria-hidden="true"`.

**Rationale**: One illustration vocabulary across the whole site, no PNG dependency, no third-party license to track, automatically themable in light and dark.

**Alternatives considered**:

- PNG illustrations from a stock pack. Rejected on license risk and bytes weight.
- Per-section bespoke SVG. Deferred. Can be introduced later when there is a demonstrated need for variety.

## R6. Loading skeleton shape parity

**Decision**: Add an `isLoading?: boolean` prop to `SpeakersGrid`, `ScheduleGrid`, `SponsorsBoard`, and `OrganizersGrid`. When `true`, render a `LoadingGrid` skeleton that mirrors the populated layout (same column count, same gap, same item card aspect ratio). The skeleton uses the existing `Skeleton` atom internally. `aria-busy="true"` and `role="status"` are exposed on the wrapping list. A visually hidden Spanish label ("Cargando ...") is provided per grid. The pulse animation is paused under `prefers-reduced-motion: reduce`.

**Rationale**: Eliminates CLS on slow connections, communicates progress, and stays accessible by reusing the v1 `Skeleton` patterns.

**Alternatives considered**:

- A spinner. Rejected because it is less informative and prone to stop-and-go behavior.
- Letting the empty state render during loading. Rejected because it conflates "nothing to show yet" with "the request is in flight".

The grids continue to render the empty state when `isLoading=false` and the array is empty, which is the existing v1 behavior.

## R7. Image placeholder strategy

**Decision**: A new atom `Placeholder` accepts `kind` (`avatar`, `logo`, `cover`, `hero`), an `aspectRatio` numeric value, and an optional `label` (e.g. initials, sponsor name). It renders a div with the requested aspect ratio, a token-themed background, and the optional label centered. The molecules that today render an image with a fallback (`SpeakerCard`, `SponsorCard`) continue to use their existing fallbacks; the new `Placeholder` is used by `OrganizerCard`, `VenueCard`, and any place that today shows nothing.

**Rationale**: Reserves space, avoids 404 image flashes, and decouples "upload an asset" from "ship code".

**Alternatives considered**:

- `next/image` with a placeholder data URI. Rejected because it requires a real image to anchor the placeholder size.
- Blur-up placeholders. Rejected because they require a real upstream image.

The conventions for which file path each placeholder swaps to are in `contracts/public-assets.md`.

## R8. Dark mode behavior

**Decision**: Driven entirely by `prefers-color-scheme`. No JavaScript toggle. The light values are declared on `:root` (via `@theme`), the dark values are declared inside `@media (prefers-color-scheme: dark) { @theme { ... } }`. Both share the same semantic token names; only the values differ.

**Rationale**: Minimal scope for v1 of the refresh. Matches user OS preference. No layout shift or hydration concern because there is no client toggle.

**Alternatives considered**:

- Manual UI toggle. Deferred to a future feature.
- Force-light only. Rejected as user-hostile.

## R9. Hero composition

**Decision**: Promote `Section` to a `tone="hero"` variant that paints `--color-surface-hero` (Squid Ink in light mode, Anchor navy in dark mode) and sets the text color to `--color-text-on-hero`. Behind the hero content, a `DecorativePattern` atom renders a low-opacity grid of AWS Architecture Icons. The CTAs reuse the existing `Button` variants (primary action-orange, secondary outline on dark).

**Rationale**: Composes from primitives, keeps CTA semantics unchanged, and lets the hero pattern be reused later (CTA banner, end-of-page decoration).

**Alternatives considered**:

- Gradient hero. Rejected because gradients hurt AA contrast and add bytes.
- Video / canvas hero. Rejected because it bloats the LCP and complicates reduced motion.

## R10. Animation intensity

**Decision**: Subtle defaults. The skeleton pulses (existing animation), the hero pattern fades in over 200 ms after first paint (CSS-only, not driven by JS), and the section eyebrow lines have a 150 ms color transition on hover. All of these are suppressed under `prefers-reduced-motion: reduce` by the existing global rule in `app/globals.css`.

**Rationale**: Just enough motion to feel polished; never so much that it competes with content. Reduced-motion compliance is automatic because the global rule already nukes `animation-duration` and `transition-duration`.

**Alternatives considered**:

- Scroll-driven animations. Rejected (motion fatigue, complexity).
- No animation at all. Rejected because the skeleton needs the pulse to read as "loading".

## R11. Asset directory layout under `public/assets/`

**Decision**: Create `public/assets/` with the following sub-directories and conventions:

- `public/assets/hero/`: optional `pattern.svg` (custom hero pattern). When absent, the `DecorativePattern` atom uses the AWS icon set.
- `public/assets/team/<organizer-slug>.jpg`: per-organizer photo, square (1:1) recommended at 400x400. When absent, `OrganizerCard` shows initials in a `Placeholder`.
- `public/assets/venue/cover.jpg`: 16:9 cover for the venue card. When absent, `VenueCard` shows a themed placeholder.
- `public/assets/sponsors/<sponsor-id>.<ext>`: optional self-hosted sponsor logos. The default source remains `Sponsor.logo.light` from the content schema; this directory is for cases where self-hosting is preferred.
- `public/assets/gallery/<edition-year>/<filename>`: optional past-edition gallery (for future use; no UI in v1 of the refresh).
- `public/assets/icons/aws-architecture/`: the curated AWS Architecture Icons drop with `README.md`.

`public/assets/README.md` documents the layout and the placeholder behavior.

**Rationale**: One canonical location keeps the upload flow simple and discoverable. The layout matches what `Placeholder` expects so the swap is automatic.

## R12. Compatibility with v1 token names

**Decision**: Every v1 token referenced in `app/globals.css` and the components today is preserved. New tokens are added; some existing tokens get a refreshed value (e.g. `--color-accent` may shift from the v1 `#0B5FFF` to the AWS Hyperlink Blue `#0073BB`). The change is value-only, not name-only, so no component code edit is required for renaming.

**Rationale**: The refresh remains visual-only. v1 component code keeps compiling and rendering correctly with the refreshed values.

**Alternatives considered**:

- Rename tokens to a new namespace (`--color-brand-action` vs. `--color-action`). Rejected because it forces a sweep across every component, which contradicts the user's "no refactor" guardrail.

## Output

`research.md` (this file) plus the contracts in `contracts/`. No NEEDS CLARIFICATION remains.
