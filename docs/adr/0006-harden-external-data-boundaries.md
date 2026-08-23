# ADR-0006 - Harden external data boundaries

- Status: Accepted
- Date: 2026-08-23

## Context

Sessionize is public and untrusted. Zod validates shapes, but unrestricted URL schemes, raw JSON-LD serialization, and unbounded request duration leave security and resilience gaps.

## Decision

Keep native `fetch` and Zod. Add explicit URL policies, safe JSON-LD serialization, finite request timeouts, and timestamp invariants at existing boundaries. Preserve tolerant empty-state behavior and do not add speculative retries.

## Alternatives

- Add a sanitization or HTTP library: rejected because current primitives are sufficient.
- Add retries and a new cache: rejected without quota/latency evidence.
- Fail every build on provider drift: rejected because current product requirements prioritize local-content resilience.

## Consequences

Malformed or unsafe provider data degrades to existing empty states. Valid provider behavior and public contracts remain unchanged.

## Security impact

Reduces XSS, unsafe navigation, and resource-exhaustion exposure.

## Operational impact

Timeout/fallback categories should be observable without payload or credential logging. Response-size limits remain future work pending an efficient streaming design.

## Migration plan

Add failing tests, implement central helpers, update all sinks and schemas, and run unit, build, and browser gates.

## Rollback strategy

Revert the isolated implementation commit. If provider compatibility fails, narrow the policy only with a verified provider contract and new tests.
