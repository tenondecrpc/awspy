# Contributing

## Before work

Read `AGENTS.md`, `.ai/AGENTS.md`, the applicable shared standards, `docs/README.md`, and `docs/status/PROJECT_STATUS.md`. Link substantive work to an existing work item or add one with acceptance criteria.

## Development flow

1. Create a focused branch from the intended baseline.
2. Install with `npm ci` using Node.js 24.15.0.
3. Add characterization or regression tests before changing critical behavior.
4. Keep external data behind `lib/api/` and local content under `content/editions/{year}/`.
5. Run `npm run verify`; page changes also run `npm run verify:e2e` and browser checks.
6. Update specs, ADRs, status, security, dependency, and AWS records as applicable.
7. Use an English Conventional Commit message and do not include generated artifacts.

## Definition of done

- Specification and acceptance criteria are current.
- Implementation and meaningful tests are complete.
- Formatting, lint, typing, unit/integration, secret, build, and relevant E2E checks pass.
- Security, dependency, accessibility, performance, and AWS impacts are reviewed.
- User-visible Spanish copy is approved and accessible.
- Rollout and rollback are explicit.
- Work-item validation evidence is recorded.

See `SECURITY.md` for private vulnerability reporting.
