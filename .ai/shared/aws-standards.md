# AWS standards

- Treat this repository as a public Next.js frontend, not a general AWS service.
- Prefer Amplify Hosting while its runtime compatibility is validated; do not provision or deploy from agent work.
- Use IAM roles and GitHub OIDC for future deployment automation. Never use long-lived AWS access keys.
- Keep least privilege, encryption, logging, account and region safeguards, and rollback explicit.
- Persist only an explicit allowlist of non-secret Next.js build variables in Amplify artifacts.
- Do not add IaC until ownership and production requirements are sufficiently clear; record the choice in an ADR.
- Use CloudWatch/Amplify metrics and alarms for availability, latency, errors, and deployment health.
- Validate AWS assumptions against current official documentation and record external blockers without guessing console state.
