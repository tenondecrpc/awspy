# Test strategy

## Layers

- Unit: pure utilities, schemas, parsers, serializers, configuration, and API error mapping.
- Component: accessible behavior with React Testing Library and jsdom.
- Integration: page-adjacent composition with mocked adapters and committed Sessionize fixtures.
- E2E: critical routes and attendee flows in desktop and mobile Chromium.
- Deployment smoke: public route behavior against a configured base URL without mutating infrastructure.

## Test doubles

Use committed Sessionize fixtures or mock the typed fetch boundary. Do not call live Sessionize or AWS in deterministic tests. There is no AWS SDK to stub today.

## Coverage policy

Measure the real repository baseline with Vitest V8. Ratchet global thresholds from that measurement without lowering them. New or materially changed pure modules target at least 90 percent lines and branches where practical. Coverage is evidence, not a substitute for failure-path assertions.

## Definition of done

- Specification and acceptance criteria are current.
- Regression or characterization tests protect changed behavior.
- Formatting, lint, types, unit/integration tests, secret scan, and build pass.
- Page changes pass E2E and browser inspection.
- Security, dependency, AWS, documentation, and rollback impacts are reviewed.
- Work-item validation evidence is recorded.
