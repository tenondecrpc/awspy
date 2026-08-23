# ADR-0004 - Centralize AI guidance under `.ai/`

- Status: Accepted
- Date: 2026-08-23

## Context

Detailed root guidance mixed durable policy, generated framework text, and mutable project state. Multiple tools require fixed discovery paths, and Spec Kit could rewrite those files.

## Decision

Use `.ai/` as the canonical policy, role, workflow, and template location. Keep minimal root and Claude loaders. Configure supported project-scoped Codex agents under `.codex/`. Disable Next.js agent-rule generation and preserve its version-aware documentation requirement in shared engineering standards. Route Spec Kit context to `.ai/generated/project-context.md`.

## Alternatives

- Keep root `AGENTS.md` canonical: rejected because it couples policy and mutable/generated context.
- Duplicate complete rules for each vendor: rejected because they drift.
- Use symlinks: rejected for portability.

## Consequences

Agent roles and handoffs are explicit, but tools must follow loaders and maintainers must update canonical files rather than vendor copies.

## Security impact

Read-only sandboxes reduce audit-agent mutation risk and canonical security policy is easier to review. Project AI directories must remain in secret-scan scope.

## Operational impact

Codex 0.149.0 supports the selected configuration. Six agent threads are allowed; model selection inherits the parent session.

## Migration plan

Decompose root rules, add loaders/configuration, redirect Spec Kit, verify paths/TOML, and document fixed-path prompt exceptions.

## Rollback strategy

Restore the baseline root files and remove `.ai/`/`.codex/`; application runtime is unaffected.
