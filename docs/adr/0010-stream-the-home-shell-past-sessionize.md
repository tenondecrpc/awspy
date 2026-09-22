# 0010 - Stream the home shell past the Sessionize read

- Status: Accepted
- Date: 2026-09-22
- Deciders: Repository owner

## Context

The home page rendered its whole document only after `listSpeakers` returned.
Measured against the live API, that read costs about 245ms on a warm connection
and 1049ms on a cold one, and it was the whole difference between the dynamic
routes and the static ones:

| Route | Rendering | TTFB (warm) | TTFB (cold) |
|---|---|---|---|
| `/faq`, `/sponsors` | static | ~20ms | ~20ms |
| `/`, `/speakers`, `/schedule` | dynamic | ~290ms | ~1050ms |

On production the home document measured 0.42-0.91s, served with
`private, no-cache, no-store, max-age=0, must-revalidate`.

That delay sits in front of everything else. The hero photo is the LCP element
and is preloaded from `<head>`, so the browser could not even begin fetching it
until the Sessionize read had finished. Work on the image itself (ADR-free, see
`0484256`) cut its bytes and made its CDN entry immutable, but left this second
in front of it untouched.

The obvious fix is to let a CDN cache the document, and it is not available
here. Next derives `Cache-Control` from the rendering strategy, so a cacheable
header means ISR — and `cache: "no-store"` on the Sessionize reads exists
because of LOGIC-016: on 2026-09-09 Amplify served a stale prerender with one
speaker while the API had seven, beyond the configured interval, on an
unqualified Next.js 16 runtime. Forcing a `s-maxage` header onto a dynamic route
from `customHttp.yml` is worse than ISR rather than safer: the Next CDN caching
guide warns that App Router responses vary on the `rsc` header and the `_rsc`
search parameter, so a cache that does not key on them will serve HTML to a
request expecting an RSC payload and break client-side navigation.

## Decision

Keep the home page dynamic and keep `cache: "no-store"`. Remove the delay
instead of the dynamism, by suspending only the part of the page that needs
provider data.

`app/page.tsx` and `app/editions/[year]/page.tsx` start the Sessionize read
without awaiting it and hand the promise to `HomeTemplate`. The template renders
the speakers preview inside a `<Suspense>` boundary, so the document shell -
including the `<head>` that carries the hero image preload - flushes before
Sessionize answers.

The page still owns the call, which keeps the rule in `docs/architecture.md`
intact: the template receives a promise as a prop and never reaches for the API
itself.

Measured after the change, locally: first byte at 38ms, speakers section at
302ms, against 290ms warm and 1050ms cold for the whole document before.

## Consequences

- The home TTFB no longer depends on Sessionize. Cold-connection renders, which
  on Lambda happen on every new container, drop from about a second to about
  35ms.
- The document is still not CDN-cacheable. Every request still reaches the
  origin and still renders; this decision buys latency, not load. Making the
  HTML cacheable remains blocked on requalifying ISR on Amplify, which is
  LOGIC-016's open condition, not this record's.
- The speakers section now paints a skeleton first. It is below the fold and
  the fallback reserves the same grid, so it costs no layout shift, but the
  section is briefly empty where it used to arrive complete.
- `use()` on a promise does not resume under React DOM in jsdom, so the unit
  suite only ever sees the fallback. The assertion that the streamed speaker
  links stay inside their edition moved to `e2e/editions.spec.ts`, where a real
  server really streams. This is stronger coverage, but it is e2e-only: a
  regression in that link is no longer caught by `npm test` alone.
- If Amplify buffers the response instead of streaming it, the gain is lost and
  nothing else changes. That is measurable on the deployed document and is the
  first thing to check if the home TTFB stays near a second.

## Alternatives considered

- **Re-enable ISR with a short `revalidate`.** The supported way to get a
  cacheable header, and a direct reversal of LOGIC-016 on a runtime that has not
  been requalified since the incident. Rejected until there is evidence Amplify
  revalidates correctly, which cannot be gathered without running the failure in
  production.
- **Force `s-maxage` on the dynamic routes via `customHttp.yml`.** Rejected: it
  bypasses the strategy signalling Next uses and risks the RSC cache-key hazard
  above, so it trades a latency problem for a correctness one.
- **Load the speakers client-side.** Rejected: it contradicts the RSC-by-default
  rule, introduces client-side server state the repository deliberately avoids,
  and would hurt the SEO-first server rendering the site is built around.
- **Drop the speakers preview from the home page.** It would make the route
  static and cacheable, and was rejected because the preview is content the page
  is there to show.
