# AGENTS.md

Guidelines for agentic coding agents operating in this repository.

## Instruction Source

`AGENTS.md` is the single source of truth for repository instructions used by agent harnesses (Claude Code, Codex, OpenCode, and similar).

`CLAUDE.md` is a thin bootstrap that defers to `AGENTS.md` and must not duplicate repository rules.

`CLAUDE.md` is frozen in that bootstrap shape. Tool-specific instruction files
added in the future must point here rather than fork repository rules.

Mutable project context does not belong in agent bootstraps. Start at
`docs/README.md` for architecture, CI, deployment, ADRs, and approved
exceptions.

## Language

All written outputs in this repository (code comments, commit messages, PR descriptions, docs) must be in English. User-facing copy (UI strings, marketing content) is written in Spanish, since the audience is the AWS Community Day Paraguay attendee base. Keep these two surfaces clearly separated: do not mix Spanish into code comments and do not mix English into UI copy.

## Formatting

These formatting rules apply to all agent-written output in this repository.

Use ASCII punctuation by default in code, comments, commit messages, and Markdown. Do not use em dashes (`-`) or en dashes (`-`) in prose, bullet lists, headings, commit messages, plans, or code comments. Always use the plain ASCII hyphen (`-`) instead.

User-facing Spanish copy may use proper Spanish punctuation including accents and inverted question/exclamation marks (`¿`, `¡`).

Preferred example:

- `Hero section - speakers grid and schedule timeline`

Code comments explain non-obvious reasons, constraints, or external quirks.
They do not restate what the code already expresses. Commit messages use a
short Conventional Commits prefix such as `feat:`, `fix:`, `docs:`, or
`chore:` and do not include tool-attribution trailers.

## Project

AWS Community Day Paraguay is the public landing page for the local AWS user group meetup. It is a content-driven marketing site with event information (schedule, speakers, sponsors, venue, registration) plus light interactive features and external calls to action for registration, talk submissions, and sponsor inquiries.

This repository contains the frontend only and has no application backend or database. Event content is version-controlled under `content/editions/{year}/`, speakers and schedule data come from the public Sessionize API, and talk submissions are delegated to Sessionize. The attendee registration provider is not finalized; the current Eventbrite link adapter is optional and remains unconfigured for the 2026 edition.

The site is read-heavy and SEO-sensitive. Optimize for fast first paint, accessible markup, and resilient behavior when Sessionize is unreachable (the static event content must still render).

## Repository Status

This repository contains an implemented Next.js application with the following layout:

- `app/` - Next.js App Router routes, layouts, server components
- `components/` - React components organized by atomic design tier (`atoms/`, `molecules/`, `organisms/`, `templates/`)
- `lib/` - shared utilities
- `lib/api/` - typed `fetch` client and Zod-validated Sessionize resource module
- `stores/` - optional Zustand stores for future client-side state
- `hooks/` - optional reusable React hooks if client-side data fetching is introduced
- `tests/` - Unit and integration tests (Vitest, jsdom)
- `e2e/` - End-to-end tests (Playwright)
- `public/` - Static assets (images, OG cards, favicons)

## Core Stack

- Framework: Next.js (App Router) with TypeScript
- UI: React, atomic design component hierarchy
- Server state: TanStack Query (`@tanstack/react-query`), installed for future client-side fetching but not required by the current server-rendered content paths
- Client state: Zustand, reserved for future ephemeral UI state
- External data: public Sessionize JSON endpoints plus version-controlled local content; no application backend
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

1. **Typed `fetch` client** (`lib/api/client.ts`). Thin wrapper over native `fetch` that sets headers, parses JSON, maps non-2xx responses to typed errors, and validates response payloads with Zod.
2. **Sessionize resource module** (`lib/api/sessionize.ts`). Exports the Zod schemas, inferred types, and pure async functions used to load public speakers, sessions, and schedule data.
3. **Local content modules** (`lib/content/`). Read and validate edition content stored in JSON and MDX. Pages compose local content with Sessionize data.

TanStack Query is installed but is not part of the current server-rendered read path. If client-side fetching is introduced, hooks under `hooks/queries/` and `hooks/mutations/` own query keys, cache invalidation, and error integration.

Rules:

- Components do not call `fetch` and do not import resource functions directly. Client components consume hooks if introduced; server pages and route handlers may call resource functions.
- All inbound Sessionize payloads are validated with Zod at the API boundary. Do not cast (`as Foo`) without parsing first; contract drift must surface as a runtime error or an intentional empty-state fallback.
- There are no outbound application API payloads today. Any future outbound payload must be validated with Zod before it leaves the application.
- Use Next.js native cache primitives instead of inventing parallel caching. For server-side reads of static-ish content, set `fetch(..., { next: { revalidate, tags } })` or `cache: "force-cache"`. Invalidate with `revalidateTag` or `revalidatePath` from server actions.
- Route Handlers (`app/**/route.ts`) are only for Next.js-specific concerns such as webhook receivers, OG image generation, sitemap, robots, or shaping requests without owning persistent state.
- TanStack Query owns server state. Zustand is reserved for purely client-side, ephemeral UI state (modal open state, multi-step form progress, theme). Do not duplicate server state into Zustand.
- Sessionize is the source of truth for published speakers and schedule data. Version-controlled files are the source of truth for edition metadata and static content. Do not place sensitive third-party credentials in this repository.

### Routing and Rendering

- Default to React Server Components for content pages. Use Client Components only when interactivity (`useState`, `useEffect`, event handlers, browser-only APIs) is actually needed.
- Static event content (schedule, speakers, sponsors) should be statically rendered or revalidated on a schedule, not fetched on every request. Use `revalidate` (ISR) or `fetch` cache options to control this.
- Registration, talk submissions, and sponsor inquiries are external links or `mailto:` actions. Do not add local persistence for these flows without a separate approved architecture change.

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
- Format: `npm run format` (check only: `npm run format:check`)
- Secret scan: `npm run secretlint`
- Portable verification gate: `npm run verify`
- Full release gate including Playwright: `npm run verify:e2e`

If a script does not yet exist in `package.json` when you need it, add it as part of the task rather than running raw binaries ad hoc.

## Environment and Secrets

- Public, browser-safe values go in `NEXT_PUBLIC_*` variables (for example `NEXT_PUBLIC_API_BASE_URL`).
- Server-only third-party secrets, if introduced in an approved future change, must not be prefixed with `NEXT_PUBLIC_` and must only be read from server components, route handlers, or server actions.
- Do not commit `.env*` files. Maintain `.env.example` with placeholder values for every variable the app reads.
- Do not log secrets, tokens, or full request bodies that may contain personal data. Do not echo environment values in error messages or telemetry.
- `npm run secretlint` scans repository content except the explicit tool and build exclusions in `.secretlintignore`. It is a safety net, not permission to place secrets in a file temporarily.

## Testing

- Unit tests cover pure functions, hooks, and component logic.
- Component tests use React Testing Library and prefer assertions on accessible roles and visible text over implementation details.
- End-to-end tests cover the user-visible flows that matter: landing page renders, registration state and external CTA behave correctly, schedule and speakers display, and navigation works on mobile and desktop viewports.
- Tests must not depend on live Sessionize data. Mock the API client or use the committed fixtures.
- Before declaring a UI change complete, run the relevant test command and load the affected page in the dev server with the feature exercised in a browser. If browser verification is not possible in the current environment, say so explicitly rather than claiming success.

## Guardrails

- Do not implement persistent backend logic in this repository. If a future feature needs persistence or private third-party integrations, approve and coordinate a separate backend service first.
- Next.js Route Handlers and Server Actions in this repo are limited to proxying or shaping requests, handling Next-specific concerns (revalidation, cookies, redirects), and serving static or computed content without persistent side effects.
- Do not call external APIs directly from components with raw `fetch`. Always go through the typed client in `lib/api/`.
- Do not introduce `axios`, `ky`, `got`, or another HTTP library. The typed wrapper around native `fetch` is the only HTTP client in this repo.
- Styling colors in `app/`, `components/`, and `lib/` must use the semantic tokens defined in `app/globals.css`. Do not add color literals outside the documented Open Graph renderer exception. See `specs/002-visual-refresh/contracts/palette-tokens.md`.
- Do not skip Zod validation at the API boundary. Every response that crosses `lib/api/` is parsed; every request body is parsed before it leaves.
- Do not add heavy client-side libraries (charting, animation, 3D) without first checking whether the feature can be delivered with HTML, CSS, and a small amount of vanilla JS.
- Do not introduce server state into Zustand. TanStack Query owns server state; Zustand owns ephemeral client state.
- Do not violate the atomic design dependency direction (atoms cannot import molecules, etc.).
- Do not commit generated artifacts (`.next/`, `node_modules/`, build output) or environment files.
- Do not ship copy in placeholder English when the surface is user-facing; coordinate with the user before adding text that will be visible to attendees.
- Avoid premature abstraction. Three similar components are fine; extract a shared atom or molecule only when a third use case clarifies the right shape.
- Do not add a material runtime dependency, external platform, persistence mechanism, or deployment path without recording the rationale in `docs/decisions/`.
- A deliberate rule deviation is valid only when recorded in `docs/documented-exceptions.md` with scope, reason, mitigation, approval, and a retirement condition.
- Never run a mutating AWS, Amplify, Route 53, or GitHub command unless the user explicitly asks for that state change. Read-only inspection is allowed.

## Verification

- `npm run verify` is the repository-owned quality contract. Run it before reporting a change complete, or state exactly which check could not run and why.
- For component or page changes, run the relevant test command (`npm test` or scoped Vitest invocation) and exercise the page in the dev server.
- For data layer changes (TanStack Query hooks, API client, request/response types), include a note in the PR description describing the verification steps used, error states exercised, and alignment with the external contract.
- For changes that depend on an external service update, link the corresponding issue or provider configuration change and do not merge until it is available in the relevant environment.
- For accessibility-relevant changes, manually verify the non-negotiable subset (keyboard reachability, no color-only state, reduced motion, AA contrast).
- For visual changes, include a screenshot or a short note describing what was manually verified.

GitHub Actions and AWS Amplify must call `npm run verify` rather than duplicate
its individual commands. Playwright remains the separate release-level gate in
`npm run verify:e2e`.

## Documentation and Decisions

- `README.md` is the contributor entry point.
- `docs/README.md` indexes mutable project context.
- `docs/architecture.md` describes the implemented system, not desired future state.
- `docs/ci.md` describes the portable verification contract and provider wiring.
- `docs/deployment.md` owns Amplify and Route 53 operations.
- `docs/decisions/` contains immutable Architecture Decision Records. Supersede an accepted ADR with a new ADR rather than rewriting history.
- `docs/documented-exceptions.md` contains approved deviations and open gaps. A gap does not authorize indefinite production use.
- `specs/` owns feature requirements, plans, and task history. Keep `spec.md`, `plan.md`, and `tasks.md` aligned when implementation changes their assumptions.

## References

- Bootstrap for Claude Code: `CLAUDE.md`
- Next.js routes and layouts: `app/`
- API client and external contract types: `lib/api/`
- Documentation index: `docs/README.md`

## Active Technologies
- TypeScript 5.x (strict mode), Node.js 20.x runtime + Next.js 16.2.5 (App Router, Server Components), React 19.2.4, Tailwind CSS 4.x, Zod 4.x, TanStack Query 5.x (provider already installed; only used if/when client-side fetching becomes necessary), Zustand 5.x (only used for ephemeral UI state if/when needed), and `@next/mdx` for code-of-conduct rendering (001-community-day-site)
- None. Content lives in version-controlled JSON/MDX under `content/editions/{year}/`. No database or external persistence in this repository (001-community-day-site)

## Recent Changes
- 001-community-day-site: Added TypeScript 5.x (strict mode), Node.js 20.x runtime + Next.js 16.2.5 (App Router, Server Components), React 19.2.4, Tailwind CSS 4.x, Zod 4.x, TanStack Query 5.x (provider already installed; only used if/when client-side fetching becomes necessary), Zustand 5.x (only used for ephemeral UI state if/when needed), and `@next/mdx` for code-of-conduct rendering
