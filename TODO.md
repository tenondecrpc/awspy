# TODO

## Kiro chat: lock page scroll while pointer is over the chat

**Problem.** When the Kiro FAQ chat (`components/organisms/KiroMascot.tsx`) is
open, scrolling should stay *inside* the chat and never move the page behind
it. Today this works only partially: scrolling while the pointer is over a
message bubble behaves correctly, but scrolling anywhere else inside the
modal (the header, the padding/gaps, the suggestion area, or past the top/
bottom of the transcript) leaks through and scrolls the page.

**Desired behavior.** While the chat is open and the pointer (or touch) is
over any part of the chat panel, page scroll must be locked. The transcript
should still scroll internally; the rest of the panel should simply absorb
the scroll instead of passing it to the document (no scroll chaining).

**Implementation notes / candidates.**
- Add `overscroll-behavior: contain` to the scrollable transcript so reaching
  its top/bottom does not chain to the page.
- The non-scrollable regions (header, suggestions) still need handling: either
  make the whole panel the scroll container, or prevent `wheel`/`touchmove`
  default on the panel when the target is not the transcript.
- Consider locking `<body>` scroll entirely while the chat is open
  (e.g. toggling `overflow: hidden` on `document.body`, restoring on close),
  which is the most robust fix and matches typical modal behavior. Watch for
  layout shift from scrollbar removal; compensate with scrollbar-gutter or a
  padding offset if needed.
- Respect the existing reduced-motion rules and keep the custom
  `.kiro-chat-scroll` scrollbar styling intact.

**Acceptance.** With the chat open, no wheel/touch gesture originating inside
the panel scrolls the page, on both desktop and touch, while the transcript
still scrolls internally.
