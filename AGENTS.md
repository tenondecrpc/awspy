# AGENTS.md

Guidelines for agentic coding agents operating in this repository.

## Instruction Source

`AGENTS.md` is the single source of truth for repository instructions used by agent harnesses (Claude Code, Codex, OpenCode, and similar).

`CLAUDE.md` is a thin bootstrap that defers to `AGENTS.md` and must not duplicate repository rules.

## Language

All written outputs in this repository (code comments, commit messages, PR descriptions, docs) must be in English. User-facing copy (UI strings, marketing content) is written in Spanish, since the audience is the AWS Community Day Paraguay attendee base. Keep these two surfaces clearly separated: do not mix Spanish into code comments and do not mix English into UI copy.

## Formatting

These formatting rules apply to all agent-written output in this repository.

Use ASCII punctuation by default in code, comments, commit messages, and Markdown. Do not use em dashes (`-`) or en dashes (`-`) in prose, bullet lists, headings, commit messages, plans, or code comments. Always use the plain ASCII hyphen (`-`) instead.

User-facing Spanish copy may use proper Spanish punctuation including accents and inverted question/exclamation marks (`¿`, `¡`).

Preferred example:

- `Hero section - speakers grid and schedule timeline`

## Project

AWS Community Day Paraguay is the public landing page for the local AWS user group meetup. It is a content-driven marketing site with event information (schedule, speakers, sponsors, venue, registration) plus light interactive features (registration form, talk submissions, sponsor inquiries).

This repository contains the frontend only. The backend is a separate service developed and deployed from its own repository, exposed to this app over HTTP. Treat the backend as an external dependency: the frontend must not assume any specific runtime, framework, or database on the backend side, only the documented API contract.

The site is read-heavy and SEO-sensitive. Optimize for fast first paint, accessible markup, and resilient behavior when the backend is unreachable (the static event content must still render).

## Repository Status

This repository is in early implementation. Expected layout once scaffolded:

- `app/` - Next.js App Router routes, layouts, server components
- `components/` - React components organized by atomic design tier (`atoms/`, `molecules/`, `organisms/`, `templates/`)
- `lib/` - shared utilities
- `lib/api/` - typed `fetch` client, Zod schemas, and resource modules for the external backend
- `stores/` - Zustand stores for client-side state
- `hooks/` - Reusable React hooks (TanStack Query wrappers, UI hooks)
- `tests/` - Unit and integration tests (Vitest, jsdom)
- `e2e/` - End-to-end tests (Playwright)
- `public/` - Static assets (images, OG cards, favicons)

## Core Stack

- Framework: Next.js (App Router) with TypeScript
- UI: React, atomic design component hierarchy
- Server state: TanStack Query (`@tanstack/react-query`)
- Client state: Zustand
- Backend: External HTTP API (separate repository and deployment); this repo only consumes it
- HTTP layer: native `fetch` wrapped in a typed client under `lib/api/`. Do not introduce `axios` or another HTTP library. Native `fetch` integrates with the Next.js cache (`revalidate`, `tags`, `revalidateTag`) and works in server components, route handlers, server actions, and the browser without a polyfill
- Validation: Zod for request payloads, response parsing, and form schemas. API types are derived from Zod schemas (`z.infer<typeof Schema>`), not declared separately
- Styling: Tailwind CSS (assumed default; confirm before introducing alternatives)
- Testing: Vitest for unit and integration, React Testing Library for components (jsdom environment), Playwright for end-to-end
- Tooling: ESLint, Prettier, TypeScript strict mode
- Package manager: npm (confirm with the user before switching to pnpm or yarn)

If a tool from this list is not yet installed when you need it, install it as part of the task rather than swapping it for an alternative.

## Architecture and Conventions

### Atomic Design

Components live under `components/` and are grouped by atomic tier:

- `atoms/` - smallest reusable primitives (Button, Input, Badge)
- `molecules/` - small compositions of atoms (FormField, SpeakerCard header)
- `organisms/` - section-level compositions (SpeakersGrid, ScheduleTimeline, RegistrationForm)
- `templates/` - page-level layout shells with slots for content
- Pages live in `app/` and compose templates plus organisms; pages own data fetching

A component may only depend on its own tier or lower tiers. Atoms cannot import molecules; molecules cannot import organisms. Page-level data fetching does not happen inside atoms or molecules.

### Data Layer

The data layer has three cooperating pieces. Keep them in their own roles:

1. **Typed `fetch` client** (`lib/api/client.ts`). Thin wrapper over native `fetch` that sets the base URL, default headers, attaches the auth token when present, parses JSON, maps non-2xx responses to a typed `ApiError`, and runs response payloads through a Zod schema before returning them. It is the only place that talks to the backend.
2. **Resource modules** (`lib/api/<resource>.ts`, e.g. `lib/api/speakers.ts`). One file per backend resource. Exports Zod schemas, inferred TypeScript types, and async functions (`listSpeakers`, `getSpeaker`, `createRegistration`) that call the typed client. Pure functions, no React.
3. **TanStack Query hooks** (`hooks/queries/`, `hooks/mutations/`). Wrap the resource functions in `useQuery` and `useMutation`. Own query keys, cache invalidation, and Suspense/error boundaries integration.

Rules:

- Components do not call `fetch` and do not import resource functions directly. They consume hooks (client components) or call resource functions inside server components and route handlers.
- All inbound payloads from the backend are validated with Zod at the client boundary. Do not cast (`as Foo`) without parsing first; a contract drift must surface as a runtime error, not silent corruption.
- All outbound payloads to the backend are validated with Zod before the request leaves. Forms reuse the same Zod schema for client-side validation.
- Use Next.js native cache primitives instead of inventing parallel caching. For server-side reads of static-ish content, set `fetch(..., { next: { revalidate, tags } })` or `cache: "force-cache"`. Invalidate with `revalidateTag` or `revalidatePath` from server actions.
- For mutations from forms, prefer Server Actions when the form is server-rendered and a single round trip is enough. Use TanStack Query mutations when the UI needs optimistic updates, retries, or cross-page cache invalidation.
- Route Handlers (`app/**/route.ts`) are only for cases where the browser cannot call the backend directly: webhook receivers, OG image generation, sitemap, robots, or trimming a server-only secret out of a request.
- TanStack Query owns server state. Zustand is reserved for purely client-side, ephemeral UI state (modal open state, multi-step form progress, theme). Do not duplicate server state into Zustand.
- The backend is the source of truth for what data is reachable. Sensitive credentials (admin tokens, third-party API keys) live on the backend, not in this app. The frontend only carries public configuration plus, when needed, short-lived user-scoped tokens.

### Routing and Rendering

- Default to React Server Components for content pages. Use Client Components only when interactivity (`useState`, `useEffect`, event handlers, browser-only APIs) is actually needed.
- Static event content (schedule, speakers, sponsors) should be statically rendered or revalidated on a schedule, not fetched on every request. Use `revalidate` (ISR) or `fetch` cache options to control this.
- Mutations (registration submission, talk submissions, sponsor inquiries) call the external backend through the typed API client. Validate input on the frontend with a shared schema (Zod) before sending, and treat backend validation as authoritative.

### Accessibility

The accessibility non-negotiable subset for this repo:

- No color-only state. Always pair color with text, icon, or shape.
- Every interactive element is reachable and operable by keyboard.
- Respect `prefers-reduced-motion` on animations and transitions.
- AA contrast on all text against its background.
- Semantic HTML first. Reach for ARIA only when the native element cannot express the role.
- Forms have associated labels and inline error messaging that is announced to screen readers.

### Performance

- Use `next/image` for images, with explicit width/height and appropriate `sizes`.
- Use `next/font` for self-hosted fonts; avoid blocking external font requests.
- Defer non-critical client JavaScript (dynamic import with `next/dynamic` where it materially helps).
- Lighthouse targets on the main landing route: Performance >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 on a desktop run.

### SEO and Metadata

- Every route exports `metadata` (title, description, OG, Twitter card).
- Provide an OG image for the home page and any shareable sub-routes.
- Provide `robots.txt` and `sitemap.xml` (via Next.js conventions).
- Include structured data (`Event` schema for the meetup, `Person` for speakers) where it improves discovery.

## Commands

From the repository root, once the project is scaffolded:

- Install dependencies: `npm install`
- Dev server: `npm run dev`
- Build: `npm run build`
- Start production build locally: `npm start`
- Lint: `npm run lint` (auto-fix with `npm run lint:fix`)
- Type-check: `npm run typecheck`
- Unit and integration tests: `npm test` (Vitest, single-run; `npm run test:watch` for watch mode)
- End-to-end tests: `npm run e2e` (Playwright; the dev server is started automatically by the config)

If a script does not yet exist in `package.json` when you need it, add it as part of the task rather than running raw binaries ad hoc.

## Environment and Secrets

- Public, browser-safe values go in `NEXT_PUBLIC_*` variables (for example `NEXT_PUBLIC_API_BASE_URL`).
- Server-only values (any token used to call the backend on behalf of the server, third-party API secrets used in route handlers or server actions) must not be prefixed with `NEXT_PUBLIC_` and must only be read from server components, route handlers, or server actions.
- The backend exposes its own URL and authentication contract. Read those values from environment variables, never hard-code them.
- Do not commit `.env*` files. Maintain `.env.example` with placeholder values for every variable the app reads.
- Do not log secrets, tokens, or full request bodies that may contain personal data. Do not echo environment values in error messages or telemetry.

## Testing

- Unit tests cover pure functions, hooks, and component logic.
- Component tests use React Testing Library and prefer assertions on accessible roles and visible text over implementation details.
- End-to-end tests cover the user-visible flows that matter: landing page renders, registration form submits, schedule and speakers display, navigation works on mobile and desktop viewports.
- Tests must not depend on the live backend. Mock the API client, use fixtures, or run against a local backend instance documented by the backend repository.
- Before declaring a UI change complete, run the relevant test command and load the affected page in the dev server with the feature exercised in a browser. If browser verification is not possible in the current environment, say so explicitly rather than claiming success.

## Guardrails

- Do not implement backend logic in this repository. Persistence, business rules, and integrations with external services belong in the backend repo. If a feature needs a new endpoint, file or coordinate the work there first; do not paper over a missing endpoint with a Next.js Route Handler that owns persistent state.
- Next.js Route Handlers and Server Actions in this repo are limited to: proxying or shaping requests to the backend, handling Next-specific concerns (revalidation, cookies, redirects), and serving static or computed content that has no persistent side effects.
- Do not call the backend directly from components with raw `fetch`. Always go through the typed client in `lib/api/`.
- Do not introduce `axios`, `ky`, `got`, or another HTTP library. The typed wrapper around native `fetch` is the only HTTP client in this repo.
- Do not skip Zod validation at the API boundary. Every response that crosses `lib/api/` is parsed; every request body is parsed before it leaves.
- Do not add heavy client-side libraries (charting, animation, 3D) without first checking whether the feature can be delivered with HTML, CSS, and a small amount of vanilla JS.
- Do not introduce server state into Zustand. TanStack Query owns server state; Zustand owns ephemeral client state.
- Do not violate the atomic design dependency direction (atoms cannot import molecules, etc.).
- Do not commit generated artifacts (`.next/`, `node_modules/`, build output) or environment files.
- Do not ship copy in placeholder English when the surface is user-facing; coordinate with the user before adding text that will be visible to attendees.
- Avoid premature abstraction. Three similar components are fine; extract a shared atom or molecule only when a third use case clarifies the right shape.

## Verification

- For any change, run `npm run lint` and `npm run typecheck` before reporting completion.
- For component or page changes, run the relevant test command (`npm test` or scoped Vitest invocation) and exercise the page in the dev server.
- For data layer changes (TanStack Query hooks, API client, request/response types), include a note in the PR description describing the verification steps used (request observed in network panel, error states exercised, types aligned with backend contract version, etc.).
- For changes that depend on a backend update, link the corresponding backend PR or issue in the description and do not merge until the backend change is available in the relevant environment.
- For accessibility-relevant changes, manually verify the non-negotiable subset (keyboard reachability, no color-only state, reduced motion, AA contrast).
- For visual changes, include a screenshot or a short note describing what was manually verified.

## References

- Bootstrap for Claude Code: `CLAUDE.md`
- Next.js routes and layouts: `app/`
- API client and backend contract types: `lib/api/`
