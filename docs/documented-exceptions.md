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
  tokens. The image-only red uses a darker AA-safe variant for its white label.
  ESLint suppresses the rule only in this file, and the palette boundary test
  rejects literals elsewhere.
- **Approved by**: Repository implementation baseline, 2026-05-24.
- **Revisit**: When the Open Graph renderer can consume the shared token source
  without duplicating literal values.

## Resolved records

Resolved records remain here for traceability but no longer authorize an
exception or describe an open deployment gap.

### EX-002 - Secretlint pinned to the Node 20 compatible release

- **Status**: Resolved on 2026-08-21.
- **Former scope**: `secretlint` and
  `@secretlint/secretlint-rule-preset-recommend` were pinned to `12.0.0` while
  the project targeted Node.js 20.
- **Resolution**: The project and Amplify build moved to Node.js 24.15.0,
  allowing both packages to upgrade to `13.0.4`.

### GAP-001 - Dependency audit reports high-severity findings

- **Status**: Resolved on 2026-08-21.
- **Former scope**: The dependency graph contained one low and seven
  high-severity findings, including Next.js `16.2.5` and transitive development
  dependencies.
- **Resolution**: Upgraded Node.js to 24, Next.js and its aligned packages to
  `16.3.2`, Secretlint to `13.0.4`, Vitest to `4.1.11`, jsdom to `30.0.1`, and
  refreshed safe transitive versions with `npm audit fix` without `--force`.
- **Verification**: `npm audit` reports zero vulnerabilities. The repository
  verification and Playwright results are recorded with the completing change.
- **Follow-up (2026-09-09)**: Patched Next.js and its aligned ESLint package to
  `16.3.4`, `sharp` to `0.35.4`, and `js-yaml` to `4.3.2` after new advisories;
  `npm audit --audit-level=high` and registry-signature verification pass.
