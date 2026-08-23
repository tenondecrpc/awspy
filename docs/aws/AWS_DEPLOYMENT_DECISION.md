# AWS deployment decision

## Workload

This is a public, read-heavy Next.js App Router frontend with static generation, scheduled revalidation, image optimization, and no database or private API.

## Decision

Retain AWS Amplify Hosting `WEB_COMPUTE` as the conditional target because it matches the existing repository and operational model. Production release remains blocked until an isolated preview proves Next.js 16.3.2 behavior and the public DNS is restored.

## Relevant alternatives

| Option | Decision | Reason |
| --- | --- | --- |
| Amplify Hosting | Conditional selection | Lowest current operational change; managed CDN/build/compute; existing fallback deployment |
| S3 + CloudFront static export | Rejected | Does not preserve required ISR and Next image behavior without product changes |
| OpenNext on AWS | Contingency | More IaC and operational ownership; consider only if Amplify qualification fails |
| ECS/Fargate or EC2 | Rejected | Unnecessary server and scaling ownership for this frontend |
| Lambda/API Gateway, Batch, Step Functions, EKS | Rejected | Workload is not an API, worker, batch flow, or orchestrated service |

## Scaling, availability, and cost

Amplify provides managed distribution and compute scaling. Primary cost drivers are builds, bandwidth, SSR/ISR compute, image optimization, and observability retention. Availability depends on Amplify, Route 53/registrar health, and Sessionize; local static content reduces the last dependency.

## Security and deployment

Future deployment automation must use GitHub OIDC, a protected environment, temporary credentials, least privilege, and account/region safeguards. No deployment workflow or long-lived AWS key is introduced now.

## Rollback and disaster recovery

Rollback is an Amplify redeploy of a known-good commit after smoke checks. Repository content and build configuration are source-controlled. DNS, console settings, app ownership, retention, and preview evidence remain external prerequisites.

## Unresolved decisions

- AWS-001: restore public DNS.
- AWS-002: validate Next.js 16 support and rollback.
- AWS-004: inspect IAM, encryption, logging, and retention with authorized read access.
- IaC ownership: retain console-managed infrastructure until requirements justify selecting one framework.

## Authoritative references

- AWS Amplify SSR support matrix: <https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html>
- Amplify SSR environment variables: <https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html>
- Amplify CloudWatch monitoring: <https://docs.aws.amazon.com/amplify/latest/userguide/monitoring-with-cloudwatch.html>
