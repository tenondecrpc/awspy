# Canonical repository instructions

## Precedence and scope

Explicit user instructions take precedence. Then follow this file, the shared standards, the relevant role, and the relevant workflow. Consult `docs/README.md` for mutable project context and `docs/status/PROJECT_STATUS.md` for current state.

## Project

AWS Community Day Paraguay is a public, content-driven Next.js frontend. Version-controlled edition content and public Sessionize data drive the site. There is no application backend, database, or private runtime integration.

Use React Server Components by default. Pages own data loading. Components must not call external APIs directly. Keep the atomic design dependency direction: templates -> organisms -> molecules -> atoms. A tier may depend only on its own or lower tiers.

## Mandatory boundaries

- Use the typed native `fetch` client in `lib/api/`; do not add another HTTP client.
- Validate external data with Zod and derive TypeScript types from schemas.
- Keep server state out of Zustand. Use TanStack Query only if client-side server state is actually introduced.
- Use Next.js cache primitives for server reads.
- Do not add persistence or private integrations to this frontend.
- Use semantic color tokens from `app/globals.css` in application styling.
- Preserve Spanish attendee-facing copy. Write code, tests, technical docs, and repository metadata in English.
- Use npm unless a package-manager change is explicitly approved.
- Do not add a material dependency, deployment path, or architecture pattern without an ADR.

## Required discovery

Before editing Next.js code, read the relevant version-matched guide under `node_modules/next/dist/docs/`. Before changing behavior, inspect the applicable feature spec under `specs/` and preserve public contracts unless a proven defect has a regression test.

## Verification

Run `npm run verify` before reporting a change complete. Run `npm run verify:e2e` for page or component changes. If a command cannot run, report the exact limitation and never claim success.
