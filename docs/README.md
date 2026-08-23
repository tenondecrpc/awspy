# Documentation

Project context for AWS Community Day Paraguay. Canonical AI rules live under
`.ai/`; the root `AGENTS.md` is a compatibility loader.

| Document | Purpose |
|---|---|
| `architecture.md` | Runtime boundaries, data flow, rendering, and project layout. |
| `architecture/` | Current and target architecture, components, and control/data flows. |
| `specs/` | System and non-functional requirements. |
| `security/` | Threat model and security architecture. |
| `testing/` | Test layers, doubles, coverage ratchet, and definition of done. |
| `aws/` | Hosting decision, operations, observability, and performance review. |
| `status/` | Baseline, dashboard, work, dependencies, blockers, risks, and findings. |
| `adr/` | New mission-level ADRs; earlier accepted ADRs remain under `decisions/`. |
| `deployment.md` | AWS Amplify deployment and Route 53 operations. |
| `ci.md` | Local verification, GitHub CI, Amplify gates, and release checks. |
| `decisions/` | Earlier immutable Architecture Decision Records. |
| `documented-exceptions.md` | Approved deviations and identified gaps. |

ADRs and exceptions answer different questions. An ADR records why a durable
choice exists. An exception records where a repository rule is deliberately
not followed, its mitigation, and the condition that ends it. A gap records a
known problem but does not authorize shipping it indefinitely.

The root `README.md` is the contributor entry point. Feature requirements and
delivery history remain under root `specs/`; system-wide requirements live in
`docs/specs/` to avoid rewriting feature history.
