# AI guidance

This directory is the canonical source for repository AI instructions. Root `AGENTS.md`, root `CLAUDE.md`, and `.claude/CLAUDE.md` are compatibility loaders only.

## Layout

- `AGENTS.md` defines repository scope and instruction precedence.
- `shared/` contains durable engineering policies.
- `agents/` defines narrow read-only and implementation roles.
- `workflows/` defines repeatable coordination and review flows.
- `templates/` provides task, finding, handoff, and ADR formats.
- `generated/project-context.md` is the only mutable target for Spec Kit context generation.

The previous detailed root `AGENTS.md` was decomposed here. Project state moved to `docs/status/`; architecture, CI, deployment, decisions, and exceptions remain indexed by `docs/README.md`. Vendored `.agents/skills/` content remains in place because those files are reusable tool packages, not project policy.

Spec Kit command prose is canonical under `.ai/workflows/spec-kit/`. Claude's
fixed command paths use imports. Kiro prompt paths contain small instruction
loaders that direct the agent to the same canonical workflow and forward the
current prompt arguments.

Next.js agent-rule generation is disabled with `agentRules: false` because this repository supplies equivalent version-aware guidance in `.ai/shared/engineering-standards.md`. This keeps the required root bootstrap stable.
