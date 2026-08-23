# AWS operations

## Build and release

Amplify installs Node.js 24.15.0, performs `npm ci`, persists only allowlisted public build variables, and calls `npm run verify`. Releases require the separate Playwright gate before approval. The build output is `.next/`.

## Required environment values

- `CURRENT_EDITION`
- `NEXT_PUBLIC_SITE_URL`
- optional `NEXT_PUBLIC_SESSIONIZE_BASE_URL`

These are public configuration, not secrets. The build must not copy the full environment into artifacts.

## Observability

Use Amplify/CloudWatch metrics and logs for request errors, latency, build/deploy failures, and compute health. Add external synthetic checks for apex, `www`, fallback host, TLS, redirects, home, schedule, speakers, and registration state. Alarms need an owner, severity, runbook link, and tested notification path.

## Incident priorities

1. Confirm DNS and TLS from independent resolvers.
2. Compare the custom domain with the Amplify fallback.
3. Check the latest deployment, build logs, and environment allowlist.
4. Roll back to the last known-good commit if the deployment caused the issue.
5. If only Sessionize fails, verify local content and empty states remain available; do not repeatedly purge caches.

## Security and access

Prefer SSO/federated access for humans, IAM roles for workloads, GitHub OIDC for future automation, MFA for privileged users, and CloudTrail for control-plane audit. Review wildcard policies, trust relationships, encryption, log retention, and account/region safeguards under authorized access.

## Disaster recovery

The Git repository is the recoverable application source. Export or document external DNS and Amplify configuration, define owners, and periodically prove a preview build and rollback. No persistent application data requires backup today.
