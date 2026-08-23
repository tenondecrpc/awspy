# Completed work

The following items met their local acceptance criteria against baseline `1043a48c39e7db8fab1916f30119b43cb8165014`.

| ID | Outcome | Implementation commit | Validation evidence |
| --- | --- | --- | --- |
| AI-001 | Canonical AI guidance and eight project-scoped Codex roles | `95678ab` | Codex 0.149.0 support, TOML parse, stable root hashes after `next dev` |
| AI-002 | Spec Kit writes only generated canonical context | `95678ab` | Bash execution updates generated context while root hashes remain stable |
| SEC-001 | Safe JSON-LD serialization | `ab043db` | Malicious payload and rendered sink tests |
| SEC-002 | Explicit outbound URL policy | `ab043db` | Boundary and fixture tests |
| SEC-003 | Fetch timeout and response-size bounds | `ab043db` | Strict and tolerant failure tests |
| SEC-005 | Baseline browser headers | `ab043db` | Production E2E header checks |
| SEC-006 | Narrow secret-scan exclusions | `ab043db`, `ecc5771` | Secretlint plus redacted Gitleaks history and source-tree scans |
| LOGIC-001 | LF and CRLF frontmatter parsing | `ab043db` | Parser regression tests |
| LOGIC-002 | Edition-scoped archived links | `ab043db` | Home-template and production E2E tests |
| LOGIC-004 | No fabricated speaker detail links | `ab043db` | Matched and unmatched speaker tests |
| LOGIC-005 | Session time-order invariant | `ab043db` | Ordered, reversed, and optional timestamp tests |
| LOGIC-008 | Speaker detail routes in sitemap | `ab043db`, `05c70f0` | Five tolerant current, archived, and fallback sitemap tests |
| TEST-001 | Coverage provider and ratchet | `ab043db` | 69.05/70.55/64.25/70.05 percent coverage |
| PERF-001 | Removed unused client provider and packages | `ab043db` | Build and E2E pass; JavaScript chunks reduced 24,257 bytes |
| AWS-003 | Safe Amplify public-variable persistence | `ab043db` | Allowlist, newline, exclusion, and build tests |
| DEP-101 | Removed six inactive dependency packages/groups | `ab043db` | Clean install graph, tests, build, audit, signatures, and SBOM |
| SEC-009 | Rejected credentials in all shared URL policies | `05c70f0` | URL and consumer tests |
| ARCH-101 | Aligned image schemas with Next Image hosts | `05c70f0` | Host, local-path, content, fixture, type, and lint tests |
| DOC-002 | Reconciled implementation, specifications, and evidence | `05c70f0` | Targeted contradiction search and independent re-review |
| TEST-003 | Added caller cancellation and sitemap fallback coverage | `05c70f0` | Targeted API and sitemap tests |
| AI-003 | Standardized review-agent finding contracts | `05c70f0` | Every read-only role references the canonical template |
| CI-003 | Documented the pinned Gitleaks version | `05c70f0` | actionlint and exact Gitleaks command |
| DOC-001 | Established durable architecture, security, testing, AWS, SDD, status, and contributor records | `bfe2094`, `05c70f0` | Independent review and cross-document reconciliation |
| LOGIC-013 | Preserved credential-specific URL configuration errors | `3a88154` | Targeted tests and the full 325-test suite |
| DOC-003 | Reconciled final validation evidence | N/A (tracking-only) | Cross-register search and final verification evidence |
| LOGIC-014 | Preserved URL validation error precedence | `1add156`, `c332ccb` | 60 targeted tests, 325-test full suite, Secretlint, build, and 84 E2E tests |
| DOC-004 | Refreshed sitemap validation evidence | N/A (tracking-only) | Work and completion registers cite five tests and `05c70f0` |
| SEC-004 | Pinned GitHub Actions to immutable SHAs | `2b26a27` | actionlint and hosted run `32654046044` |
| CI-001 | Added hosted quality, security, provenance, and SBOM gates | `2b26a27` | `verify` passed in 2m56s with retained evidence |
| CI-002 | Added hosted production browser validation | `05c70f0` | `e2e` passed in 2m47s with 84 tests |

Blocked and deferred items remain in `WORK_ITEMS.md`.
