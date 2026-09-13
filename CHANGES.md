# CHANGES — design migration to the "AWS Community Day Paraguay (colored)" mockups

This log tracks the migration of the live site to the design in the
`AWS Community Day Paraguay (colored)/` folder (the `*.dc.html` mockups). Its
specific purpose, per request, is to record **any change that leaves the site
without a page, section, or piece of functionality** it had before — so nothing
is silently lost.

## How to read this

- **Adopted** — mockup design applied to the live component, functionality kept.
- **Lost / regressed** — a page, section, or feature the site had that the
  mockup does not include, or that had to be dropped/paused to apply the design.
- **Deferred** — planned but not yet done.
- **Decision** — a judgement call where the mockup and the current site disagreed.

## Important context about the mockups

The `.dc.html` files are **design references only**. They run on a client-side
design runtime (`support.js` loads React + Babel from a CDN and interprets
custom `{{ }}` / `sc-for` / `image-slot` template tags). They are not importable
into the Next.js app, so the migration **re-implements their visual design** in
the existing React / Tailwind / design-token components. Functionality (content
loading, Sessionize, Eventbrite, i18n copy, error/empty states, accessibility,
the AA contrast gate, tests) is preserved unless explicitly listed under
"Lost / regressed".

---

## Decisions

- **D1 — Palette supersedes the mid-session "squid-ink" direction.** Earlier this
  session the palette was moved to Squid Ink surfaces + Amazon Orange. The
  mockups instead use a **navy/white base** (`#01051d` dark, white/`#f6f7fb`
  light, navy `#08152f` text, blue `#0038a8`/`#74a8ff` links) with **Amazon
  Orange `#ff9900`** as the CTA/accent fill (navy text on it). The mockups are
  now the source of truth, so surfaces revert from squid ink to the navy/white
  base and orange is scoped to CTAs/accents. The AA contrast gate
  (`tests/unit/lib-utils-tokens.test.ts`) is kept green.
- **D2 — Default theme = light (resolved).** The site defaults to **light**:
  `app/layout.tsx` sets `data-theme="light"` server-side and its init script
  falls back to `light` when nothing is stored, so a dark OS setting never
  flips the site on its own. A choice stored by the header toggle still wins.
  The dual-theme tokens and the header `ThemeToggle` are in place, so dark is
  reachable and switching works; the redesigned pages have **not** been visually
  tuned against the dark palette yet, though every semantic token has a dark
  value and the AA contrast gate covers both modes.

## Decisions

- **D4 — Ground-up rebuild (supersedes the "adapt existing components" approach).**
  Per request, pages are now **rebuilt from scratch to reproduce each `*.dc.html`
  mockup 1:1** (same sections, order, colors, spacing) instead of bending the
  old atomic-design components to fit. Only the data/functionality layer is
  reused (content loaders, Sessionize, Eventbrite, routing, metadata, the live
  Countdown, and the Kiro ghost). Presentational components are replaced as
  their pages are rebuilt; their obsolete tests are removed.
  - **Home** (`components/templates/HomeTemplate.tsx`) fully rebuilt from
    `Home Light.dc.html`: hero, AWS-icon marquee, stats, "Qué es el Community
    Day", agenda-at-a-glance, speakers, sede (navy), FAQ, equipo, sponsors, and
    "tres formas" — exact tokens/spacing. Live data wired: countdown, speakers
    (Sessionize), sponsors + FAQ + organizers (content), and the expected-figures
    band (`event.json` `expectedFigures`, which the rebuild had briefly
    hard-coded). The remaining overview copy (pillars, agenda glance, "tres
    formas") matches the mockup verbatim.
  - Shared section primitives live in `components/molecules/SectionPrimitives.tsx`
    and the mascot shader in `components/atoms/MeshGradientSVG.tsx`. They were
    first added under `components/site/` and `components/ui/`, which sit outside
    the atomic-design tiers the repository documents in
    `docs/architecture/COMPONENTS.md`; moving them keeps the dependency
    direction templates → organisms → molecules → atoms intact. The home page
    now composes those primitives instead of restating private copies of them.
  - New token `--color-surface-warm` `#fff6e8` (the mockup's cream panels) and
    the `acd-marquee` keyframes were added; marquee icons copied to
    `public/assets/icons/`.
  - `templates-home-figures.test.tsx` and `templates-home-links.test.tsx` were
    removed during the rebuild and have since been **restored against the new
    home**: the first covers the expected-figures band, the second asserts that
    no internal link on an archived edition escapes into the current one. The old
    `Hero`, `SectionHeading`, `StatTile` etc. are no longer used by the home
    (still used by not-yet-rebuilt inner pages).

## Adopted

- **All inner-page templates rebuilt from their mockups (1:1).** Each page route
  and its `editions/[year]` variant render a shared Template in
  `components/templates/`; rebuilding the Template (props signature unchanged)
  rebuilt both variants without touching data loaders or `page.tsx`. Rebuilt:
  `SpeakersTemplate` (Speakers.dc.html), `SpeakerDetailTemplate` (Speaker),
  `ScheduleTemplate` (Agenda), `SponsorsTemplate` (Sponsors), `TeamTemplate`
  (Equipo), `VenueTemplate` (Sede), `FAQTemplate` (FAQ), `RegisterTemplate`
  (Registro), `CFPTemplate` (CFP), `EditionsIndexTemplate` (Ediciones),
  `CodeOfConductTemplate` (Codigo-de-Conducta), and `VolunteersTemplate`
  (restyled to the new look; no mockup exists for it). All use the shared
  `components/site/primitives.tsx` (WRAP, PageHeader, NumberHeading, Frame) and
  design tokens only. Real data + functionality preserved: Sessionize
  speakers/schedule, Eventbrite register button, Sessionize CFP callout,
  content-driven sponsors/FAQ/organizers/venue/editions/code-of-conduct,
  volunteer form link, empty states, status logic, JSON-LD, external-link
  `target`/`rel`, and the single `#contenido-principal` skip target per page.
  Verified whole-project: typecheck ✓, lint ✓, `next build` ✓ (43 routes),
  AA token gate 112/112, suite 457 passing (only the 10 pre-existing Windows
  path-separator failures remain).
- **Shared primitives** added at `components/site/primitives.tsx` (WRAP,
  SECTION_BORDER, NUM/H2/RULE, NumberHeading, PageHeader, Frame) so every
  rebuilt page stays consistent and DRY.

## Adopted (earlier)

- **Exact-color pass (1:1 with the mockups).** Tokens and components were
  aligned to the mockups' literal hexes rather than close approximations:
  - `--color-accent` `#0a4db8` → **`#0038a8`**, `--color-accent-strong`
    `#00368f` → **`#002b7a`** (mockup body-link blue + hover), and
    `--color-glow-accent` to match.
  - `--color-surface-inverse` `#041a53` → **`#08152f`** (exact mockup footer /
    badge navy), in light and both dark blocks.
  - New dark-island tokens for the navy footer (same in every theme, matching
    the mockup): `--color-text-on-inverse-secondary` `#c5ccea`,
    `--color-text-on-inverse-muted` `#9aa5ca`, `--color-link-on-inverse`
    `#e6eaf7`, `--color-border-on-inverse` `#34415f`.
  - **Header CTA** is now navy (`surface-inverse`) with white text and an
    orange hover — exactly the mockup, not the orange fill used before.
  - **Header/hero** now use the mockup's navy `#08152f` hairline borders.
  - **NavLink**: inactive `#34415f`, hover/active navy `#08152f` with a navy
    underline rule (matches the mockup's border-bottom active state).
  - **Hero title** now renders the mockup's exact three lines — AWS /
    Community Day / **Paraguay** (orange) — and the countdown is the mockup's
    inline "Faltan N días" (a new `variant="inline"` on `Countdown`) instead of
    the grid card.
  - Footer link/heading/tagline/disclaimer/border shades now use the exact
    on-inverse tokens above. AA token gate still 112/112.
- **Design tokens (palette).** `app/globals.css` reset to the mockup color
  family and orange CTAs layered on top:
  - Light: white/`#f6f7fb` surfaces, navy `#08152f` text, blue `#0038a8` links,
    `#eef2fd` panels, `#dfe4f2` borders, green `#1f7a3a`.
  - Dark: `#01051d` navy canvas, `#071438`/`#0d1b46` surfaces, `#f7f8ff` text,
    blue `#74a8ff` links, red `#ff4b5b`.
  - **Amazon Orange `#ff9900`** is now `--color-action`/CTA in both modes, with
    **navy text on orange** (`--color-text-on-action` = `#08152f` light,
    `#000c2f` dark) and orange glow. `--color-accent` stays blue for links.
  - Verified: `tests/unit/lib-utils-tokens.test.ts` (AA gate) passes 112/112 in
    both modes; typecheck, lint, and `next build` all pass.
- **Open Graph image** (`app/opengraph-image.tsx`) realigned to the mockup dark
  hero: navy `#01051d` background, white text, Amazon-Orange year badge with
  navy text.
- **Tooling: the mockup folder is excluded from the app toolchain.** The
  `AWS Community Day Paraguay (colored)/` folder shipped a full snapshot of the
  repo under `uploads/awspy/` (including tests and Playwright e2e specs), which
  vitest/tsc were picking up (double-running unit tests and erroring on the
  Playwright specs). It is now excluded from vitest (`vitest.config.mts`),
  TypeScript (`tsconfig.json`), ESLint (`eslint.config.mjs`), and Prettier
  (new `.prettierignore`). After exclusion the suite is back to 470 tests.
- **Default theme → light** (`app/layout.tsx`). Light-first per request; the
  ThemeToggle and dark tokens remain (dark not yet styled to the mockups).
- **SiteHeader rebuilt to the mockup** (`components/organisms/SiteHeader.tsx`):
  light sticky bar, brand + EditionPill, condensed primary nav, and an
  Amazon-Orange **Registrarme** CTA button. Preserved: skip link
  (`#contenido-principal`), `Navegación principal` label, ThemeToggle, and the
  accessible mobile drawer (Abrir/Cerrar menú, focus management, Escape,
  click-outside). Header unit test updated to match the condensed nav.
- **Navigation restructured** (`lib/nav.ts`): `PRIMARY_NAV` condensed to the
  mockup's six (Agenda, Speakers, Sede, Sponsors, Equipo, Preguntas); a new
  `REGISTER_CTA`; and `FOOTER_NAV` spelled out in full so **Proponer charla,
  Voluntarios, Registro, Código de Conducta, and Ediciones anteriores stay
  reachable** from the footer (and their own pages). No destination was removed
  from the site.
- **Hero rebuilt to the light "Home Light" mockup**
  (`components/organisms/Hero.tsx`): a light (`surface-muted`) panel with an
  eyebrow row ("Primera edición" + live registration status), the headline,
  subtitle, a Fecha / Horario / Sede / Entrada detail grid, an orange
  **Registrarme** CTA plus an outline **Proponer charla** CTA, the **live
  countdown** (kept), and a right-hand image panel with a navy date badge.
  Preserved: the `#contenido-principal` skip-link target, the register/CFP/
  contact CTA fallbacks, and the countdown.
- **SiteFooter rebuilt to the navy mockup**
  (`components/organisms/SiteFooter.tsx`): navy (`surface-inverse`) panel,
  Amazon-Orange accents, brand + "Entrada gratuita", two nav columns (Evento /
  Participar) covering the full `FOOTER_NAV`, and a Contacto column. Preserved:
  contact mailto, social links (or the "Próximamente en redes" fallback), the
  privacy notice, and the community-organized disclaimer.
- **PrivacyFooterNote made tone-aware** (`components/organisms/PrivacyFooterNote.tsx`):
  a `tone="inverse"` variant renders its two external links legibly on the dark
  footer (plain anchors that keep `target`/`rel` and inherit the light text
  color); light pages are unchanged.

## Lost / regressed

- **None functionally.** The header was condensed from 9 links to 6, but the
  removed items (Proponer charla, Voluntarios) remain in the footer nav and on
  their own routes, per the requirement that navbar functionality stay
  reachable somewhere.
- The only failing unit tests — 10 in `tests/unit/lib-content-preview.test.ts`
  — are a **pre-existing** Windows path-separator issue unrelated to this work
  (confirmed on a clean `git stash`; they pass in the Linux CI container).

### Intentional deviations from the mockup (not losses)

- **FAQ label kept as "Preguntas"** (mockup top bar shows "FAQ"). Keeps the
  existing e2e/label expectations green; same `/faq` destination.
- **ThemeToggle kept in the header**, one deviation from the mockup navbar.
  It was dropped during the rebuild, which left the dark palette unreachable
  and the `ThemeToggle` atom, `lib/theme.ts` and their tests as dead code; the
  control is back next to the CTA and the `navigation.spec` theme e2e with it,
  now also asserting that the default is light.
- **Brand is the `logo-dark.png` image**, replacing the text wordmark.
- **Hero decoration:** the old dark hero's Asunción skyline photo and dot-grid
  were dropped (the light mockup hero is clean). Both were `aria-hidden`
  decoration, so no information/functionality was lost. The hero headline is
  rendered in navy rather than with the mockup's single orange word (the title
  is one data-driven string).

## Deferred

- Full page-by-page migration of: Home, Speakers, Speaker detail, Sponsors,
  Agenda/Schedule, FAQ, Equipo/Team, Sede/Venue, Registro/Register, Ediciones,
  CFP, Código de Conducta. Foundation (design tokens + SiteHeader + SiteFooter +
  Hero) is being done first; remaining pages follow.

## Mockup elements with no current-site equivalent (watch list)

- **Voluntarios / Volunteers** appears in the mockup footer nav
  (`Voluntarios.dc.html`) but there is **no `Voluntarios.dc.html` mockup file**
  in the folder, while the live site *does* have a `/volunteers` page. Migration
  must not drop the working volunteers page just because the mockup lacks a
  dedicated design for it.
