# Dependency inventory

Verified on 2026-09-09 and updated on 2026-09-29 (DEP-103) with npm registry data, the lockfile, `npm audit`, and `npm audit signatures`. Maintenance health and legal compatibility are `NOT VERIFIED` unless stated otherwise. The lockfile resolves only through `https://registry.npmjs.org/`; no Git, file, alternate-registry, plaintext HTTP, AWS SDK, container, system-package, or IaC dependency is present.

## Direct production dependencies

| Dependency | Ecosystem and scope | Current | Constraint | Purpose | Latest compatible verified | Vulnerability | Maintenance | License | Action | Recommendation | Blocker | Task |
| --- | --- | ---: | ---: | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| `next` | npm direct | 16.3.7 | 16.3.7 | App Router runtime | 16.3.7 | None reported | Active | MIT | Patched | Keep exact; validate hosting | BLK-002 | AWS-002 |
| `react`, `react-dom` | npm direct | 19.2.8 | 19.2.8 | UI runtime | 19.2.8 in 19.2 | None reported | Active | MIT | Patched | Update together; minor 19.3 deferred | None | DEP-103 |
| `zod` | npm direct | 4.4.3 | ^4.4.3 | Boundary validation | 4.4.3 | None reported | Active | MIT | Retained | Keep | None | SEC-002 |

## Direct development dependencies

| Dependency group | Ecosystem and scope | Current | Constraint | Purpose | Latest compatible verified | Vulnerability | Maintenance | License | Action | Recommendation | Blocker | Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Vitest and V8 coverage | npm direct | 4.1.11 | exact | Unit, component, and coverage | 4.1.11 | None reported | Active | MIT | Coverage provider added | Keep versions aligned | None | TEST-001 |
| Playwright | npm direct | 1.59.1 | ^1.59.1 | Browser tests | 1.62.1 | None reported | Active | Apache-2.0 | Retained | Update with browser image in one group | None | DEP-102 |
| Tailwind pair | npm direct | 4.2.4 | ^4 | Styling | 4.3.3 | None reported | Active | MIT | Retained | Update together after visual validation | None | DEP-102 |
| ESLint stack | npm direct | 9.39.5 / 16.3.7 | ^9.39.5 / 16.3.7 | Static analysis and Next.js rules | 9.39.5 / 16.3.7 | None reported | Active | MIT | Patched | Keep Next.js pair aligned; defer ESLint major 10 | None | DEP-102 |
| TypeScript | npm direct | 5.9.3 | ^5 | Static typing | 5.9.3 in declared major | None reported | Active | Apache-2.0 | Retained | Defer major 7 migration | None | DEP-102 |
| Secretlint stack | npm direct | 13.0.6 | exact | Secret scanning | 13.0.6 | None reported | Active | MIT | Patched | Keep precise exclusions | None | SEC-006 |
| Testing Library stack | npm direct | 6.9.1/16.3.3/14.6.7 | mixed | Component testing | 16.3.3/14.6.7; jest-dom major 7 deferred | None reported | Active | MIT | Patched | Update in an isolated test-only group | None | DEP-102 |
| Node types | npm direct | 24.13.6 | exact | Node 24 types | 24.13.6; 24.x retained | None reported | Active | MIT | Patched | Stay aligned to runtime major | None | DEP-102 |
| Vite React plugin | npm direct | 6.0.5 | ^6.0.5 | Vitest transform | 6.0.5; minor 6.1 deferred | None reported | Active | MIT | Patched | Update in an isolated group | None | DEP-102 |
| Prettier and jsdom | npm direct | 3.9.9/30.0.1 | exact | Formatting and test DOM | Current in audit | None reported | Active | MIT | Retained | Keep | None | DEP-102 |

## Removed dependencies

| Dependency | Previous purpose | Action | Evidence | Task |
| --- | --- | --- | --- | --- |
| `@tanstack/react-query` | Unused client server-state scaffold | Removed | No query or mutation consumers; E2E and build pass without provider | DEP-101 |
| `zustand` | Unused ephemeral-state scaffold | Removed | No store consumers; tests and build pass | DEP-101 |
| `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` | Inactive MDX compiler path | Removed | Restricted renderer was already the active code path; parser tests pass | DEP-101 |

## Transitive and toolchain state

- Locked package nodes: 646 excluding the root, reduced from 747.
- Final clean installation target: 544 packages audited, reduced from 645 at baseline.
- npm audit: zero vulnerabilities in production and development graphs.
- Provenance: 546 verified registry signatures and 146 verified attestations (2026-09-30).
- Security patches: `next` and `eslint-config-next` 16.3.4, transitive `sharp` 0.35.4, transitive `js-yaml` 4.3.2, transitive `undici` 8.11.2 (eleven high-severity advisories on 8.0.0 - 8.10.1, reached through `jsdom`), and transitive `brace-expansion` 1.1.21 and 5.0.12 (three high-severity denial-of-service advisories, GHSA-q2hr-2g5m-vwhr, GHSA-qhr7-859c-m2p7 and GHSA-6j4f-fj2g-mc7p, reached through `minimatch` under ESLint and `typescript-eslint`; dev-only).
- CycloneDX SBOM generation: passed; generated artifact size was 631,811 bytes and was not committed.
- Deprecated packages: none marked during the audit.
- License metadata exists in the lock graph, but full legal compatibility is `NOT VERIFIED`.
- Duplicate versions remain where upstream ranges are incompatible. No unsafe forced override was added.
- `postcss: ^8.5.26` remains as a global override because its retirement compatibility is `NOT VERIFIED`.
- Patch releases within each locked minor were applied on 2026-09-29 (DEP-103). Minor and major updates remain deferred under DEP-102 to avoid an unreviewable batch upgrade, and Dependabot version updates are limited to patches. `@paper-design/shaders-react` stays at 0.0.80: in a 0.0.x line every release may change behavior, and it draws the Kiro mascot.
