# AWS Community Day Paraguay

Public website for AWS Community Day Paraguay. The application is a Next.js
App Router site with version-controlled event content and public Sessionize
data.

## Deployment status

- Intended public URL: <https://awscommunitydayparaguay.com> (currently blocked by DNS; see `docs/status/BLOCKERS.md`)
- AWS Amplify app: `d2dgeqbarexvjr`
- Region: `us-east-1`
- Production branch: `main`
- Amplify fallback URL: <https://main.d2dgeqbarexvjr.amplifyapp.com>

Deployment and domain recovery procedures live in
[`docs/deployment.md`](docs/deployment.md).

The documentation index is [`docs/README.md`](docs/README.md). It links the
architecture, CI contract, ADRs, and documented exceptions.

## Stack

- Next.js 16 App Router and React 19
- TypeScript in strict mode
- Tailwind CSS 4
- Zod 4 at content and API boundaries
- Vitest, React Testing Library, and Playwright

The repository does not contain a backend or database. Event metadata,
sponsors, organizers, venue details, FAQ content, and the code of conduct live
under `content/editions/{year}/`. Speakers, schedule, and CFP management come
from Sessionize.

The attendee registration provider is not finalized. The current code supports
an optional external Eventbrite link, but the 2026 edition leaves it unset. If
another provider is selected, update the Eventbrite-specific schema and
component names before opening registration.

## Local setup

Requirements:

- Node.js 24.15.0 (pinned in `.nvmrc`)
- npm 11.12.1 (recorded by `packageManager`; npm 10 or newer remains accepted by `engines`)

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>.

## Environment

| Variable | Required | Purpose |
|---|---:|---|
| `CURRENT_EDITION` | yes | Four-digit edition served from the top-level routes. |
| `NEXT_PUBLIC_SITE_URL` | yes in production | Absolute public origin used by canonical URLs, sitemap, robots, Open Graph, and JSON-LD. |
| `NEXT_PUBLIC_SESSIONIZE_BASE_URL` | no | Sessionize API override for tests or local fixtures. |

Use `http://localhost:3000` for local development and
`https://awscommunitydayparaguay.com` in production.

## Commands

```sh
npm ci
npm run dev
npm run format:check
npm run lint
npm run typecheck
npm test
npm run test:coverage
npm run e2e
npm run build
npm run verify
npm run verify:e2e
npm run secretlint
npm run security:audit
npm run security:signatures
npm run sbom
npm start
```

`npm run e2e` exercises the development server. `npm run verify:e2e` builds and exercises the production server. Set `BASE_URL` and run the deploy-smoke Playwright spec to check an authorized external preview without starting a local server.

The host used for this audit did not expose Node.js in `PATH`. The commands above were executed with the repository mounted into `node:24.15.0-bookworm-slim`; Playwright used `mcr.microsoft.com/playwright:v1.59.1-noble`. See `docs/status/BASELINE.md` and `docs/status/PROJECT_STATUS.md` for exact results and environment limitations.

## Content workflow

- Edit local event content under `content/editions/{year}/`.
- Publish speakers, schedule, and CFP changes in Sessionize.
- Keep `eventbriteEventUrl` unset and `registrationStatus` set to `upcoming`
  until the attendee registration provider is selected.
- Run lint, type checking, tests, and a production build before release.

See [`specs/001-community-day-site/quickstart.md`](specs/001-community-day-site/quickstart.md)
for the complete editorial and new-edition workflow.

## Architecture

React components follow atomic design under `components/`. Pages own data
loading, `lib/content/` validates local content, and `lib/api/` is the only
boundary for external HTTP data. Current and target diagrams are under
[`docs/architecture/`](docs/architecture/).

## Security and supply chain

- Report vulnerabilities privately as described in [`SECURITY.md`](SECURITY.md).
- `npm run secretlint` scans project source and canonical AI guidance.
- `npm run security:audit` checks the locked dependency graph.
- `npm run security:signatures` verifies registry signatures and attestations.
- CI additionally runs redacted Gitleaks history scanning and retains a CycloneDX SBOM without committing generated output.

Findings, risks, and dependency status are in [`docs/status/`](docs/status/).

## AWS architecture and operations

AWS Amplify Hosting remains the conditional target because the site requires Next.js ISR and image behavior. Production readiness is blocked until Next.js 16 is proven on an isolated Amplify preview and the public domain resolves. The rationale, runbook, IAM/OIDC requirements, monitoring, rollback, and remaining work are documented in [`docs/aws/`](docs/aws/).

No IaC is included because external resource ownership and runtime support are not yet sufficiently clear. This is a deliberate decision, not permission to configure AWS manually without review.

## Multi-agent development

Root [`AGENTS.md`](AGENTS.md) is a minimal loader. Canonical policy, roles, workflows, and templates live under [`.ai/`](.ai/). Claude Code loads `.claude/CLAUDE.md`; Codex uses `.codex/config.toml` and the narrow project agents under `.codex/agents/`. Spec Kit writes mutable plan context only to `.ai/generated/project-context.md`.

Use `docs/status/WORK_ITEMS.md` for completed, pending, blocked, and deferred work. Follow `CONTRIBUTING.md` and the applicable `.ai/workflows/` document for changes and handoffs.

## Troubleshooting

- If formatting fails only in a Windows-mounted Linux container, confirm `.gitattributes` is present and use a fresh checkout; it enforces LF without a repository-wide content rewrite.
- Do not share one `node_modules` directory across Windows and Linux when validating `npm ls`; use a clean platform-specific `npm ci`.
- If speaker or schedule data is empty, verify the edition event ID and Sessionize availability. Static local content should still render.
- If the custom domain fails while the Amplify fallback works, follow `docs/deployment.md` and `docs/aws/AWS_OPERATIONS.md`; do not change DNS without authorized access.
