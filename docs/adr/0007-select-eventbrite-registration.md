# 0007 - Select Eventbrite for attendee registration

- Status: Accepted
- Date: 2026-09-06
- Deciders: Repository owner
- Supersedes: The pending attendee-provider selection in ADR-0001; its other boundaries remain unchanged.

## Context

The owner selected Eventbrite for attendees and supplied the official Paraguay
2026 event URL. Sessionize continues to manage speaker submissions and the agenda.

## Decision

Reuse the existing external-link Eventbrite adapter. Store the official URL in
`eventbriteEventUrl` and set `registrationStatus` to `open`. The home links to
`/register`, whose primary CTA opens the official Eventbrite event in a new tab.

## Consequences

No embedded widget, new runtime dependency, backend, or local attendee data is
introduced. Registration status remains editorial content; update the edition
metadata and content-specific tests when it changes. Closed and archived pages
retain their existing behavior.

## Alternatives considered

- Sessionize: retained for speakers; the owner selected Eventbrite for attendees.
- A local registration form: unnecessary persistence and operational scope.
