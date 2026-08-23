# Repository Baseline

## Snapshot

- Captured on: 2026-08-23 in the `America/Asuncion` time zone
- Repository root: `C:/Users/Usuario/Documents/git/awspy`
- Expected and verified remote: `https://github.com/tenondecrpc/awspy.git`
- Baseline branch: `main`
- Working branch: `refactor/security-sdlc-aws-multi-agent`
- Baseline commit: `1043a48c39e7db8fab1916f30119b43cb8165014`
- Baseline working tree: clean, with no untracked files
- Tags: none
- Recent release indicator: Conventional Commit history, with no Git tag or release manifest

## Environment

- Host: Windows with PowerShell and Git 2.55.0.windows.4
- Codex CLI: 0.149.0
- Codex native multi-agent feature: stable and enabled
- Host Node.js and npm: not available in `PATH`
- Isolated validation runtime: `node:24.15.0-bookworm-slim`
- Isolated browser runtime: `mcr.microsoft.com/playwright:v1.59.1-noble`
- Docker Engine: 29.7.2
- Package manager: npm with lockfile version 3 and `engine-strict=true`
- Required runtime: Node.js 24.15.0 or a compatible 24.x release below 25
- Missing host prerequisite: a native Node.js 24.15.0 installation

Docker Desktop was initially stopped. It was started to run the requested isolated baseline without installing a global runtime. Docker resumed pre-existing unrelated containers; no commands were issued against those containers.

## Detected Stack

- Next.js 16.3.2 App Router with React Server Components
- React and React DOM 19.2.4
- TypeScript 5.9.3 in strict mode
- Tailwind CSS 4.2.4
- Zod 4.4.3 at local-content and Sessionize boundaries
- Native `fetch` through `lib/api/client.ts`
- Vitest 4.1.11 with jsdom and React Testing Library
- Playwright 1.59.1 for desktop and mobile Chromium
- ESLint 9.39.4 with Next.js rules
- Prettier 3.9.6
- Secretlint 13.0.4
- AWS Amplify Hosting build configuration
- Version-controlled JSON and MDX content under `content/editions/`
- Public Sessionize API integration with static empty-state fallback
- No application backend, database, AWS SDK, container definition, or infrastructure-as-code project

## Initial Repository Structure

- `app/`: routes, layouts, metadata routes, and page-owned data loading
- `components/`: atoms, molecules, organisms, and page templates
- `lib/api/`: typed HTTP client, errors, Sessionize schemas, and resource functions
- `lib/content/`: file-backed content validation and MDX loading
- `content/editions/2026/`: current edition data
- `tests/`: 36 Vitest files with 270 tests
- `e2e/`: 8 Playwright specifications with 82 project-expanded tests
- `specs/`: feature specifications and implementation history
- `docs/`: architecture, CI, deployment, decisions, and documented exceptions
- `.github/`: CI, Dependabot, and pull request template
- `.agents/`: repository-vendored agent skills
- `.claude/`: Claude settings and Spec Kit commands

## Baseline Commands

Commands were run from the repository root. Node commands used the exact isolated runtime shown below because Node.js was unavailable on the host.

| Check | Command | Result | Classification |
| --- | --- | --- | --- |
| Repository root | `git rev-parse --show-toplevel` | PASS | Repository evidence |
| Branch | `git branch --show-current` | PASS | Repository evidence |
| Commit | `git rev-parse HEAD` | PASS | Repository evidence |
| Remotes | `git remote get-url origin` with credential-safe display | PASS | Remote matches expected URL |
| Dependency install | `docker run --rm -v <repo>:/workspace -w /workspace node:24.15.0-bookworm-slim npm ci` | PASS | 644 packages installed |
| Format | same container plus `npm run format:check` | FAIL | Pre-existing cross-platform line-ending defect affecting 165 files |
| Lint | same container plus `npm run lint` | PASS | No findings |
| Type check | same container plus `npm run typecheck` | PASS | No findings |
| Unit and component tests | same container plus `npm test` | PASS | 36 files and 270 tests passed in isolated rerun |
| Concurrent test probe | same container plus `npm test`, while other checks ran | FAIL | Environment contention caused four Vitest worker startup timeouts; isolated rerun passed |
| Coverage | same container plus `npm test -- --coverage` | FAIL | Missing `@vitest/coverage-v8`; coverage is not configured |
| Secretlint | same container plus `npm run secretlint` | PASS | No findings |
| npm audit | same container plus `npm audit --audit-level=low` | PASS | 0 vulnerabilities reported |
| Dependency tree | same container plus `npm ls --all` | FAIL | Cross-platform optional packages were reported as extraneous or invalid after a Linux install on a Windows-mounted workspace |
| Build | same container plus `npm run build` | PASS | 27 static or SSG routes generated |
| End-to-end tests | `docker run --rm --ipc=host -e CI=1 -v <repo>:/workspace -w /workspace mcr.microsoft.com/playwright:v1.59.1-noble npm run e2e -- --reporter=line` | PASS | 82 tests passed in 1.1 minutes |
| Application smoke test | Playwright `deploy-smoke.spec.ts` in both configured projects | PASS | Public routes, sitemap, and Open Graph image reachable |
| GitHub Actions syntax | `rhysd/actionlint:1.7.7` against `.github/workflows/ci.yml` | PASS | No findings |
| Gitleaks working tree | `gitleaks dir /workspace --redact --no-banner` | FAIL | 7 findings included generated dependencies and require scoped triage |
| Gitleaks history | `gitleaks git /workspace --redact=100 --no-banner --verbose` | FAIL | One test token example in a vendored Playwright skill; no confirmed credential |
| Packaging | Not run | NOT APPLICABLE | No package publication contract or packaging script |
| Container build | Not run | NOT APPLICABLE | No Dockerfile or container deployment contract |
| IaC validation | Not run | NOT APPLICABLE | No infrastructure-as-code configuration exists |

## Pre-existing Failures and Limitations

1. Formatting is not portable across the current Windows checkout because Git uses `core.autocrlf=true` while the repository requires LF and has no `.gitattributes` policy. The clean baseline commit fails its own format check in the Linux CI-equivalent runtime.
2. Coverage cannot be measured because the configured test stack does not declare a Vitest coverage provider or a coverage script.
3. The full dependency tree check reports optional native-package inconsistencies when Linux `node_modules` is stored on the Windows-mounted workspace. This does not affect `npm ci`, lint, tests, or build.
4. A parallel baseline probe exhausted Vitest worker startup time on the Docker Desktop bind mount. The repository test command passes when run independently, so this is recorded as environment contention rather than a test defect.
5. Host-native Node.js is unavailable. Docker is required for validation in this environment unless Node.js 24.15.0 is installed externally.
6. The initial Playwright run updates tracked `test-results/.last-run.json`, demonstrating that a generated test artifact is currently version-controlled.
7. Coverage, SBOM generation, static application security testing, and IaC or container scanning are absent from the repository-owned verification contract.

## Initial Security Findings

- npm audit: no known vulnerabilities reported for the locked dependency graph.
- Secretlint: no current working-tree findings.
- Gitleaks history: one generic API-key pattern in `.agents/skills/playwright-best-practices/advanced/authentication-flows.md` at approximately line 54. The value is test documentation and was fully redacted during review. It is not a confirmed credential and should be rewritten or precisely excluded to keep history-aware scans actionable.
- GitHub Actions use least-privilege `contents: read`, but third-party actions are referenced by mutable major tags instead of immutable commit SHAs.
- No AWS access keys, deployment credentials, backend secrets, database connections, or AWS SDK clients were identified during initial inventory.

## Missing Prerequisites

- Vitest coverage provider and a repository-owned coverage command
- A portable LF enforcement policy
- SBOM generation tooling and CI integration
- Repository-owned history-aware secret scanning
- A documented deployment decision and infrastructure boundary
- A local Node.js runtime, if Docker-based development is not acceptable

This baseline records only executed evidence. Dependency currency, transitive license status, broader security findings, and architecture recommendations remain subject to the specialized audit.
