# 0010 - Adopt Google Analytics 4 for audience measurement

- Status: Accepted
- Date: 2026-10-01
- Deciders: Repository owner

## Context

The first edition shipped without analytics (FR-037) and with a privacy notice
stating that the site collects no personal data (FR-036). The organizers now
want traffic insights for the site and asked for Google Analytics.

GA4 loads a Google-served script on every page, sets first-party `_ga`
cookies, and sends page views and the visitor's browser data to Google. That
makes the existing notice false and is the first third-party script in the
site. FR-033 already requires any such script to load lazily without blocking
the largest contentful paint.

## Decision

Load GA4 through the Google tag (`gtag.js`) with the built-in `next/script`
component, from the root layout, on every route.

- The measurement ID comes from `NEXT_PUBLIC_GA_MEASUREMENT_ID`. Unset means no
  analytics, so local, CI and E2E builds load nothing. A malformed value fails
  the build. `scripts/write-amplify-env.ts` allowlists the variable.
- Both scripts use the `afterInteractive` strategy, which the Next.js guide
  recommends for analytics: they are injected after hydration and stay off the
  LCP path.
- Client-side navigations are recorded by GA4's enhanced measurement (browser
  history events), so there is no route-change listener in the app.
- Google signals and ad personalization are disabled in the tag config.
- No consent banner. The footer notice discloses Google Analytics and its
  cookies and names it, with Google Forms, under Google's privacy policy. The
  notice follows the build: without a measurement ID it keeps the original
  "Este sitio no recopila datos personales" wording.

## Alternatives

- `@next/third-parties/google`: rejected. It renders the same two scripts, but
  the package is marked experimental and would be a new runtime dependency for
  about twenty lines of code.
- A consent banner with Consent Mode v2 defaulting to denied: deferred. It
  needs a client component and stored choice, and the owner chose a disclosure
  notice instead. It becomes required if the audience or applicable law calls
  for prior consent.
- Google Tag Manager: rejected. It adds a second configuration surface outside
  version control for a single tag.
- A cookieless analytics provider: not chosen; the owner asked for Google
  Analytics.

## Consequences

- Every page downloads `gtag.js` from Google after hydration. It does not
  change LCP, but it adds transfer and main-thread work after load.
- Google receives page views, referrers, and device data for every visit. The
  repository still stores no personal data.
- FR-036 and FR-037 are amended to describe the conditional notice and the
  allowed analytics.

## Security impact

The measurement ID is public, but it is interpolated into an inline script, so
it is restricted to `G-` plus uppercase letters and digits before it reaches
the page. When the staged CSP lands it must allow `script-src` and
`connect-src` for `https://www.googletagmanager.com` and
`https://*.google-analytics.com`, plus the inline config script by nonce or
hash.

## Operational impact

Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` in the Amplify console for the production
branch only, then redeploy: the value is inlined at build time. Leave it unset
on preview branches so test traffic does not reach the property.

## Migration plan

1. Merge with the variable unset; production behavior and copy do not change.
2. Set the variable on `main` in Amplify and redeploy.
3. Confirm the footer notice changed and GA4 Realtime shows the visit.

## Rollback strategy

Remove the variable in Amplify and redeploy. The scripts stop loading and the
notice reverts to the original wording with no code change.
