# Testing standards

- Preserve Vitest, React Testing Library, and Playwright.
- Add a failing regression test before fixing a proven defect.
- Prefer assertions on roles, labels, links, and visible behavior.
- Keep tests deterministic, isolated, order-independent, and offline by default.
- Never call live AWS services or depend on production credentials.
- Mock the typed API boundary or use committed Sessionize fixtures.
- Exercise success, validation failure, timeout, empty-state, and partial-failure paths where applicable.
- Run focused tests during implementation, then `npm run verify`; page changes also require `npm run verify:e2e`.
- Ratchet coverage from the measured baseline. New or materially changed logic should reach at least 90 percent where practical.
