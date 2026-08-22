<!--
SYNC IMPACT REPORT
==================
Version change: 1.1.0 -> 1.1.1
Bump rationale: Record the completed Node.js 24 and secure dependency baseline
without changing any governing principle. This is a PATCH amendment.

Principles retained and clarified:
- I. Frontend-Only Boundary (NON-NEGOTIABLE)
- II. Atomic Design Layering
- III. Typed API Boundary with Zod Validation (NON-NEGOTIABLE)
- IV. State Layering (Server vs Client)
- V. Server-First, Statically Rendered Content
- VI. Accessibility Non-Negotiables (NON-NEGOTIABLE)
- VII. Language and Formatting Discipline

Material changes:
- Removed references to a separate application backend that does not exist.
- Named local content and Sessionize as the implemented data sources.
- Added `npm run verify` and `npm run verify:e2e` as portable gates.
- Added GitHub CI, ADR, and documented-exception governance.
- Frozen CLAUDE.md as a thin AGENTS.md bootstrap.
- Closed GAP-001 after upgrading the runtime and dependencies and obtaining a
  zero-finding `npm audit` result.

Templates and dependent artifacts reviewed:
- .specify/templates/plan-template.md - aligned (no edits needed); the existing
  "Constitution Check" gate now has concrete principles to evaluate against.
- .specify/templates/spec-template.md - aligned (no edits needed); spec scope
  remains user-stories + functional requirements.
- .specify/templates/tasks-template.md - aligned (no edits needed); existing
  task categorization (Setup, Foundational, per-Story, Polish) does not conflict
  with the principles introduced here.
- .specify/templates/checklist-template.md - aligned (no edits needed).
- .specify/templates/agent-file-template.md - aligned (no edits needed); the
  authoritative agent guidance lives in AGENTS.md, which this constitution
  codifies but does not duplicate.
- AGENTS.md / CLAUDE.md - updated to align repository instructions and preserve
  the frozen bootstrap boundary.
- docs/README.md, docs/architecture.md, docs/ci.md, docs/decisions/, and
  docs/documented-exceptions.md - added as the project-context layer.

Status legend: [updated] / [pending]
- [updated] .specify/memory/constitution.md (this file)
- [updated] .specify/templates/plan-template.md (no change required, verified compatible)
- [updated] .specify/templates/spec-template.md (no change required, verified compatible)
- [updated] .specify/templates/tasks-template.md (no change required, verified compatible)
- [updated] .specify/templates/checklist-template.md (no change required, verified compatible)
- [updated] AGENTS.md (source of truth and verification rules)
- [updated] CLAUDE.md (frozen bootstrap importing AGENTS.md)
- [updated] package.json and provider CI configuration

Deferred items / TODOs:
- None. Resolved exceptions and gaps remain recorded in
  docs/documented-exceptions.md for traceability.
-->

# AWS Community Day Paraguay Frontend Constitution

The frontend for the AWS Community Day Paraguay landing site is a
content-driven, SEO-sensitive marketing application. Local JSON and MDX own
static editorial content, while the public Sessionize API owns speakers and
schedule data. This constitution captures the non-negotiable rules that govern
how code is structured, how data flows, and how changes are verified. It is
derived from `AGENTS.md` and takes precedence over any conflicting convention
introduced elsewhere.

## Core Principles

### I. Frontend-Only Boundary (NON-NEGOTIABLE)

This repository ships only the frontend and has no application backend or
database. Persistence and private third-party integrations MUST NOT be added
without a separately approved backend architecture.

- Next.js Route Handlers and Server Actions are restricted to proxying or
  shaping requests, handling Next-specific concerns
  (revalidation, cookies, redirects), and serving static or computed content
  with no persistent side effects.
- A feature that needs persistence or private credentials MUST be designed as a
  separate service. It MUST NOT be papered over with a Route Handler that owns
  persistent state.
- The frontend carries public configuration only. Third-party secrets MUST NOT
  be introduced without an approved server-side boundary.

**Rationale**: A strict frontend-only boundary keeps the deployment surface
small and prevents secret leakage through browser-visible configuration.

### II. Atomic Design Layering

Components live under `components/` and are grouped by atomic tier: `atoms/`,
`molecules/`, `organisms/`, `templates/`. Pages live in `app/` and compose
templates plus organisms.

- A component MAY depend only on its own tier or lower tiers. Atoms MUST NOT
  import molecules; molecules MUST NOT import organisms.
- Page-level data fetching MUST NOT happen inside atoms or molecules. Pages own
  data fetching; lower tiers receive data through props.
- Premature abstraction is rejected. Three similar components are acceptable;
  a shared atom or molecule is extracted only when a third use case clarifies
  the right shape.

**Rationale**: Strict tier dependency direction keeps the component graph
acyclic, makes composition predictable, and protects reusable primitives from
being polluted by page-specific concerns.

### III. Typed API Boundary with Zod Validation (NON-NEGOTIABLE)

All external API traffic flows through the typed `fetch` client in
`lib/api/client.ts`. Components MUST NOT call `fetch` directly and MUST NOT
import resource functions from outside their declared role.

- Inbound payloads from Sessionize or any future external service MUST be parsed with a Zod schema at the
  client boundary. Type assertions (`as Foo`) without parsing are forbidden;
  contract drift MUST surface as a runtime error, not silent corruption.
- There are no outbound application API payloads today. Any future outbound
  payload MUST be parsed with Zod before the request leaves.
- API types MUST be derived from Zod schemas via `z.infer<typeof Schema>`, not
  declared separately.
- The HTTP layer is native `fetch` wrapped by the typed client. Introducing
  `axios`, `ky`, `got`, or any other HTTP library is forbidden.
- The data layer has three roles and they MUST stay separated:
  1. Typed `fetch` client (`lib/api/client.ts`) - validates external responses.
  2. Sessionize resource module (`lib/api/sessionize.ts`) - pure async functions,
     Zod schemas, and inferred types, with no React.
  3. Local content modules (`lib/content/`) - validated JSON and MDX loaders.
- TanStack Query is installed for a future client-side fetch path but is not
  part of the current server-rendered data flow.

**Rationale**: A single validated boundary catches contract drift early, keeps
type definitions colocated with runtime guarantees, and prevents the data layer
from leaking into UI tiers.

### IV. State Layering (Server vs Client)

Server state and ephemeral client state are owned by different libraries and
MUST NOT be conflated.

- TanStack Query owns client-cached server state if introduced (anything originating from an external service, its
  cache, invalidation, retries, and Suspense integration).
- Zustand is reserved for purely client-side, ephemeral UI state (modal open
  state, multi-step form progress, theme).
- External server state MUST NOT be duplicated into Zustand. If a future value
  is loaded through TanStack Query, it stays in the Query cache.
- Registration, CFP, and sponsor inquiry flows remain external links or
  `mailto:` actions. Adding a mutation flow requires an architecture decision.

**Rationale**: Mixing the two state layers produces stale-cache bugs that are
hard to localize. Keeping the boundary explicit makes data flow auditable.

### V. Server-First, Statically Rendered Content

The site is read-heavy and SEO-sensitive. Rendering decisions MUST default to
server-side and static.

- React Server Components are the default for content pages. Client Components
  are introduced only when interactivity (`useState`, `useEffect`, event
  handlers, browser-only APIs) is actually required.
- Static event content (schedule, speakers, sponsors) MUST be statically
  rendered or revalidated on a schedule, not fetched on every request. Use
  Next.js native cache primitives (`fetch(..., { next: { revalidate, tags } })`,
  `cache: "force-cache"`) and invalidate via `revalidateTag` or
  `revalidatePath`. Parallel custom caching layers MUST NOT be introduced.
- The static event content MUST still render when Sessionize is unreachable.
  Resilience to external outage is a functional requirement, not a stretch goal.
- Every route MUST export `metadata` (title, description, OG, Twitter card).
  `robots.txt`, `sitemap.xml`, and OG images MUST follow Next.js conventions.
  Structured data (`Event`, `Person`) SHOULD be included where it improves
  discovery.
- Lighthouse targets on the main landing route on a desktop run: Performance
  >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95. Use `next/image`
  with explicit width/height and `next/font` for self-hosted fonts. Defer
  non-critical client JavaScript via `next/dynamic` when it materially helps.

**Rationale**: Marketing pages live or die by first paint and discoverability.
Static rendering plus Next.js native caching delivers both without a parallel
infrastructure of custom caches.

### VI. Accessibility Non-Negotiables (NON-NEGOTIABLE)

The following accessibility rules are not optional and apply to every shipped
surface:

- No color-only state. Color MUST always be paired with text, icon, or shape.
- Every interactive element MUST be reachable and operable by keyboard.
- Animations and transitions MUST respect `prefers-reduced-motion`.
- All text MUST meet AA contrast against its background.
- Semantic HTML is the default. ARIA is reached for only when no native element
  expresses the role.
- Forms MUST have associated labels and inline error messaging that is
  announced to screen readers.

**Rationale**: The audience includes attendees with diverse abilities and
devices. These rules are inexpensive at design time and prohibitively expensive
to retrofit; codifying them prevents the usual erosion.

### VII. Language and Formatting Discipline

Two surfaces, two languages, no mixing.

- All written outputs in this repository (code, comments, identifiers, commit
  messages, PR descriptions, internal docs) MUST be in English.
- User-facing copy (UI strings, marketing content) MUST be in Spanish, since
  the audience is the AWS Community Day Paraguay attendee base. Spanish copy
  MAY use proper Spanish punctuation including accents and inverted
  question/exclamation marks (`¿`, `¡`).
- Placeholder English in user-facing surfaces MUST NOT be shipped; Spanish copy
  is coordinated with the user before merge.
- Agent-written prose (commits, plans, comments, Markdown) MUST use ASCII
  punctuation. Em dashes and en dashes are forbidden in prose; the plain ASCII
  hyphen is the only dash used.

**Rationale**: A bilingual codebase without an explicit boundary degrades into
mixed-language identifiers, untranslated UI, or accented characters in commit
messages that break tooling. The two-surface rule keeps both clean.

## Stack and Tooling Constraints

The technology stack is fixed. Substitutions require an amendment to this
constitution; they are not a routine pull-request decision.

- Framework: Next.js (App Router) with TypeScript in strict mode.
- UI: React, atomic design component hierarchy.
- Server state: TanStack Query (`@tanstack/react-query`).
- Client state: Zustand (ephemeral UI state only).
- HTTP layer: native `fetch` wrapped by the typed client under `lib/api/`.
  Alternative HTTP libraries are forbidden.
- Validation: Zod, used for request payloads, response parsing, and form
  schemas. Types are inferred from schemas.
- Styling: Tailwind CSS. Alternatives require explicit confirmation.
- Testing: Vitest (jsdom) plus React Testing Library for unit and integration;
  Playwright for end-to-end.
- Tooling: ESLint, Prettier, TypeScript strict mode.
- Package manager: npm. Switching to pnpm or yarn requires explicit
  confirmation by the user.
- Heavy client-side libraries (charting, animation, 3D) MUST NOT be introduced
  without first verifying that HTML, CSS, and a small amount of vanilla JS
  cannot deliver the feature.
- If a tool from this list is missing when needed, install it as part of the
  task; do not substitute an alternative.

Environment and secrets:

- Public, browser-safe values use `NEXT_PUBLIC_*` (e.g., `NEXT_PUBLIC_API_BASE_URL`).
- Server-only values MUST NOT be prefixed with `NEXT_PUBLIC_` and MUST be read
  only from server components, route handlers, or server actions.
- External service URLs are read from documented environment variables or
  stable public-provider defaults; private credentials are not part of the
  current application contract.
- `.env*` files MUST NOT be committed. `.env.example` MUST list every variable
  the app reads with placeholder values.
- Secrets, tokens, and personally identifying request bodies MUST NOT be
  logged. Environment values MUST NOT be echoed in error messages or telemetry.
- Generated artifacts (`.next/`, `node_modules/`, build output) MUST NOT be
  committed.

## Verification Workflow

Before any change is reported complete:

- `npm run verify` MUST pass. It is the repository-owned contract for format,
  lint, type checking, unit and component tests, secret scanning, and build.
- For component or page changes, the relevant Vitest invocation MUST be run
  and the affected page exercised in the dev server in a real browser. If
  browser verification is not possible in the current environment, that MUST
  be stated explicitly; success MUST NOT be claimed otherwise.
- For data layer changes, the PR description MUST describe the verification
  steps used, error states exercised, and alignment with the external contract.
- For changes that depend on an external provider update, the PR description
  MUST link the corresponding issue or configuration change.
- For accessibility-relevant changes, the non-negotiable subset (keyboard
  reachability, no color-only state, reduced motion, AA contrast) MUST be
  manually verified.
- For visual changes, a screenshot or short note describing the manual
  verification MUST be included.
- Tests MUST NOT depend on live Sessionize data. They use the typed client
  mocked or committed fixtures.

The repository commands assumed to exist (and to be added to `package.json` as
part of any task that needs them):

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Start: `npm start`
- Lint: `npm run lint` (auto-fix: `npm run lint:fix`)
- Type-check: `npm run typecheck`
- Unit and integration: `npm test` (watch: `npm run test:watch`)
- End-to-end: `npm run e2e`
- Format: `npm run format` (check: `npm run format:check`)
- Secret scan: `npm run secretlint`
- Portable gate: `npm run verify`
- Full release gate: `npm run verify:e2e`

## Governance

This constitution supersedes ad hoc conventions. Where it conflicts with code
style guides, individual preferences, or PR-time judgment calls, this document
wins. Where it conflicts with `AGENTS.md`, the documents MUST be reconciled by
amendment in the same change set; they are intended to remain consistent.

Amendment procedure:

1. A proposed amendment MUST be raised in a pull request that edits this file
   and any dependent templates (`.specify/templates/*.md`) and runtime guidance
   (`AGENTS.md`, `README.md`, and project context under `docs/`) in the same
   change set. `CLAUDE.md` remains a frozen bootstrap unless restoration is
   required.
2. The PR description MUST state the version bump (MAJOR / MINOR / PATCH) and
   the rationale.
3. The PR MUST update the Sync Impact Report comment at the top of this file
   to reflect the change.

Versioning policy (semantic):

- MAJOR: Backward-incompatible governance or principle removal/redefinition
  (e.g., dropping a NON-NEGOTIABLE rule, replacing the stack lockdown).
- MINOR: A new principle or section is added, or existing guidance is
  materially expanded.
- PATCH: Clarifications, wording, typo fixes, non-semantic refinements.

Compliance review:

- Every pull request MUST verify compliance with the principles above. The
  Constitution Check section in `plan-template.md` is the standing gate;
  reviewers MUST flag deviations.
- Complexity that violates a principle MUST be justified in writing in the PR
  (use the Complexity Tracking table in `plan-template.md`) and accepted only
  when the simpler alternative is documented and rejected with cause.
- Runtime development guidance for agent harnesses lives in `AGENTS.md`, with
  `CLAUDE.md` deferring to it. This constitution defines the rules; `AGENTS.md`
  describes how to apply them day to day.

**Version**: 1.1.1 | **Ratified**: 2026-05-06 | **Last Amended**: 2026-08-21
