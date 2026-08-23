# ADR-0005 - Retain Amplify Hosting conditionally

- Status: Accepted with blockers
- Date: 2026-08-23

## Context

The site is a read-heavy Next.js frontend with ISR and image optimization. It already has an Amplify fallback deployment, but public DNS is unavailable and current AWS documentation does not list Next.js 16 support.

## Decision

Keep Amplify `WEB_COMPUTE` as the target only after an isolated preview validates Next.js 16.3.2. Do not add or deploy IaC while external ownership and runtime compatibility are unresolved. Keep OpenNext as a contingency, not a parallel platform.

## Alternatives

- S3/CloudFront static export: rejected because it changes ISR and image behavior.
- OpenNext: viable contingency with greater IaC and operations ownership.
- ECS/EC2/EKS: rejected as disproportionate.

## Consequences

The current deployment model remains simple, but AWS-001 and AWS-002 block production readiness.

## Security impact

Future automation must use GitHub OIDC and least privilege. No static credentials or deployment mutation are introduced.

## Operational impact

Preview qualification, custom-domain recovery, alarms, runbooks, and rollback evidence are mandatory external work.

## Migration plan

Persist public build variables safely, validate a preview, restore DNS, add monitors, and document console state. Select one IaC framework only if the contingency is activated or ownership becomes clear.

## Rollback strategy

Redeploy the last known-good commit in Amplify. If qualification fails, retain the current deployment while evaluating OpenNext in a separate ADR and proof of concept.
