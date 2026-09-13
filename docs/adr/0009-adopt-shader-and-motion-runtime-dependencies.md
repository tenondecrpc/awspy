# 0009 - Adopt shader and motion runtime dependencies for the Kiro mascot

- Status: Accepted with constraints
- Date: 2026-09-13
- Deciders: Repository owner

## Context

The visual redesign introduced a floating "Kiro" mascot rendered in the root
layout on every route. It draws an animated mesh gradient clipped to the Kiro
mark, with eyes that blink and track the pointer. The implementation added two
runtime dependencies that had not been recorded: `@paper-design/shaders-react`
for the WebGL mesh gradient and `framer-motion` for the eye animation.

The repository requires an ADR before a material dependency lands. The
dependencies were merged in `700ab48` without one; this record closes that gap
rather than reverting shipped work, and states the constraints that keep them
acceptable.

Measured cost at the time of writing: the client chunk carrying the mascot is
176 KB minified and, because the mascot lives in the root layout, it is part of
the first load of every page. `@paper-design/shaders-react` is published at
`0.0.x`, so it carries no stability guarantee across patch releases.

## Decision

Keep both dependencies for the mascot only, under these constraints:

- The mascot stays presentational. It never becomes a data path: the chat panel
  it opens is the versioned FAQ rendered as a conversation, with no network
  call and no backend.
- `@paper-design/shaders-react` stays on a single patch version. The declared
  `^0.0.80` already resolves to exactly `0.0.80`, because a caret range on a
  `0.0.x` version admits no other release, so no extra pinning is needed. Any
  move off that version is a deliberate upgrade, never an automated bump.
- Shader stop colors remain literals inside the mascot component, documented in
  place. They are fed to a WebGL program and cannot read CSS custom properties;
  every other color in the app keeps using the semantic tokens in
  `app/globals.css`.
- Motion respects `prefers-reduced-motion` through the global rule in
  `app/globals.css`.
- No other feature may import these packages. A second use case reopens this
  decision.

## Consequences

- Every page pays the mascot's client bundle, even routes where it is pure
  decoration.
- The site now ships WebGL. Browsers without a WebGL context degrade to the
  non-animated fallback rather than failing the page.
- A `0.0.x` dependency needs a deliberate upgrade with visual checks; an
  automated bump must not be trusted.
- Dropping the mascot later removes both dependencies with no other code
  changes, since nothing else imports them.

## Alternatives considered

- A static SVG or CSS gradient mascot: rejected because it loses the animated
  creature that the redesign is built around, which was the point of the
  element.
- Hand-written WebGL without a library: rejected because it trades a small,
  replaceable dependency for shader code the team would have to maintain.
- Dropping the mascot entirely: rejected because it is a deliberate part of the
  redesign, but kept as the exit path if the dependency cost grows.
