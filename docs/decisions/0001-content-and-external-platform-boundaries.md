# 0001 - Content and external platform boundaries

- Status: Accepted
- Date: 2026-05-06
- Deciders: Repository owner

## Context

The site needs frequently updated event information without introducing an
administration panel, database, or private API. Speakers and schedules already
have an editorial workflow in Sessionize. Other event details benefit from
reviewable version history.

## Decision

Store edition metadata and static editorial content as validated JSON and MDX
under `content/editions/{year}/`. Read speakers, sessions, and schedule through
the public Sessionize API behind the typed Zod boundary in `lib/api/`.

Delegate CFP submissions to Sessionize. Keep attendee registration external and
provider-neutral at the product level. The current Eventbrite link adapter is
optional and remains unconfigured until a provider is selected.

## Consequences

- The repository has no application backend, database, or private credentials.
- Editorial changes to local content are reviewed through Git.
- Sessionize outages degrade to intentional Spanish empty states.
- Choosing a non-Eventbrite registration provider requires renaming the current
  provider-specific schema and component boundary.

## Alternatives considered

- Internal admin and database: rejected because it adds persistence, security,
  and operations outside the first-edition scope.
- Sessionize embed widgets: rejected because opaque client markup weakens SEO,
  accessibility control, and visual consistency.
- Unvalidated local JSON: rejected because build-time failure is preferable to
  silently publishing malformed event content.
