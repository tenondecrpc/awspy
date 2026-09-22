# Project status

- Last updated: 2026-09-22
- Baseline commit: `1043a48c39e7db8fab1916f30119b43cb8165014`
- Working branch: `main`
- Overall health: The site is deployed and serving on the public domain. Image delivery, static response headers, and phone layouts were corrected and verified against production this cycle. Deployment validation and external AWS release readiness remain conditional.
- Validated work items: 37
- Implemented but externally unvalidated work items: 0
- Rejected work items: 1 (`PERF-003`, measured and reverted)
- Deferred work items: 3
- Blocked work items: 3
- Findings discovered: 0 Critical, 3 High, 9 Medium, and 13 Low or Informational after audit reconciliation
- Open application security findings: 0 Critical, 0 High, 0 Medium, 1 Low deferred contract decision
- Tests: 65 Vitest files with 558 tests passed; 167 Playwright project-expanded tests passed with 1 skipped
- Coverage baseline: `NOT AVAILABLE`
- Coverage final: 84.72% statements, 79.90% branches, 83.25% functions, 85.46% lines
- Dependency status: 0 known npm vulnerabilities; maintenance and legal review remain `NOT VERIFIED`
- AWS readiness: Conditional. Amplify serves the production domain, but the Next.js 16 runtime is still unqualified and two of its limits are now measured rather than assumed (see below).
- Major risks: unsupported hosting/runtime combination, and request-time Sessionize outages affecting dynamic provider sections
- Independent review: no Critical, High, or Medium findings remain
- Current blockers: `BLK-001`, `BLK-002`, and `BLK-003`
- Recommended next milestone: qualify ISR on a preview branch so `LOGIC-016` can be closed on evidence rather than on a two-week-old incident, and repair the remaining hosting-runtime gaps before production release.

## Measured Amplify runtime limits

Two limits were measured this cycle and recorded in `docs/deployment.md`. Both
are facts about the host, not about the application, and both should be
re-measured rather than assumed if the runtime is upgraded.

- **Response streaming is not available.** The deployed document arrives with
  one millisecond between its first and last byte, against 16ms to 1000ms for
  the same build served locally. A `<Suspense>` boundary therefore cannot get
  the shell, or the hero image preload, to the browser early. `PERF-003` was
  implemented on that premise and reverted once measured.
- **`next.config.ts` headers do not reach directly-served files.** Amplify
  applies the `headers()` block to rendered responses only; `public/`,
  `.next/static/` and the image optimizer arrived without it. `customHttp.yml`
  is the Amplify-side mirror, and the two are expected to agree.

A third measurement corrects a standing assumption: the Sessionize read is not
what makes the dynamic routes slow. From `us-east-1` it is cheap, and the route
that stopped awaiting it measured the same as the two that still do. The ~0.32s
gap between a static route (~0.09s) and a dynamic one (~0.41s) is the compute
path, and the only lever that closes it is letting the CDN serve the document.
