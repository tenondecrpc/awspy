# 0008 - Select Google Forms for volunteer registration

- Status: Accepted
- Date: 2026-09-06
- Deciders: Repository owner

## Context

The event needs a public volunteer application flow. The owner supplied the
official Google Form for AWS Community Day Paraguay 2026. The site remains a
frontend-only application and must not collect or persist applicant data.

## Decision

Store the public form URL and application status in edition metadata. Expose a
dedicated `/volunteers` route, a home-page invitation, and navigation links.
The primary CTA opens the public Google Forms `viewform` URL in a new tab with
`rel="noopener noreferrer"`.

Use a plain external link. Do not embed the form, load Google Forms scripts, or
proxy submissions. Update the site privacy notice to identify Google as the
data processor for volunteer applications and link to Google's privacy policy.

## Consequences

- The repository gains no backend, credentials, persistence, or runtime
  dependency.
- Google owns form availability, submission handling, and applicant data.
- Editors control open, upcoming, and closed states in versioned event
  metadata.
- The user-supplied base URL is normalized to the public `/viewform` endpoint
  so visitors do not pass through an edit-route redirect.

## Alternatives considered

- An embedded Google Form: rejected because it adds third-party scripts and
  weakens performance, privacy isolation, and visual control.
- A local application form: rejected because it requires a backend,
  persistence, privacy operations, and abuse protection.
- Email-only applications: rejected because the supplied form provides the
  intended structured workflow.
