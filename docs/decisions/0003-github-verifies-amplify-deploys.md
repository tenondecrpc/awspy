# 0003 - GitHub verifies and Amplify deploys

- Status: Accepted
- Date: 2026-08-21
- Deciders: Repository owner

## Context

The source repository is hosted on GitHub and production is connected directly
to AWS Amplify. Pull requests still need an independent, visible quality check,
but a second deployment path would duplicate credentials and operational
authority.

## Decision

GitHub Actions runs the read-only `npm run verify` contract for pull requests
and pushes to `main`. AWS Amplify remains the only deployment system and runs
the same contract before publishing the Next.js output.

## Consequences

- Pull requests get feedback before merge without AWS credentials.
- GitHub Actions cannot mutate production.
- Amplify and GitHub share one quality definition.
- Deployment health and domain operations remain observable in AWS.

## Alternatives considered

- Deploy from GitHub Actions: rejected because Amplify already owns branch
  deployments and adding AWS credentials would create a second control plane.
- Rely only on Amplify after merge: rejected because pull requests would lack a
  required pre-merge quality signal.
- Duplicate commands in both providers: rejected by ADR-0002.
