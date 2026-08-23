# Architecture standards

- Preserve the current proportional boundaries: `app/`, `components/`, `lib/api/`, and `lib/content/`.
- Pages and route handlers may call resource modules. Components receive validated data through props.
- Keep the typed native-fetch wrapper thin and map external failures at the boundary.
- Keep local edition content separate from Sessionize resources.
- Use Next.js cache and revalidation primitives rather than a parallel server cache.
- Add a new architectural layer only when concrete coupling or duplication justifies it.
- Significant directory, runtime, persistence, deployment, or security design changes require an ADR with rollback guidance.
