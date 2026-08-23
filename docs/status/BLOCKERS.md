# Blockers

## BLK-001 - Public domain is unavailable

- Type: Infrastructure blocker
- Status: OPEN
- Blocks: AWS-001 and production release readiness
- Evidence: Public apex and `www` returned NXDOMAIN on 2026-08-23; the Amplify fallback domain remained reachable.
- Required external action: The authorized domain and AWS owner must inspect registrar status, nameserver delegation, and Route 53 records.
- Exit criteria: Multi-resolver DNS, TLS, redirect, and browser checks pass.

## BLK-002 - Hosting support for Next.js 16 is unproven

- Type: External-service blocker
- Status: OPEN
- Blocks: AWS-002 and production release readiness
- Evidence: The repository uses Next.js 16.3.2 while reviewed Amplify documentation lists support through Next.js 15.
- Required external action: Run an isolated Amplify preview with authorized AWS access or obtain AWS support confirmation.
- Exit criteria: Critical routing, ISR, image, environment, observability, and rollback checks pass.

## BLK-003 - AWS account configuration is not locally reviewable

- Type: Credential blocker
- Status: OPEN
- Blocks: AWS-004 and completion of the external IAM, encryption, logging, retention, and domain-control review
- Evidence: No AWS credentials, exported configuration, or IaC are present in repository scope.
- Required external action: An authorized owner must perform the read-only checklist in `docs/aws/AWS_OPERATIONS.md`; no credentials should be shared through the repository.
- Exit criteria: Evidence records least privilege, OIDC deployment, encryption, logging, retention, alarms, tags, account, and region safeguards.

## BLK-004 - Hosted CI has not executed the new workflow

- Type: External-service blocker
- Status: RESOLVED on 2026-08-23
- Previously blocked: full validation of CI-001, CI-002, and SEC-004
- Resolution evidence: Pull request 10 run `32654046044` passed `verify` in 2m56s and `e2e` in 2m47s, retaining coverage and SBOM evidence.
- Exit criteria: Met.

## BLK-005 - Current Windows checkout reports content-identical modifications

- Type: Environment blocker
- Status: RESOLVED on 2026-08-23
- Previously blocked: OPS-004 only
- Resolution evidence: Index renormalization cleared 125 stale stat entries and exposed four Sessionize fixtures requiring CRLF-to-LF blob normalization. Commit `d95b0f1` contains only verified carriage-return differences. Final status, content diff, staged diff, and untracked counts are zero.
- Exit criteria: Met.

## Non-blocking limitations

- Host Node.js and npm are unavailable; local validation uses the exact Node 24.15.0 container.
- Lighthouse, external TLS, Amplify runtime behavior, and full dependency legal and maintainer-health review are `NOT VERIFIED`.
- Docker Desktop was started for validation and resumed unrelated pre-existing containers; they were not modified or stopped.
