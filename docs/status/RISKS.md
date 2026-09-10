# Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| RISK-001 | Amplify does not officially support Next.js 16, and production ISR retained obsolete Sessionize data | High | High | Bypass persistent caching for Sessionize reads; validate Next.js 15 downgrade or documented OpenNext contingency | AWS owner | OPEN |
| RISK-002 | Public DNS remains unavailable | High | High | Registrar and Route 53 investigation under authorized access | AWS owner | OPEN |
| RISK-003 | A Sessionize outage during a dynamic request can show an empty provider section | Medium | Medium | Keep repository content resilient and retain tolerant empty states; evaluate a platform-supported stale-last-known-good strategy | Product and engineering | OPEN |
| RISK-004 | Broad dependency updates could introduce visual or runtime drift | Medium | Medium | Updates are deferred into coherent groups with full E2E | Maintainer | MITIGATED |
| RISK-005 | Hosted CI behavior was not observed before the first pull request | Low | Medium | Immutable pins, actionlint, local evidence, and pull request 10 validation | DevSecOps | MITIGATED |
| RISK-006 | Custom-domain and provider-console configuration are not represented as code | Medium | Medium | Runbook and authorized evidence review; defer IaC until ownership is clear | AWS owner | ACCEPTED |
| RISK-007 | Expected 404 tests emit an internal Next.js `NoFallbackError` log | Medium | Low | Track framework behavior and reproduce after future Next.js patches | Maintainer | OPEN |
| RISK-008 | A future private API consumer could expose retained `ApiError.body` data through logging | Low | Medium | Keep current integrations public; define a sanitized compatible contract before expansion | Security owner | OPEN |
| RISK-009 | Windows line-ending normalization left the checkout visually dirty despite identical normalized hashes | Medium | Low | Normalize the four remaining fixture blobs and verify all Git status surfaces | Maintainer | MITIGATED |
