# Components

The component inventory follows the atomic structure under `components/`.
Application colors come from the semantic tokens in `app/globals.css`.

## Visual motif and page primitives

| Component | Purpose |
| --- | --- |
| `atoms/Lace.tsx` | Original radial lace geometry in `currentColor`; decorative and `aria-hidden` |
| `molecules/SectionPrimitives.tsx` | `WRAP`, `SECTION_Y`, `SECTION_FIT`, headings, buttons, and image `Frame` |
| `atoms/FlagRule.tsx` | Three-color flag rule; its white band remains white in both themes |
| `atoms/MeshGradientSVG.tsx` | Masked shader inside Kiro's silhouette |
| `organisms/KiroMascot.tsx` | Interactive FAQ chat with keyboard and reduced-motion behavior |

`SectionTitle` uses Young Serif for section headings and presents its action
as a secondary button. `PageHeader` introduces an inner page without hiding
content. `Frame` provides responsive `next/image` rendering with an explicit
`sizes` value.

## Page patterns

- **Home:** event photo and solid navy title panel; live countdown; all seven
  projected figures; content pillars; edition agenda, speakers, venue, FAQ,
  organizers, sponsor slots, and three participation actions.
- **Agenda:** a room rail and a time or day rail stay below the header. Session
  descriptions use `<details>`. Rooms carry both a color and a text label.
- **Speakers and team:** square portraits with a fallback, full biographies,
  talk information, and clearly labeled external links.
- **Sponsors:** confirmed logos stay on white plates. Available tiers produce
  "Tu logo aquí" slots. The package ladder and comparison table use the
  version-controlled prospectus without publishing amounts.
- **Registration and CFP:** current content and provider links stay visible;
  archived and unavailable states have explicit copy and safe fallbacks.
- **Footer and privacy:** complete navigation, event context, contact, provider
  notices, and a permanent link to `/privacy`.

## Component checklist

- [ ] Use semantic color tokens and retain light and dark contrast.
- [ ] Keep Spanish copy backed by event data and include empty or closed states.
- [ ] Preserve one `h1`, semantic headings, visible focus, and keyboard access.
- [ ] Provide 44px touch targets and avoid horizontal page scroll at 320px.
- [ ] Keep all content available at 200% zoom and with reduced motion.
- [ ] Give images descriptive alternatives and responsive `sizes`.
