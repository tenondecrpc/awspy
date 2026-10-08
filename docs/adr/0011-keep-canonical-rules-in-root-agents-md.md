# ADR-0011 - Keep the canonical agent rules in root `AGENTS.md`

- Status: Accepted
- Date: 2026-10-08
- Supersedes: the rules location in ADR-0004

## Context

ADR-0004 moved the canonical rules to `.ai/AGENTS.md` and left a root
`AGENTS.md` that only pointed there. Claude Code expands `@` imports, so it
received the rules at startup. Agents that load root `AGENTS.md` without
expanding imports, such as Codex, received only the pointer and had to open
`.ai/AGENTS.md` themselves before the rules applied.

ADR-0004 rejected a canonical root file because Spec Kit and Next.js could
rewrite it. Both paths are now closed: Spec Kit writes plan context only to
`.ai/generated/project-context.md`, and `next.config.ts` sets
`agentRules: false`.

## Decision

Keep the canonical rules in root `AGENTS.md`. Remove `.ai/AGENTS.md`.
`.claude/CLAUDE.md` imports root `AGENTS.md`, and `.ai/CLAUDE.md` names it as
authoritative. Shared standards, roles, workflows, templates, and generated
context stay under `.ai/`, as ADR-0004 decided.

## Alternatives

- Keep the root pointer: rejected because an agent that skips the pointer runs
  without the rules.
- Copy the rules into both files: rejected because the copies drift.
- Symlink `.ai/AGENTS.md`: rejected for portability, as in ADR-0004.

## Consequences

Every agent that loads root `AGENTS.md` receives the rules at startup. The file
must stay free of generated or mutable project state; that belongs in
`docs/status/` and `.ai/generated/`.

## Security impact

None. Root `AGENTS.md` stays in Secretlint and Gitleaks scope.

## Rollback strategy

Revert the commit that introduced this ADR; the application runtime is
unaffected.
