# AWS Community Day Paraguay design system

The visual identity takes its colors from the Paraguay 2026 event artwork. It
uses warm paper, midnight blue, the colors of the national flag, large event
photography, and an original lace motif. The source of truth for tokens and
typography is [`app/globals.css`](../app/globals.css); components live under
[`components/`](../components/).

| Document | Scope |
| --- | --- |
| [foundations.md](foundations.md) | Colors, type, spacing, motion, and accessibility |
| [components.md](components.md) | Component inventory and usage |
| [mobile-patterns.md](mobile-patterns.md) | Small-screen layout and acceptance checks |
| [brand-alignment.md](brand-alignment.md) | Community-event status and AWS brand boundaries |
| [roadmap.md](roadmap.md) | Implemented design and remaining review |
| [scripts/check-contrast.mjs](scripts/check-contrast.mjs) | Palette contrast check |

## Principles

- Keep the event's content and photography prominent. A solid navy panel gives
  the home hero its title; photos do not carry text overlays.
- Use `Lace` sparingly as an original radial motif inspired by the structure
  of nanduti. It does not reproduce an artisan's work.
- Use Young Serif for page and section headings, Atkinson Hyperlegible Next for
  reading text and controls, and mostly square corners and fine rules.
- Use Paraguayan Spanish and claims supported by the event content. Preserve
  event facts, calls to action, and empty states while changing layout.
- Show every content item at normal viewport sizes and 200% zoom. Sections may
  grow vertically; content is never hidden just because the window is short.
- Keep Kiro's real chat, motion, and masked shader; provide reduced-motion and
  keyboard behavior through its component.

Colors belong in `app/globals.css` and the local ESLint rule rejects literals
in application code. The atomic component direction is templates, organisms,
molecules, then atoms. Attendee-facing copy stays in Spanish; code and
technical documentation use English.
