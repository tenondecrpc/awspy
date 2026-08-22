# 0002 - Verification contract lives in npm scripts

- Status: Accepted
- Date: 2026-08-21
- Deciders: Repository owner

## Context

Quality checks duplicated between local instructions, GitHub Actions, and
Amplify can drift. A provider-specific pipeline is not convenient to run before
opening a pull request.

## Decision

`npm run verify` is the portable quality contract. It runs formatting, lint,
TypeScript, unit and component tests, secret scanning, and a production build.
Provider configuration calls that command rather than repeating its contents.

Playwright remains a separate release-level command because it requires a
browser and local server.

## Consequences

- A contributor and CI can execute the same gate.
- Moving CI providers changes plumbing rather than repository rules.
- Changes to verification happen in `package.json`.
- Build-time network requirements are visible locally as well as in Amplify.

## Alternatives considered

- Commands duplicated in every pipeline: rejected because local and hosted
  verification would drift.
- A Makefile: rejected because npm already provides the repository task runner.
- Playwright in every verification run: deferred because of browser runtime and
  execution cost; `npm run verify:e2e` remains available for releases.
