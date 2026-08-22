# Continuous integration

Verification rules live in npm scripts rather than provider-specific YAML.
Both contributors and automation run the same command:

```sh
npm ci
npm run verify
```

Node.js 24 is the repository runtime. `.nvmrc`, `package.json`, GitHub Actions,
and `amplify.yml` must remain aligned on that major version.

`npm run verify` executes, in order:

1. `npm run format:check`
2. `npm run lint`
3. `npm run typecheck`
4. `npm test`
5. `npm run secretlint`
6. `npm run build`

Playwright is intentionally separate because it starts a browser and local
server:

```sh
npm run e2e
```

Use `npm run verify:e2e` for the complete local release gate.

## GitHub Actions

`.github/workflows/ci.yml` runs `npm run verify` for pull requests and pushes to
`main`. It uses read-only repository permissions, npm caching, and concurrency
cancellation so a newer commit replaces an obsolete in-progress run.

The workflow does not receive AWS credentials and cannot deploy. Pull request
code is executed with the normal `pull_request` event, not
`pull_request_target`.

Dependabot checks npm packages and GitHub Actions weekly. Development dependency
updates are grouped to limit pull request noise.

## AWS Amplify

`amplify.yml` calls `npm run verify`. The repository, not the Amplify console,
owns the quality gate. Changing the verification contract therefore requires a
`package.json` change and does not require duplicating commands in CI settings.

Amplify is the deployment system. GitHub Actions is the verification system.
Do not add AWS credentials or deployment commands to the CI workflow unless a
future ADR replaces this boundary.

## Dependency audit

Run `npm audit` when dependencies change. Dependabot provides ongoing update
proposals, but audit findings still require review because automatic fixes can
include framework upgrades or breaking dependency changes.

Known findings and temporary pins belong in
`docs/documented-exceptions.md`.

The security remediation completed on 2026-08-21 established a clean baseline
of zero findings from `npm audit`. New findings must be fixed or recorded as an
explicit gap before deployment.

## Secret scan scope

Secretlint scans the application, tests, configuration, and project
documentation. `.secretlintignore` excludes generated output and vendored agent
tooling (`.agents/`, `.claude/`, and `.codex/`) because those directories are
not shipped as part of the site and may contain illustrative credential-shaped
examples. Do not add product source paths to that exclusion list.
