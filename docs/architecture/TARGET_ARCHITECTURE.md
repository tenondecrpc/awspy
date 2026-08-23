# Target architecture

The target preserves the current structure and tightens boundaries rather than adding layers.

- Pages remain the composition and data-loading boundary.
- Local content and Sessionize adapters remain independent.
- A shared URL policy and structured-data serializer protect all output sinks.
- External fetches terminate predictably and expose sanitized failure categories.
- Client providers exist only when a real interactive consumer requires them.
- Versioned specs, ADRs, status registers, and canonical `.ai/` guidance make changes auditable.
- AWS Amplify remains the conditional hosting target until Next.js 16 preview validation is complete.

No backend, database, queue, container orchestrator, or new IaC framework is part of this target.
