# Documentation

Project context for AWS Community Day Paraguay. Repository rules live in
`AGENTS.md`; this directory explains the system those rules govern.

| Document | Purpose |
|---|---|
| `architecture.md` | Runtime boundaries, data flow, rendering, and project layout. |
| `deployment.md` | AWS Amplify deployment and Route 53 operations. |
| `ci.md` | Local verification, GitHub CI, Amplify gates, and release checks. |
| `decisions/` | Architecture Decision Records for durable platform choices. |
| `documented-exceptions.md` | Approved deviations and identified gaps. |

ADRs and exceptions answer different questions. An ADR records why a durable
choice exists. An exception records where a repository rule is deliberately
not followed, its mitigation, and the condition that ends it. A gap records a
known problem but does not authorize shipping it indefinitely.

The root `README.md` is the contributor entry point. Feature requirements and
delivery history remain under `specs/`.
