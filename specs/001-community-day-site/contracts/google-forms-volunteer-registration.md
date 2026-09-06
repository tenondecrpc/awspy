# Google Forms volunteer registration contract

## Purpose

Volunteer applications are delegated to a public Google Form. The site exposes
the flow through a plain external link and does not collect application data.

## Content inputs

- `EventInfo.volunteerRegistrationUrl`: nullable HTTPS URL for the public
  Google Forms `viewform` endpoint.
- `EventInfo.volunteerRegistrationStatus`: `"open"`, `"upcoming"`, or
  `"closed"`.

## Rendering contract

When the status is `"open"` and the URL is configured, `/volunteers` renders a
primary link with:

- `href` set to the validated public form URL.
- `target="_blank"`.
- `rel="noopener noreferrer"`.
- A visible, descriptive Spanish label.

When the status is `"open"` but the URL is absent, the UI uses the upcoming
state and a mailto fallback. The closed state renders no application action.
Past-edition volunteer pages always render an archived notice.

## Privacy and performance

The site does not embed an iframe, load a Google Forms script, or proxy form
submissions. Google receives application data only after a visitor activates
the external link. The global privacy notice links to Google's privacy policy.
