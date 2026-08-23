# Performance review

## Baseline

- Production build: passed on 2026-08-23 with 27 prerendered routes.
- Vitest: 270 tests passed.
- Playwright: 82 tests passed across desktop and mobile Chromium.
- Lighthouse: `NOT MEASURED` in the baseline environment.
- CPU, memory, network call count, image output, and Amplify cost: `NOT MEASURED`.
- Baseline static chunks: 708,275 bytes total; 662,091 JavaScript bytes.

## Evidence-based actions

- Removed the unused global TanStack Query provider and dormant TanStack Query,
  Zustand, and MDX compiler dependencies.
- Keep server-rendered local content and Next.js-native caching.
- Do not add application caching, provider concurrency, compression libraries, or microbenchmarks without evidence.

## Final results

- Final static chunks: 684,018 bytes total; 637,834 JavaScript bytes.
- Reduction: 24,257 bytes in both totals, or approximately 3.7 percent of
  baseline JavaScript chunks.
- Locked dependency graph: 645 packages audited at baseline, 545 after removal.
- Production build: 27 routes passed after the change.
- Lighthouse and AWS runtime profiling: `NOT MEASURED`; external preview is
  blocked by AWS-001 and AWS-002.
