# System requirements

## Purpose

The system publishes Spanish event information for AWS Community Day Paraguay. It is a public frontend with no application backend or persistent store.

## Functional requirements

- Render current and archived edition metadata from validated files under `content/editions/{year}/`.
- Render speakers, sessions, and schedules from the public Sessionize API when configured.
- Continue rendering local event content and explicit empty states when Sessionize is unavailable.
- Provide edition-aware navigation, speaker details, venue, team, volunteer, sponsor, FAQ, code-of-conduct, registration, and CFP routes.
- Delegate attendee registration, volunteer applications, talk submission, and sponsor inquiry to approved external links or email actions.
- Publish canonical metadata, Open Graph/Twitter data, robots directives, sitemap entries, and Event/Person structured data.

## Interfaces

- Browser: Next.js App Router HTML, CSS, and minimal client JavaScript.
- Local content: JSON and restricted MDX text, validated at build/request boundaries.
- External data: public Sessionize JSON views through `lib/api/`.
- Deployment: npm build/start contract and AWS Amplify Hosting configuration.

## Compatibility constraints

Public URLs, Spanish attendee copy, JSON content shapes, environment names, and external provider contracts are compatibility surfaces. Changes require evidence, tests, and specification updates.
