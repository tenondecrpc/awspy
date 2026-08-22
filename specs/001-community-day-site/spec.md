# Feature Specification: AWS Community Day Paraguay public website

**Feature Branch**: `001-community-day-site`
**Created**: 2026-05-23
**Status**: Draft
**Input**: User description: "Build the public website for AWS Community Day Paraguay 2026, the first edition of the local AWS user group meetup. Multi-page application that reads speakers and schedule from Sessionize (public JSON, no auth), attendee registration via Eventbrite link (public event page, no embed), and other event content (sponsors, organizers, venue, FAQ, code of conduct, event metadata) from in-repo content-as-code. Multi-edition support from day one. Routes and code in English; user-facing copy in Spanish. No backend, no admin panel in this repo."

## Clarifications

### Session 2026-05-23

- Coverage scan summary across the standard taxonomy (Functional, Domain, UX, Non-Functional, Integration, Edge Cases, Constraints, Terminology, Completion Signals, Misc):
  - Resolved during planning conversation and encoded in the spec: page architecture (multi-page), backend strategy (none in this repo), admin strategy (none; editorial via Sessionize/Eventbrite/PR), registration flow (Eventbrite external), CFP flow (Sessionize external), sponsor flow (mailto), image handling (Sessionize and content URLs), authentication (none, public read-only), multi-edition scheme (current at `/`, past at `/editions/{year}`), hosting target (AWS Amplify Hosting as primary, with a cloud-agnostic build/start contract so the same artifact can be deployed to Vercel, OpenNext on raw AWS, Netlify, or self-hosted Node.js without code changes), language separation (English code, Spanish UI), package manager (npm), constitution constraints (atomic design, no axios, no backend logic).
  - Outstanding low-impact items resolved by reasonable default in this session (see clarifications below): past-edition status display, privacy notice, analytics tooling, observability for a static site, Sessionize rate-limit risk.
  - No critical ambiguities require interactive user input. The spec is ready for `/speckit.plan`.
- Q: How should registration and call-for-papers statuses behave on past-edition pages (`/editions/{Y}/register`, `/editions/{Y}/cfp`)? → A: Past editions always render a single "Esta edición ya finalizó" message regardless of the original status flags; only the current edition reads the dynamic status (open / upcoming / closed) from its event metadata.
- Q: Does the site need a privacy notice or cookie banner for the first edition? → A: A short privacy footer is included noting that the site itself does not collect personal data and that registration is delegated to Eventbrite (linking to Eventbrite's privacy policy). No cookie banner is shown because no first-party tracking is installed.
- Q: Should analytics tooling be installed for the first edition? → A: No analytics on the first edition. Decision deferred to a follow-up feature if traffic insights are needed.
- Q: What observability is required for the static site? → A: The hosting platform's built-in deployment and runtime logs are sufficient for the first edition. On AWS Amplify Hosting (primary target) build logs surface in the Amplify Console and runtime logs surface in CloudWatch. No custom logging, metrics, or tracing infrastructure is added.

**2026 operational note**: Sessionize is the primary platform for speakers,
schedule, and CFP management. The attendee registration provider is not yet
finalized. Until that decision is made, `eventbriteEventUrl` remains `null`
and `registrationStatus` remains `"upcoming"`. The Eventbrite requirements in
this specification describe the currently implemented optional adapter, not a
confirmed production provider. A different provider requires an explicit spec
and schema update before registration opens.
- Q: How is Sessionize rate limiting handled? → A: Sessionize already caches responses for five minutes server-side, and the site adds its own ten-minute revalidation; rate limiting is not a practical concern at expected traffic. If a Sessionize request fails, the empty-state fallback already covers the user-visible behavior (see FR-013).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Discover the event from the home page (Priority: P1)

A first-time visitor lands on the site root and immediately understands what AWS Community Day Paraguay is, when and where it will happen, and how to take the next step (register, submit a talk, or learn more). The home page works even before any speaker, sponsor, or session has been confirmed: missing data shows a clear "Próximamente" placeholder rather than breaking the page.

**Why this priority**: This is the core value of the site. Without a working landing page that communicates what the event is, no other feature delivers value. It is also the page that search engines and social shares hit first.

**Independent Test**: Open `/` with no Sessionize event configured and no sponsors yet. The page must render the hero (event name, date, location, mission), a countdown to the event date, an "About" section, navigation to all the secondary pages, and Spanish-language placeholders for the unfilled sections. Lighthouse on desktop scores Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.

**Acceptance Scenarios**:

1. **Given** the site is deployed with the 2026 edition data only (no speakers, no sponsors, no schedule), **When** a visitor opens `/`, **Then** they see the event name, date, location, mission, countdown, navigation, footer, and clear Spanish placeholders ("Speakers próximamente", "Agenda próximamente", "Pronto anunciaremos a nuestros sponsors").
2. **Given** the visitor is using a keyboard, **When** they tab through the page, **Then** every interactive element is reachable in a logical order, focus is visible, and a skip link lets them jump past the navigation.
3. **Given** the visitor has `prefers-reduced-motion` enabled, **When** the home page loads, **Then** the countdown and any transition do not animate.
4. **Given** the home page is shared on social media, **When** the link is unfurled, **Then** the preview shows the event name, the edition year, the date, and a representative image.

---

### User Story 2 - Browse confirmed speakers (Priority: P1)

A visitor wants to see who is speaking at the event. They navigate from the home page to a dedicated speakers section, browse the full list, and click into any speaker to read the bio and the talks they will deliver. The list reflects whatever the organizers have currently approved in Sessionize, with a graceful empty state when no speaker is confirmed yet.

**Why this priority**: Speakers are the main reason most attendees register. The list must reflect organizer changes in Sessionize without redeploying the site, and it must not block the page render when the data is empty or temporarily unavailable.

**Independent Test**: Configure the Sessionize event identifier in the edition metadata and verify that the speakers list renders the current speakers from Sessionize within the configured revalidation window. With an unconfigured or missing identifier, verify the empty-state copy renders without errors and the rest of the navigation continues to work.

**Acceptance Scenarios**:

1. **Given** the edition has a configured Sessionize event identifier with at least one accepted speaker, **When** a visitor opens `/speakers`, **Then** every accepted speaker is shown with name, photo (if provided), tagline, and a link to the speaker detail page.
2. **Given** a visitor is on the speakers list, **When** they click a speaker card, **Then** they land on `/speakers/[slug]` and see the speaker's full bio, social links, and the sessions they will deliver.
3. **Given** the Sessionize event identifier is missing or returns no accepted speakers, **When** a visitor opens `/speakers`, **Then** they see a Spanish empty-state message explaining that speakers will be announced soon, the layout is intact, and no error is shown to the user.
4. **Given** the Sessionize service is unreachable, **When** a visitor opens `/speakers`, **Then** the page still renders with the same empty-state message and the visitor can navigate elsewhere.

---

### User Story 3 - Consult the event schedule (Priority: P1)

An attendee wants to plan their day at the event. They open the schedule page and see all sessions organized by day, time, and room or track. Times are shown in the local Asunción timezone. When the schedule is not yet announced, the page communicates that clearly.

**Why this priority**: A correct, readable schedule is critical on the day of the event and in the days before it. Attendees use it to choose tracks and to plan their arrival.

**Independent Test**: Configure Sessionize with a public schedule and verify that the page renders all days, all rooms or tracks, and all sessions in the correct local time. Without a published schedule, the page renders the empty state.

**Acceptance Scenarios**:

1. **Given** the edition has a published Sessionize schedule, **When** a visitor opens `/schedule`, **Then** they see each day, the rooms or tracks for that day, and the sessions placed in their correct time slots, with times formatted for the Asunción timezone.
2. **Given** a session links to a speaker on the schedule, **When** the visitor clicks the session, **Then** they navigate to the corresponding speaker detail page.
3. **Given** the schedule is not yet announced or no sessions exist, **When** a visitor opens `/schedule`, **Then** they see a Spanish empty-state message that the agenda will be announced soon.

---

### User Story 4 - Find practical event information (Priority: P2)

A visitor wants to know practical details that influence their decision to attend or sponsor: where it takes place, who organizes it, who sponsors it, what to expect, and what behavior is required of attendees. They navigate from the home or from the menu to the corresponding page and find that information.

**Why this priority**: Once a visitor is interested, this information is what closes the decision to register or sponsor. It is operationally important, but the home page already conveys the headline data; this story adds the depth.

**Independent Test**: Populate `content/editions/2026/` with placeholder data for sponsors, organizers, venue, FAQ, and code of conduct. Verify each page renders the corresponding content and that the navigation back to the home and other pages works on mobile and desktop.

**Acceptance Scenarios**:

1. **Given** the edition's sponsor list is populated with logos, names, tiers, and websites, **When** a visitor opens `/sponsors`, **Then** the sponsors are grouped by tier (Platinum, Gold, Silver, Bronze, Community), every logo links to the sponsor's website, and a clear "¿Querés ser sponsor?" block shows a mailto link to the configured contact email.
2. **Given** the edition's venue data is populated, **When** a visitor opens `/venue`, **Then** they see the venue name, address, a map link, and how to get there by public transport.
3. **Given** the edition's organizers list is populated, **When** a visitor opens `/team`, **Then** they see each organizer's photo, role, and links.
4. **Given** the edition's FAQ is populated, **When** a visitor opens `/faq`, **Then** they see each question as an expandable item, expanded items reveal the answer, and the accordion is fully operable by keyboard with the correct ARIA semantics.
5. **Given** the edition's code of conduct is populated, **When** a visitor opens `/code-of-conduct`, **Then** they see the full text in Spanish with a clear way to report a violation.

---

### User Story 5 - Register as attendee or submit a talk (Priority: P2)

A visitor wants to register as attendee or submit a talk to the call for papers. They reach the corresponding page (`/register` or `/cfp`), find a clear explanation of the next step, and a primary call to action that takes them to the right external system (Eventbrite for registration, Sessionize for talk submissions). When the corresponding flow is not yet open, the page communicates that and shows when it will open or how to be notified.

**Why this priority**: Registration and CFP are the conversion goals of the site. They are external by design (the organizing team relies on Eventbrite and Sessionize), so the site does not collect data itself but must guide visitors clearly.

**Independent Test**: Configure the edition with an Eventbrite event URL and the registration status set to "open"; verify that `/register` shows the primary "Registrarme" button rendered as an external link to the Eventbrite event page (with `target="_blank"` and the safe `rel`). Set the status to "upcoming" and verify the page shows the "Aún no abrimos el registro" alternative with a mailto button instead. Repeat for `/cfp` against Sessionize.

**Acceptance Scenarios**:

1. **Given** registration is open and the Eventbrite event URL is configured, **When** a visitor opens `/register`, **Then** they see a primary "Registrarme" button that, when clicked, opens the Eventbrite event page in a new tab. The same button is reachable from the home hero. The Eventbrite page handles the actual checkout; the site does not load any Eventbrite-served JavaScript.
2. **Given** registration is upcoming or closed, **When** a visitor opens `/register`, **Then** they see a clear Spanish message indicating the current state ("Registro próximamente" or "Registro cerrado") and an alternative call to action (subscribe via mailto or a link to the home page).
3. **Given** the call for papers is open and the Sessionize submission URL is configured, **When** a visitor opens `/cfp`, **Then** they see the CFP description, the submission deadline, and a primary call to action that opens the Sessionize submission page in a new tab with secure link attributes.
4. **Given** the call for papers is upcoming or closed, **When** a visitor opens `/cfp`, **Then** they see a clear Spanish message indicating the current state and the call to action is disabled or replaced.

---

### User Story 6 - Access past editions of the event (Priority: P2)

A visitor wants to look at previous editions of the event (speakers, schedule, sponsors, photos). They reach an editions index, pick a past year, and navigate the same pages as the current edition but for that year. The current edition always lives at the bare URL.

**Why this priority**: For the first edition there are no past editions, but the structure must be ready so that adding the 2027 edition does not require a refactor. This is an explicit user requirement.

**Independent Test**: Add a placeholder past-edition folder under `content/editions/` and verify that `/editions` lists it, that `/editions/{year}` renders, that all sub-routes mirror the current-edition routes, and that an unknown year returns a Not Found page with a friendly Spanish message.

**Acceptance Scenarios**:

1. **Given** there is at least one past edition under `content/editions/`, **When** a visitor opens `/editions`, **Then** they see a list of all past editions with name, year, and a link to each.
2. **Given** an edition year `Y` exists, **When** a visitor opens `/editions/{Y}`, **Then** they see the home of that edition rendered with the same template as the current edition.
3. **Given** the visitor is on a past edition home, **When** they open `/editions/{Y}/speakers`, `/editions/{Y}/schedule`, `/editions/{Y}/sponsors`, `/editions/{Y}/venue`, `/editions/{Y}/team`, `/editions/{Y}/faq`, `/editions/{Y}/code-of-conduct`, `/editions/{Y}/cfp`, or `/editions/{Y}/register`, **Then** each page renders with that edition's data.
4. **Given** an edition year does not exist, **When** a visitor opens `/editions/{Y}`, **Then** they see a 404 page with a Spanish message and a link back to the current edition's home.

---

### User Story 7 - Be discovered through search and social shares (Priority: P3)

Search engines and social platforms must be able to crawl, index, and present the site cleanly. Each page exposes a representative title, description, and Open Graph card. Structured data describes the event and its speakers. A sitemap and a robots policy are published.

**Why this priority**: Discovery drives attendance. The basics must be in place so that organic and shared traffic converts.

**Independent Test**: Fetch `/sitemap.xml`, `/robots.txt`, and any route's HTML to verify metadata, Open Graph tags, Twitter card, and JSON-LD blocks (`Event` on the home, `Person` on speaker detail, `BreadcrumbList` on sub-routes).

**Acceptance Scenarios**:

1. **Given** a route in the site, **When** its HTML is inspected, **Then** it contains a unique title, description, Open Graph and Twitter card tags, and a canonical URL.
2. **Given** the site is deployed, **When** a search engine fetches `/sitemap.xml`, **Then** the document lists all current-edition routes plus all past-edition routes that exist.
3. **Given** the site is deployed, **When** a search engine fetches `/robots.txt`, **Then** it allows crawling and references the sitemap.
4. **Given** the home page is rendered, **When** its HTML is inspected, **Then** it includes a JSON-LD `Event` block with name, date, location, and organizer.
5. **Given** a speaker detail page is rendered, **When** its HTML is inspected, **Then** it includes a JSON-LD `Person` block with name, image (if provided), and links.

---

### User Story 8 - Stay usable when external services fail (Priority: P3)

The site continues to render correctly when Sessionize or Eventbrite is slow, returns errors, or returns no data. The visitor sees graceful Spanish placeholder content rather than broken pages or stack traces.

**Why this priority**: External services do fail, especially in the run-up to and during the event. The constitution explicitly requires that static event content keeps rendering when the backend is unreachable; this story enforces that for our specific data sources.

**Independent Test**: Force the Sessionize fetch to fail (invalid event id, network error simulated in dev) and verify that the home, speakers, and schedule pages render with empty states and that no global error page is shown. Force the Eventbrite URL to be missing and verify that `/register` renders with the alternative CTA.

**Acceptance Scenarios**:

1. **Given** Sessionize is unreachable or returns no accepted speakers, **When** a visitor opens `/`, `/speakers`, or `/schedule`, **Then** each page renders with a Spanish empty-state message and the navigation continues to work.
2. **Given** the Eventbrite event URL is missing or invalid, **When** a visitor opens `/register`, **Then** the page renders with the "Registro próximamente" alternative and a contact CTA.
3. **Given** a content file under `content/editions/{year}/` is missing or malformed, **When** the site is built, **Then** the build fails loudly with a clear validation error referencing the offending file (so it is caught before deploy, not in production).

---

### User Story 9 - Reach the public domain reliably (Priority: P3)

The site is published and reachable at its public domain on AWS Amplify Hosting, with the correct edition served at the bare URL and revalidation tuned so that newly accepted speakers or schedule changes appear within minutes without requiring a manual redeploy. The build remains cloud-agnostic so a future migration to Vercel, OpenNext on raw AWS, or self-hosted Node.js requires no code change.

**Why this priority**: The end goal of the project is a live, public site. The hosting target for v1 is AWS Amplify Hosting (primary), and revalidation timings are user-visible (organizers expect their changes to appear soon). The constitution's frontend-only boundary plus the Next.js standard build keeps the project portable.

**Independent Test**: Deploy to AWS Amplify Hosting, hit every route in the public preview, and confirm that an organizer change in Sessionize is reflected in the live site within the configured revalidation window. Re-running `BASE_URL=<preview-url> npx playwright test --project=chromium e2e/deploy-smoke.spec.ts` against the preview returns 27 passes.

**Acceptance Scenarios**:

1. **Given** the site is deployed to its production hosting platform, **When** a visitor opens any route listed in the route map, **Then** the route returns a 200 response with the expected content.
2. **Given** an organizer accepts a new speaker in Sessionize, **When** the configured revalidation window passes, **Then** the new speaker appears on `/speakers` without a manual redeploy.
3. **Given** the current edition is set to 2026, **When** a visitor opens `/`, **Then** they see the 2026 content; when 2027 becomes the current edition, the same URL serves the 2027 content with no other change required.

---

### Edge Cases

- A speaker is removed from Sessionize after the static page has been built; the speaker disappears within the revalidation window, and old direct links to `/speakers/[slug]` return a 404 with a friendly Spanish message.
- Two speakers share the same first and last name; the slug helper must disambiguate (for example, by appending a numeric or middle-name token) so both detail pages remain reachable.
- A session in Sessionize spans across midnight in Asunción time; the schedule grid must render the session correctly on the day it starts.
- A sponsor's logo URL becomes unavailable; the sponsors page must show the sponsor's name as a fallback rather than a broken image.
- The visitor's browser does not support `IntersectionObserver` or another modern API; the site must still render content (graceful degradation), even if some progressive enhancements are absent.
- A past edition's content folder exists but is missing one of the optional files (for example, no `faq.json`); the corresponding sub-route renders an empty state for that section without breaking the rest of the edition.
- The visitor opens a deep URL (for example, `/editions/2026/speakers/foo`) before the corresponding speaker has been accepted in Sessionize; the page shows a Spanish "Speaker no encontrado" 404 with a link back to the speakers list.

## Requirements *(mandatory)*

### Functional Requirements

#### Navigation and content shell

- **FR-001**: Site MUST expose the following routes for the current edition: `/`, `/speakers`, `/speakers/[slug]`, `/schedule`, `/sponsors`, `/venue`, `/team`, `/faq`, `/code-of-conduct`, `/cfp`, `/register`, `/editions`.
- **FR-002**: Site MUST mirror the routes above under `/editions/[year]/...` for every edition year present in the content directory.
- **FR-003**: The bare URL (`/`) MUST always serve the current edition; the current edition is configurable via environment without code change.
- **FR-004**: Every page MUST share a common header with navigation to all top-level routes, a common footer with the contact email and social links, and a skip link to the main content.
- **FR-005**: Navigation MUST be operable on mobile (collapsible menu) and desktop (inline links).

#### Data sources

- **FR-006**: The list of speakers and the speaker detail data MUST be sourced from a public Sessionize endpoint configured per edition.
- **FR-007**: The schedule MUST be sourced from the same Sessionize event used for speakers.
- **FR-008**: Attendee registration MUST be delegated to a public Eventbrite event configured per edition; the site MUST render an external link to that Eventbrite event page on `/register` and on a primary "Registrarme" button reachable from the home and other entry points. The link MUST open in a new tab with `rel="noopener noreferrer"`. The site MUST NOT load the Eventbrite widget script (`eb_widgets.js`) and MUST NOT call any Eventbrite REST endpoint.
- **FR-009**: Call for papers submissions MUST be delegated to a public Sessionize submission page configured per edition; the site MUST link to it from `/cfp`.
- **FR-010**: Sponsor inquiries MUST be delegated to a mailto link using the configured contact email; no internal sponsor application form is built.
- **FR-011**: All other content (sponsors list, organizers, venue, FAQ, code of conduct, edition metadata such as dates and hero copy) MUST be stored in this repository under `content/editions/{year}/` and validated at load time.
- **FR-012**: There MUST NOT be any backend service, database, or admin panel built in this repository; all editorial changes happen either in Sessionize, in Eventbrite, or via a pull request to this repository.

#### Resilience and empty states

- **FR-013**: When Sessionize returns no accepted speakers (or is unreachable), `/speakers`, `/schedule`, and the home page MUST render with a Spanish empty-state message and the rest of the navigation MUST keep working.
- **FR-014**: When the Eventbrite event URL is missing or invalid for the current edition, `/register` MUST render with a Spanish "Registro próximamente" alternative and a contact CTA.
- **FR-015**: When a content file under `content/editions/{year}/` is missing or fails validation, the build MUST fail with a descriptive error referencing the file and the field that failed.

#### Internationalization and language

- **FR-016**: All visible copy on the site MUST be in Spanish.
- **FR-017**: All routes, identifiers, file names, code, comments, commit messages, and PR descriptions MUST be in English.
- **FR-018**: Spanish copy MAY use proper Spanish punctuation including accents and inverted question/exclamation marks; English internal text MUST remain ASCII (no em-dashes or en-dashes).

#### Accessibility

- **FR-019**: Every interactive element on every page MUST be reachable and operable by keyboard, with a visible focus indicator.
- **FR-020**: No information MUST be conveyed by color alone; color cues MUST be paired with text, icon, or shape.
- **FR-021**: All animations and transitions MUST respect the user's `prefers-reduced-motion` preference.
- **FR-022**: All text MUST meet WCAG AA contrast against its background.
- **FR-023**: Forms MUST associate labels with inputs and announce inline errors to assistive technology.
- **FR-024**: The FAQ accordion MUST expose `aria-expanded` and `aria-controls` and respond to standard keyboard interactions (Enter, Space, arrow keys).

#### SEO and metadata

- **FR-025**: Every route MUST export metadata including a unique title, a meta description, an Open Graph card (title, description, image, URL), and a Twitter card.
- **FR-026**: A `sitemap.xml` MUST be generated automatically and list every current-edition route and every past-edition route that exists in the content directory.
- **FR-027**: A `robots.txt` MUST be generated automatically allowing crawling and referencing the sitemap.
- **FR-028**: An Open Graph image MUST be generated dynamically per edition and used on the home and on shareable sub-routes.
- **FR-029**: The home page MUST include a JSON-LD `Event` block; speaker detail pages MUST include a JSON-LD `Person` block; sub-routes MUST include a `BreadcrumbList` block.

#### Multi-edition support

- **FR-030**: Adding a new edition MUST require only adding a new folder under `content/editions/{year}/` with the required files and updating the `CURRENT_EDITION` configuration; no code changes MUST be required to switch editions or to publish a past edition.
- **FR-031**: An unknown edition year MUST render a Not Found page with a friendly Spanish message and a link back to the current-edition home.

#### Performance

- **FR-032**: The home page MUST achieve, on a desktop Lighthouse run, Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95.
- **FR-033**: The site MUST NOT load any third-party script for the registration flow; registration is delegated entirely to the linked Eventbrite event page. Any third-party script added in the future (analytics, embeds for new content sections, etc.) MUST be lazy-loaded and MUST NOT block the largest contentful paint of any page.
- **FR-034**: Speaker images MUST be served using the framework's optimized image pipeline with explicit dimensions and appropriate `sizes`.

#### Privacy, observability, and past-edition behavior (clarifications applied 2026-05-23)

- **FR-035**: Past-edition pages under `/editions/{year}/register` and `/editions/{year}/cfp` MUST render a single Spanish "Esta edición ya finalizó" message regardless of the historical status flags; only the current edition's pages read the dynamic registration and CFP statuses from its event metadata.
- **FR-036**: The site MUST include a Spanish privacy footer noting that no personal data is collected by this site and that registration is delegated to Eventbrite (with a link to Eventbrite's privacy policy). No cookie banner is shown because no first-party tracking is installed.
- **FR-037**: No analytics tooling MUST be added for the first edition; the decision is deferred to a follow-up feature if traffic insights are later needed.
- **FR-038**: No custom logging, metrics, or tracing infrastructure MUST be added for the first edition; the hosting platform's built-in deployment and runtime logs are the sole observability surface. On AWS Amplify Hosting (primary target) this is the Amplify Console for build logs and AWS CloudWatch for SSR runtime logs.

### Key Entities

- **Edition**: A single year of the event. Identified by its year (a four-digit string). Aggregates all per-year content (event metadata, sponsors, organizers, venue, FAQ, code of conduct) and references the corresponding Sessionize event identifier and Eventbrite event URL. Exactly one edition is the "current" edition at any time.
- **Event metadata**: Date(s), location summary, hero title and subtitle, contact email, social links, the Sessionize event identifier, the Eventbrite event URL, and status flags for the call for papers (open, upcoming, closed) and the registration (open, upcoming, closed). One per edition.
- **Speaker**: A person presenting at an edition. Sourced from Sessionize. Identified by a slug derived from their name. Has a name, optional photo URL, optional tagline, optional biography, optional links (Twitter, LinkedIn, GitHub, blog, etc.), and a list of sessions they will deliver in that edition.
- **Session**: A talk, workshop, or panel at an edition. Sourced from Sessionize. Has a title, optional description, start and end times in the Asunción timezone, an optional room, optional tracks, and references to its speakers.
- **Room or Track**: A grouping used in the schedule grid. Sourced from Sessionize. Has a name and an order.
- **Sponsor**: A company or organization sponsoring an edition. Stored in `content/editions/{year}/sponsors.json`. Has a name, a tier (Platinum, Gold, Silver, Bronze, Community), a logo URL, and a website URL.
- **Organizer**: A person on the organizing team for an edition. Stored in `content/editions/{year}/organizers.json`. Has a name, a role, an optional photo URL, and links.
- **FAQ Item**: A question and its answer. Stored in `content/editions/{year}/faq.json`. Has a question and an answer (which may be plain text or short Markdown).
- **Venue**: The physical location of the event for an edition. Stored in `content/editions/{year}/venue.json`. Has a name, an address, a map URL, and a list of transport hints.
- **Code of Conduct**: The behavioral expectations for the edition. Stored in `content/editions/{year}/code-of-conduct.mdx`. Rendered as Markdown.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor opening the home page on a desktop connection sees the hero, the date, and the primary CTAs in less than 2.5 seconds (largest contentful paint).
- **SC-002**: The home page achieves Lighthouse Performance >= 90, Accessibility >= 95, Best Practices >= 95, and SEO >= 95 on a desktop run.
- **SC-003**: With no speakers, no sponsors, and no schedule data, every route renders without error and shows the appropriate Spanish empty state. 100 percent of routes pass a smoke test in the empty-data scenario.
- **SC-004**: An organizer accepting a new speaker in Sessionize sees that speaker appear on the live `/speakers` page within 15 minutes (the configured revalidation window).
- **SC-005**: Adding a new edition to the site (for example, 2027) requires only adding a new folder under `content/editions/2027/` with the required files and changing the `CURRENT_EDITION` configuration; no code changes are required. This is verifiable by following the documented quickstart.
- **SC-006**: 100 percent of interactive elements on every public page are reachable and operable by keyboard, verified by a manual keyboard pass on the home and the speakers list.
- **SC-007**: The site renders correctly with `prefers-reduced-motion` enabled (no animations on countdown or transitions). Verified by a manual check.
- **SC-008**: A search engine fetching `/sitemap.xml` receives a document that lists every current-edition route and every existing past-edition route. Verified by an automated test.
- **SC-009**: The site is publicly reachable at its production domain (AWS Amplify Hosting in v1) with all routes returning a 200 response. Verified by a post-deploy smoke test (`e2e/deploy-smoke.spec.ts`) that is host-agnostic and runs against any `BASE_URL`.
