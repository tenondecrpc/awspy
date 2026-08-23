# Risk register

| ID | Risk | Likelihood | Impact | Mitigation | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- |
| RISK-001 | Amplify may not fully support Next.js 16 runtime features | Medium | High | Isolated preview validation and documented OpenNext contingency | AWS owner | OPEN |
| RISK-002 | Public DNS remains unavailable | High | High | Registrar and Route 53 investigation under authorized access | AWS owner | OPEN |
| RISK-003 | Sessionize outage during generation can publish incomplete dynamic routes | Medium | Medium | Keep static content resilient; evaluate stale-last-known-good route strategy | Product and engineering | OPEN |
| RISK-004 | Broad dependency updates could introduce visual or runtime drift | Medium | Medium | Updates are deferred into coherent groups with full E2E | Maintainer | MITIGATED |
| RISK-005 | Hosted CI behavior was not observed before the first pull request | Low | Medium | Immutable pins, actionlint, local evidence, and pull request 10 validation | DevSecOps | MITIGATED |
| RISK-006 | Custom-domain and provider-console configuration are not represented as code | Medium | Medium | Runbook and authorized evidence review; defer IaC until ownership is clear | AWS owner | ACCEPTED |
| RISK-007 | Expected 404 tests emit an internal Next.js `NoFallbackError` log | Medium | Low | Track framework behavior and reproduce after future Next.js patches | Maintainer | OPEN |
| RISK-008 | A future private API consumer could expose retained `ApiError.body` data through logging | Low | Medium | Keep current integrations public; define a sanitized compatible contract before expansion | Security owner | OPEN |
| RISK-009 | Windows line-ending normalization left the checkout visually dirty despite identical normalized hashes | Medium | Low | Normalize the four remaining fixture blobs and verify all Git status surfaces | Maintainer | MITIGATED |
