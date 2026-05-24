# Contract: Eventbrite external link

This contract documents how the public website integrates with Eventbrite for attendee registration. The site uses a plain external link to the public Eventbrite event page; it does NOT embed the Eventbrite checkout widget and does NOT call the Eventbrite REST API. We use Eventbrite (not Luma) because:

- Eventbrite is free for free events (no organizer cost, no attendee fees on free tickets), which matches the Community Day's free-attendance model.
- Other AWS Community Days in LATAM already standardize on Eventbrite (Mexico and Colombia, both confirmed in their production bundles).
- The Eventbrite event page itself handles the entire registration form, validation, capacity limits, sold-out state, confirmation emails, and the attendee dashboard. None of that needs to be mirrored in the site.

We deliberately do NOT load the Eventbrite widget script (`eb_widgets.js`) or call any Eventbrite endpoint, because:

- The two LATAM reference sites (Mexico and Colombia) link out to Eventbrite rather than embedding the widget. The simpler approach matches local convention.
- Skipping the widget eliminates third-party JavaScript on the home and `/register` pages, which improves Lighthouse Performance and Best Practices scores (FR-032).
- No Eventbrite credentials (private tokens) need to be stored or shipped.
- The site stays usable when Eventbrite is unavailable: the link still renders, and the site keeps rendering everything else.
- There is no widget API surface to track for drift.

## Inputs from content

The content layer provides one piece of information to the integration:

- `EventInfo.eventbriteEventUrl: string | null` - the canonical Eventbrite event URL for the current edition. Format: `https://www.eventbrite.com/e/<slug>-<eventId>` where `<eventId>` is the trailing numeric segment of the URL path. Localized hosts (`eventbrite.com.mx`, `eventbrite.es`, etc.) are also supported. The site does not parse the URL; it is rendered as-is in the `href`.

When `eventbriteEventUrl` is `null`, the registration page renders an alternative "Registro próximamente" message with a `mailto:` to `EventInfo.contactEmail`.

## Components

Two components consume this contract:

- `components/organisms/EventbriteRegisterButton.tsx` - server component. When the URL is present, renders a styled anchor (`Button as="a"`) with `href={eventbriteEventUrl}`, `target="_blank"`, and `rel="noopener noreferrer"`. When the URL is null, renders the "Registro próximamente" block plus a mailto button.
- `components/templates/RegisterTemplate.tsx` - server template. Branches on `registrationStatus` ("open" / "upcoming" / "closed") and on `archived`. The "open" branch renders the register button as the primary CTA. The "upcoming" branch renders the alternative copy plus a mailto-flavored register button. The "closed" and `archived` branches render a static notice and do not render the button.

The two components are server-rendered. There is no `"use client"` directive, no `useEffect`, and no `next/script` involvement.

## Status flow

The `EventInfo.registrationStatus` enum drives the UX without changing the link:

| Status | UX on `/register` |
|---|---|
| `"upcoming"` | "Aún no abrimos el registro" + mailto button labeled "Avisame por mail" |
| `"open"` | "El acceso al evento es gratuito..." + register button labeled "Registrarme" |
| `"closed"` | "El registro para esta edición ya está cerrado..." + mailto fallback in copy. No button. |

Past-edition routes (`/editions/{Y}/register`) always render the `archived` branch, regardless of the historical status flag (FR-035).

## Failure modes

| Mode | Detection | Fallback |
|---|---|---|
| `eventbriteEventUrl` is `null` (not yet set in content) | At render time | "Registro próximamente" + mailto to `contactEmail`. |
| Eventbrite is unreachable when the user clicks the link | The browser reports the failure on the Eventbrite side | Out of scope for this site. The link itself still renders; the broken target is Eventbrite's responsibility. |
| Editor sets a wrong URL | At edit time | The link points to a 404 on Eventbrite. The `event.json` schema only requires a valid URL, not that the URL resolves. Editors verify the URL after a content PR by following the link in the deploy preview. |

## Privacy

The site itself does not execute any Eventbrite-served JavaScript. Visitors only contact Eventbrite when they actively click the registration button. The privacy footer (FR-036) still includes a Spanish notice that registration is delegated to Eventbrite and links to Eventbrite's privacy policy at <https://www.eventbrite.com/help/en-us/articles/460838/eventbrite-privacy-policy/>, so visitors know what they are opting into before clicking.

No first-party cookies are set as part of the registration flow. No tracking pixel is embedded.

## Test plan

- Component test `tests/components/organisms-eventbrite-register-button.test.tsx`: with a URL, asserts the rendered element is an `<a>` with `href={eventbriteEventUrl}`, `target="_blank"`, and `rel="noopener noreferrer"`; without a URL, asserts the alternative block renders with the mailto link; asserts no `<script>` tag is injected by the component.
- E2E test `e2e/register.spec.ts`: with the seed `eventbriteEventUrl: null` plus `registrationStatus: "upcoming"`, asserts the "Aún no abrimos el registro" alternative is shown, the mailto link is present, and no `eb_widgets.js` script is loaded on the page.

## Migration note

Earlier drafts of this contract (and the implementation through commits up to the C1 migration) used the Eventbrite Embedded Checkout widget (`window.EBWidgets.createWidget(...)`, modal mode and inline iframe mode). That approach was replaced with the link-only approach documented above when comparison against the production bundles of `day.awscommunity.mx` and `awscommunitydaycolombia.com` confirmed that both regional reference sites link out rather than embed. The widget components (`EventbriteCheckoutEmbed`, the widget config helpers in `lib/api/eventbrite.ts`) and their tests were removed as part of the migration.
