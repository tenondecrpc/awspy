# Non-functional requirements

## Security

- External payloads and configuration are validated at boundaries.
- Embedded structured data cannot terminate its script element.
- Network calls use TLS, finite timeouts, bounded failure handling, and no credentials.
- No secrets or attendee data are committed or logged.
- CI uses least privilege and immutable third-party execution references.

## Availability and resilience

- Local event content renders without Sessionize.
- Static-ish content uses Next.js caching/revalidation rather than request-by-request provider calls.
- Provider, build, DNS, and hosting failures have explicit operational runbooks and rollback paths.

## Performance

- Prefer server rendering and static generation.
- Use `next/image`, `next/font`, and minimal client providers.
- Desktop Lighthouse targets: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.

## Accessibility and SEO

- Meet the repository WCAG 2.2 AA subset: keyboard operation, non-color state, reduced motion, semantic HTML, labels, announced errors, and AA contrast.
- Every route has metadata; shareable routes have appropriate images; structured data is valid and safely serialized.

## Quality and operations

- Node.js 24.15.0 and npm lockfile installs are deterministic.
- `npm run verify` is the portable merge gate; `npm run verify:e2e` is the release gate.
- Tests are deterministic and do not use live AWS or Sessionize services.
- Deployments require observable health, explicit approval, and rollback evidence.
