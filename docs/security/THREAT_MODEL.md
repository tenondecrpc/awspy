# Threat model

## Assets

- Public-site integrity and availability
- Attendee trust in navigation and event information
- Build and deployment supply chain
- DNS and hosting configuration
- Future deployment credentials, which must remain external

## Actors and entrypoints

- Anonymous browsers
- Sessionize as an external data producer
- Repository contributors and pull requests
- npm registry and GitHub Actions dependencies
- AWS Amplify, Route 53, DNS registrar, and authorized operators

## Principal threats

| Threat | Boundary | Control |
| --- | --- | --- |
| Script injection through JSON-LD | Sessionize/content -> HTML | Zod plus safe structured-data serialization |
| Unsafe external link scheme | Content/provider -> browser navigation | Explicit scheme schemas and renderer checks |
| Resource exhaustion by stalled provider | Internet -> server/build | Request timeout and cache-backed graceful fallback |
| Supply-chain substitution | Registry/actions -> CI | Lockfile, integrity, audit, signatures, immutable action SHAs, SBOM |
| Secret disclosure | Contributor/config -> Git/logs | No secret runtime need, Secretlint, Gitleaks, redacted reporting |
| DNS takeover or outage | Registrar/Route 53 -> user | Ownership controls, DNS/TLS monitoring, documented response |
| Hosting/runtime incompatibility | Next.js -> Amplify | Isolated preview qualification and rollback |

## Out of scope today

There is no login, authorization, tenant data, payment handling, database, write API, AWS SDK call, or private customer record. Adding any of these requires a new threat model and architecture decision.
