# Dependency inventory

Verified on 2026-08-23 with npm registry data, the lockfile, `npm audit`, and `npm audit signatures`. Maintenance health and legal compatibility are `NOT VERIFIED` unless stated otherwise. The lockfile resolves only through `https://registry.npmjs.org/`; no Git, file, alternate-registry, plaintext HTTP, AWS SDK, container, system-package, or IaC dependency is present.

## Direct production dependencies

| Dependency | Ecosystem and scope | Current | Constraint | Purpose | Latest compatible verified | Vulnerability | Maintenance | License | Action | Recommendation | Blocker | Task |
| --- | --- | ---: | ---: | --- | ---: | --- | --- | --- | --- | --- | --- | --- |
| `next` | npm direct | 16.3.2 | 16.3.2 | App Router runtime | 16.3.2 | None reported | Active | MIT | Retained | Keep exact; validate hosting | BLK-002 | AWS-002 |
| `react`, `react-dom` | npm direct | 19.2.4 | 19.2.4 | UI runtime | 19.2.8 | None reported | Active | MIT | Retained | Update together in a dedicated group | None | DEP-102 |
| `zod` | npm direct | 4.4.3 | ^4.4.3 | Boundary validation | 4.4.3 | None reported | Active | MIT | Retained | Keep | None | SEC-002 |

## Direct development dependencies

| Dependency group | Ecosystem and scope | Current | Constraint | Purpose | Latest compatible verified | Vulnerability | Maintenance | License | Action | Recommendation | Blocker | Task |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Vitest and V8 coverage | npm direct | 4.1.11 | exact | Unit, component, and coverage | 4.1.11 | None reported | Active | MIT | Coverage provider added | Keep versions aligned | None | TEST-001 |
| Playwright | npm direct | 1.59.1 | ^1.59.1 | Browser tests | 1.62.1 | None reported | Active | Apache-2.0 | Retained | Update with browser image in one group | None | DEP-102 |
| Tailwind pair | npm direct | 4.2.4 | ^4 | Styling | 4.3.3 | None reported | Active | MIT | Retained | Update together after visual validation | None | DEP-102 |
| ESLint stack | npm direct | 9.39.4 | ^9 | Static analysis | 9.39.5 | None reported | Active | MIT | Retained | Patch separately; defer major 10 | None | DEP-102 |
| TypeScript | npm direct | 5.9.3 | ^5 | Static typing | 5.9.3 in declared major | None reported | Active | Apache-2.0 | Retained | Defer major 7 migration | None | DEP-102 |
| Secretlint stack | npm direct | 13.0.4 | exact | Secret scanning | 13.0.4 | None reported | Active | MIT | Retained | Keep precise exclusions | None | SEC-006 |
| Testing Library stack | npm direct | 6.9.1/16.3.2/14.6.1 | mixed | Component testing | user-event 14.6.6 | None reported | Active | MIT | Retained | Update in an isolated test-only group | None | DEP-102 |
| Node types | npm direct | 24.13.3 | exact | Node 24 types | 24.x retained | None reported | Active | MIT | Retained | Stay aligned to runtime major | None | DEP-102 |
| Vite React plugin | npm direct | 6.0.1 | ^6.0.1 | Vitest transform | 6.1.0 | None reported | Active | MIT | Retained | Update in an isolated group | None | DEP-102 |
| Prettier and jsdom | npm direct | 3.9.6/30.0.1 | exact | Formatting and test DOM | Current in audit | None reported | Active | MIT | Retained | Keep | None | DEP-102 |

## Removed dependencies

| Dependency | Previous purpose | Action | Evidence | Task |
| --- | --- | --- | --- | --- |
| `@tanstack/react-query` | Unused client server-state scaffold | Removed | No query or mutation consumers; E2E and build pass without provider | DEP-101 |
| `zustand` | Unused ephemeral-state scaffold | Removed | No store consumers; tests and build pass | DEP-101 |
| `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx` | Inactive MDX compiler path | Removed | Restricted renderer was already the active code path; parser tests pass | DEP-101 |

## Transitive and toolchain state

- Locked package nodes: 647 excluding the root, reduced from 747.
- Final clean installation target: 545 packages audited, reduced from 645 at baseline.
- npm audit: zero vulnerabilities in production and development graphs.
- Provenance: 543 verified registry signatures and 145 verified attestations.
- CycloneDX SBOM generation: passed; generated artifact size was 631,811 bytes and was not committed.
- Deprecated packages: none marked during the audit.
- License metadata exists in the lock graph, but full legal compatibility is `NOT VERIFIED`.
- Duplicate versions remain where upstream ranges are incompatible. No unsafe forced override was added.
- `postcss: ^8.5.26` remains as a global override because its retirement compatibility is `NOT VERIFIED`.
- Available compatible updates are intentionally deferred under DEP-102 to avoid an unreviewable batch upgrade.
