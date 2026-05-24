# Contract: Lint rule that prohibits color literals outside `app/globals.css`

## Goal

Enforce, at lint time, that no file under `app/`, `components/`, or `lib/` declares a color literal. The single source of truth for colors is `app/globals.css` (Tailwind v4 `@theme` tokens). Any consumer references colors via token names (`var(--color-...)`) or Tailwind utilities derived from those tokens.

## Patterns matched (forbidden)

- Hex literals: `#abc`, `#aabbcc`, `#aabbccdd` (3, 6, or 8 hex digits, case insensitive).
- Functional notations: `rgb(...)`, `rgba(...)`, `hsl(...)`, `hsla(...)`, `oklch(...)`, `oklab(...)`, `color(...)`.
- Named CSS colors (`red`, `blue`, `slategray`, etc.) used in `style` attributes or template strings.

## Patterns allowed (exceptions)

- `currentColor`, `inherit`, `transparent`, `none`, `unset`, `initial`, `revert`.
- Hex strings unrelated to colors that match by accident: tokens that are clearly not colors (e.g. shortened commit hashes embedded in a string), comments, and `data-*` attributes containing hex IDs. The rule scopes detection to JSX `style` props, `className` strings, and CSS-in-JS template literals tagged with `css` or in `style={{...}}` blocks. Plain string literals that are not used in a styling context are not flagged.

## Scope

- Globs: `app/**/*.{ts,tsx,js,jsx,mjs,cjs}`, `components/**/*.{ts,tsx}`, `lib/**/*.{ts,tsx}`.
- Excluded files: `app/globals.css` (CSS, not linted by ESLint), any `*.test.{ts,tsx}` file (tests may legitimately assert against literal colors), and any auto-generated artifact under `.next/` (already ignored).

## Implementation

The rule is implemented as an inline ESLint rule in `eslint.config.mjs`. No new package is added. The rule uses ESLint's `Rule.create` shape, declared as a local rule object inside the config and registered under a project namespace (e.g. `local/no-color-literals`).

The rule visits:

- `Literal` and `TemplateElement` nodes, checking the raw value against the forbidden pattern set.
- It restricts firing to nodes whose nearest JSX/TS context is a styling location: `JSXAttribute` named `style` or `className`, member expressions on `style.`, and tagged template literals named `css` or `styled.*`.

When a match is found, the rule reports an error with this message:

> "Color literal '<value>' is forbidden outside `app/globals.css`. Use a palette token (`var(--color-...)`) or a Tailwind utility derived from `@theme`."

## CI integration

- `npm run lint` (`eslint`) MUST run the rule.
- A CI pipeline that runs `npm run lint` will fail on any violation.
- Auto-fix is NOT provided; the developer must consciously map the literal to a semantic token.

## Tests

- A small fixture test under `tests/unit/lib-utils-tokens.test.ts` checks the **token presence** side of the contract (every token from `data-model.md` exists in `app/globals.css`).
- The lint rule itself is exercised by `npm run lint` against the codebase. There is no separate unit test for the ESLint rule in v1 of the refresh; if the rule grows complex, a dedicated test will be added under `tests/unit/eslint-no-color-literals.test.ts`.

## Failure mode and overrides

- The rule is treated as `error` (not `warn`); the CI MUST fail on violations.
- An `// eslint-disable-next-line local/no-color-literals` MAY be used in genuinely exceptional cases, but each occurrence MUST include a reason comment on the previous line. Reviewers reject overrides without reason.
