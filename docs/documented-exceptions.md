# Documented exceptions

Approved deviations from `AGENTS.md` and identified gaps. An exception is valid
only when its scope, reason, mitigation, approval, and retirement condition are
recorded. A gap documents a problem but does not approve it for indefinite use.

## Format

```markdown
## EX-NNN - Short title

- Rule:
- Scope:
- Reason:
- Mitigation:
- Approved by:
- Revisit:
```

## EX-001 - Open Graph renderer uses color literals

- **Rule**: Styling colors must use semantic tokens from `app/globals.css`.
- **Scope**: Inline styles in `app/opengraph-image.tsx` only.
- **Reason**: The Satori renderer used by `ImageResponse` generates a PNG and
  cannot resolve CSS custom properties from the application stylesheet.
- **Mitigation**: The literals are documented beside their matching semantic
  tokens. ESLint suppresses the rule only in this file, and the palette boundary
  test rejects literals elsewhere.
- **Approved by**: Repository implementation baseline, 2026-05-24.
- **Revisit**: When the Open Graph renderer can consume the shared token source
  without duplicating literal values.

## EX-002 - Secretlint pinned to the Node 20 compatible release

- **Rule**: Security tooling should stay on a supported current release.
- **Scope**: `secretlint` and
  `@secretlint/secretlint-rule-preset-recommend`, pinned to `12.0.0`.
- **Reason**: Secretlint releases after `12.0.0` require Node.js 22, while this
  project and the Amplify build currently target Node.js 20.
- **Mitigation**: The scanner is a development-only dependency, runs during
  every `npm run verify`, and remains enabled in CI and Amplify.
- **Approved by**: Repository owner through the template-practices adoption,
  2026-08-21.
- **Revisit**: Upgrade Secretlint when the project and Amplify move to Node.js
  22 or newer.

## GAP-001 - Dependency audit reports high-severity findings

- **Status**: Open.
- **Scope**: The dependency graph reported by `npm audit` on 2026-08-21,
  including the direct Next.js `16.2.5` dependency and transitive development
  dependencies.
- **Impact**: The audit reports one low and seven high-severity findings. The
  recommended Next.js remediation is a framework upgrade, which requires its
  own migration and regression verification rather than an unreviewed
  `npm audit fix --force`.
- **Mitigation**: Dependabot is enabled, the application has no authentication
  or persistent backend, and framework-specific privileged middleware is not
  used. These constraints reduce exposure but do not close the findings.
- **Resolution**: Run the repository's Next.js upgrade workflow, update affected
  transitive tooling, execute `npm run verify:e2e`, and remove this gap only
  after `npm audit` is reviewed again.
- **Revisit**: Before announcing the production domain publicly.
