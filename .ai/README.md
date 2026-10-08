# AI guidance

This directory holds the shared standards, roles, workflows, and templates behind the repository AI rules. The rules themselves live in root `AGENTS.md`, which agents load at startup (ADR-0011). Root `CLAUDE.md` and `.claude/CLAUDE.md` are Claude Code loaders that import it.

## Layout

- Root `AGENTS.md`, outside this directory, defines repository scope, instruction precedence, and mandatory rules.
- `shared/` contains durable engineering policies.
- `agents/` defines narrow read-only and implementation roles.
- `workflows/` defines repeatable coordination and review flows.
- `templates/` provides task, finding, handoff, and ADR formats.
- `generated/project-context.md` is the only mutable target for Spec Kit context generation.

The previous detailed root `AGENTS.md` was decomposed here, and its rules later returned to root `AGENTS.md` without the mutable context. Project state moved to `docs/status/`; architecture, CI, deployment, decisions, and exceptions remain indexed by `docs/README.md`. Vendored `.agents/skills/` content remains in place because those files are reusable tool packages, not project policy.

Spec Kit command prose is canonical under `.ai/workflows/spec-kit/`. Claude's
fixed command paths use imports. Kiro prompt paths contain small instruction
loaders that direct the agent to the same canonical workflow and forward the
current prompt arguments.

Next.js agent-rule generation is disabled with `agentRules: false` because this repository supplies equivalent version-aware guidance in `.ai/shared/engineering-standards.md`. This keeps generated text out of root `AGENTS.md`.
