# Architecture Decision Records

Create one file per durable platform decision using `NNNN-short-slug.md`.
Operational behavior belongs in `docs/architecture.md`, `docs/ci.md`, or
`docs/deployment.md`.

Do not rewrite an accepted ADR to change history. Add a new ADR and mark the old
one `Superseded by ADR-NNNN`.

## Format

```markdown
# NNNN - Short title

- Status: Proposed | Accepted | Superseded by ADR-NNNN | Deprecated
- Date: YYYY-MM-DD
- Deciders: role or named approver

## Context

## Decision

## Consequences

## Alternatives considered
```

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](0001-content-and-external-platform-boundaries.md) | Content and external platform boundaries | Accepted |
| [0002](0002-verification-in-npm-scripts.md) | Verification contract lives in npm scripts | Accepted |
| [0003](0003-github-verifies-amplify-deploys.md) | GitHub verifies and Amplify deploys | Accepted |
