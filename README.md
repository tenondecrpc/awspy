# AWS Community Day Paraguay

Public website for AWS Community Day Paraguay. The application is a Next.js
App Router site with version-controlled event content and public Sessionize
data.

The repository contains only the public frontend. It has no application
backend, database, authentication layer, queues, or private AWS SDK
integration. Local edition content remains renderable when Sessionize is
unavailable; Sessionize-dependent speaker and schedule views degrade through
the application's explicit error and empty-state paths.

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
- AWS Amplify Hosting as the conditional deployment target

The repository does not contain a backend or database. Event metadata,
sponsors, organizers, venue details, FAQ content, and the code of conduct live
under `content/editions/{year}/`. Speakers, schedule, and CFP management come
from Sessionize.

Eventbrite is the selected attendee registration provider. Registration for
Paraguay 2026 is open through the official event URL in `eventbriteEventUrl`.
The home CTA leads to `/register`, which opens Eventbrite in a new tab.

## Repository structure

```text
.
|-- .ai/                    Canonical AI roles, policies, workflows, and templates
|-- .claude/                Claude Code compatibility loader and command imports
|-- .codex/                 Project-scoped Codex configuration and agent profiles
|-- .github/                CI, Dependabot, ownership, and contribution templates
|-- app/                    App Router pages, metadata, sitemap, robots, and errors
|-- components/             Atomic design: atoms, molecules, organisms, templates
|-- content/editions/       Version-controlled event content by year
|-- lib/
|   |-- api/                Typed fetch client and Sessionize boundary
|   |-- config/             Runtime-safe configuration helpers
|   |-- content/            Local content loaders and Zod schemas
|   |-- utils/              Shared rendering and SEO utilities
|   `-- validation/         Reusable trust-boundary validation
|-- tests/                  Vitest unit, integration, component tests, and fixtures
|-- e2e/                    Playwright browser and deployment smoke tests
|-- docs/                   Architecture, AWS, security, testing, status, and ADRs
|-- scripts/                Repository-owned build and deployment helpers
`-- specs/                  Feature requirements, plans, contracts, and task history
```

Start with [`docs/README.md`](docs/README.md) for the complete documentation
map. Current implementation boundaries are described in
[`docs/architecture/CURRENT_ARCHITECTURE.md`](docs/architecture/CURRENT_ARCHITECTURE.md),
and the live audit dashboard is
[`docs/status/PROJECT_STATUS.md`](docs/status/PROJECT_STATUS.md).

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
npm run e2e:production
npm run build
npm run verify
npm run verify:e2e
npm run secretlint
npm run security:audit
npm run security:signatures
npm run sbom
npm run fixtures:sessionize
npm start
```

`npm run e2e` exercises the development server. `npm run e2e:production`
builds and exercises the production server, while `npm run verify:e2e` runs the
complete verification gate first. Set `BASE_URL` and run the deploy-smoke
Playwright spec to check an authorized external preview without starting a
local server.

Refreshing committed Sessionize fixtures requires a deliberate public-network
call and a valid public Sessionize event ID:

```sh
SESSIONIZE_FIXTURE_EVENT_ID=<public-event-id> npm run fixtures:sessionize
```

Review fixture changes before committing them. Tests and default CI never
depend on live Sessionize data.

The host used for this audit did not expose Node.js in `PATH`. The commands above were executed with the repository mounted into `node:24.15.0-bookworm-slim`; Playwright used `mcr.microsoft.com/playwright:v1.59.1-noble`. See `docs/status/BASELINE.md` and `docs/status/PROJECT_STATUS.md` for exact results and environment limitations.

## Content workflow

- Edit local event content under `content/editions/{year}/`.
- Publish speakers, schedule, and CFP changes in Sessionize.
- Keep `eventbriteEventUrl` and `registrationStatus` aligned with the official
  Eventbrite event. Update the content-specific assertions in
  `e2e/register.spec.ts` and `e2e/home.spec.ts` when registration changes.
- Run lint, type checking, tests, and a production build before release.

See [`specs/001-community-day-site/quickstart.md`](specs/001-community-day-site/quickstart.md)
for the complete editorial and new-edition workflow.

## Architecture

React components follow atomic design under `components/`. Pages own data
loading, `lib/content/` validates local content, and `lib/api/` is the only
boundary for external HTTP data. URL and image-host validation is centralized
under `lib/validation/` and `lib/config/`. Error boundaries preserve useful
static event content without hiding contract drift from external data.

Current and target diagrams are under
[`docs/architecture/`](docs/architecture/). System requirements live under
[`docs/specs/`](docs/specs/), while feature-specific delivery history remains
under root [`specs/`](specs/).

## Security and supply chain

- Report vulnerabilities privately as described in [`SECURITY.md`](SECURITY.md).
- `npm run secretlint` scans project source and canonical AI guidance.
- `npm run security:audit` checks the locked dependency graph.
- `npm run security:signatures` verifies registry signatures and attestations.
- CI additionally runs redacted Gitleaks history scanning and retains coverage
  evidence and a CycloneDX SBOM without committing generated output.

Findings, risks, and dependency status are in [`docs/status/`](docs/status/).

## AWS architecture and operations

AWS Amplify Hosting remains the conditional target because the site requires Next.js ISR and image behavior. Production readiness is blocked until Next.js 16 is proven on an isolated Amplify preview and the public domain resolves. The rationale, runbook, IAM/OIDC requirements, monitoring, rollback, and remaining work are documented in [`docs/aws/`](docs/aws/).

No IaC is included because external resource ownership and runtime support are not yet sufficiently clear. This is a deliberate decision, not permission to configure AWS manually without review.

## Multi-agent development

Root [`AGENTS.md`](AGENTS.md) is a minimal loader. Canonical policy, roles, workflows, and templates live under [`.ai/`](.ai/). Claude Code loads `.claude/CLAUDE.md`; Codex uses `.codex/config.toml` and the narrow project agents under `.codex/agents/`. Spec Kit writes mutable plan context only to `.ai/generated/project-context.md`.

Review agents are read-only. Only the implementation worker has workspace
write access. The coordination workflow requires evidence-backed findings,
disjoint ownership for parallel work, and an independent final review before
release readiness is claimed.

Use `docs/status/WORK_ITEMS.md` for completed, pending, blocked, and deferred work. Follow `CONTRIBUTING.md` and the applicable `.ai/workflows/` document for changes and handoffs.

## Troubleshooting

- If formatting fails only in a Windows-mounted Linux container, confirm `.gitattributes` is present and use a fresh checkout; it enforces LF without a repository-wide content rewrite.
- Do not share one `node_modules` directory across Windows and Linux when validating `npm ls`; use a clean platform-specific `npm ci`.
- If speaker or schedule data is empty, verify the edition event ID and Sessionize availability. Static local content should still render.
- If the custom domain fails while the Amplify fallback works, follow `docs/deployment.md` and `docs/aws/AWS_OPERATIONS.md`; do not change DNS without authorized access.
