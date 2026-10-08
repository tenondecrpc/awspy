# Security findings

## Summary

No credential was confirmed, no credential value was printed, and no rotation is currently required. npm audit reports zero vulnerabilities in production dependencies; one high development-only advisory without a patched release is allowlisted under `EX-003` (`SEC-011`). The one history finding in vendored test documentation is a reviewed false positive covered by a precise path allowlist with a review condition.

| ID | Severity | Classification | Status | Evidence and action | Validation or blocker |
| --- | --- | --- | --- | --- | --- |
| SEC-001 | High | CWE-79 | RESOLVED | Central JSON-LD serializer escapes HTML-significant code points | Malicious round-trip and rendered-template tests pass |
| SEC-002 | Medium | CWE-20 | RESOLVED | Explicit HTTP/HTTPS policies protect content, provider, image, site-origin, and Markdown boundaries | Allowed and rejected scheme tests plus fixtures pass |
| SEC-003 | Medium | CWE-400 | RESOLVED | External fetch duration and response size are bounded while caller cancellation remains intact | Timeout, signal, size, success, and tolerant-fallback tests pass |
| SEC-004 | Medium | Supply chain | RESOLVED | GitHub Actions are pinned to verified immutable SHAs | actionlint and hosted run `32654046044` pass |
| SEC-005 | Low | Defense in depth | RESOLVED | Sniffing, frame, referrer, capability, and powered-by controls are configured | Production E2E verifies headers in both projects |
| SEC-006 | Low | Secret detection | RESOLVED | Project AI guidance is scanned; vendored skills and reproducible artifacts have precise, review-conditioned exclusions | Secretlint plus redacted Gitleaks history and 1.20 MB source-tree scans pass |
| SEC-007 | Low | Configuration | RESOLVED | Sessionize base URL requires HTTPS except explicit loopback development addresses and rejects credentials | Environment-policy tests pass |
| SEC-008 | Informational | AWS IAM | BLOCKED | External roles, policies, encryption, logging, and console settings are outside repository evidence | BLK-003 |
| SEC-009 | Medium | CWE-200 | RESOLVED | Shared web URL policies reject embedded credentials across navigation, images, Markdown, content, and provider links | Credential and fixture tests pass |
| SEC-010 | Low | CWE-532 | DEFERRED | Generic `ApiError.body` retains a bounded provider response; no current production consumer logs it | Compatible error-contract decision and tests required before removal |
| SEC-011 | High | CWE-674, supply chain | ACCEPTED | `GHSA-vfj7-8cjw-p6xm` in `braces` `<=3.0.3`, reached only through `eslint-config-next` at lint time; no patched release exists. `scripts/audit-check.ts` allowlists it while it stays out of production dependencies and until 2026-11-04 (`EX-003`) | `npm audit --omit=dev` reports zero findings; `npm run security:audit` passes with the notice and fails on any other high or critical advisory |
| SEC-012 | High | CWE-918, CWE-400, supply chain | RESOLVED | `GHSA-cjq9-62q9-8jv4` (`next` 16.0.0 - 16.3.7, SSRF in image optimization), `GHSA-wq5f-xc86-pv6w` (`sharp` `<0.35.5`, librsvg CVE-2026-96889) and `GHSA-68fv-2mgg-jv7q` (`source-map-js` 1.0.0 - 1.2.1, event-loop denial of service) reached production dependencies; patched to `next` 16.3.8, `sharp` 0.35.5 and `source-map-js` 1.2.2 | `npm audit --omit=dev` reports zero findings; `npm run security:audit` passes with only the `EX-003` notice |

## Entity and schema review

Edition metadata, venue, organizer, sponsor, FAQ, Sessionize speaker, session and grid schemas, API errors, URL boundaries, and Markdown tokens were reviewed for construction invariants, unknown fields, mutation, serialization, identifiers, optional values, timestamps, concurrency, and sensitive output. There are no authentication entities, tenant models, mutable domain classes, repositories, controllers, database models, AWS SDK clients, or subprocess entrypoints. Zod boundary models prevent untrusted transport payloads from becoming implicit internal objects. Remaining product-level logic proposals are isolated in `LOGIC_IMPROVEMENTS.md`.
