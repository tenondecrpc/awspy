import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Local ESLint rule: forbid color literals outside `app/globals.css`.
//
// Source of truth for colors is `app/globals.css` (Tailwind v4 @theme tokens).
// Components reference colors via `var(--color-...)` or Tailwind utilities
// derived from @theme. The rule fires on hex, rgb(a), hsl(a), oklch, oklab,
// color(), and Tailwind named color utilities inside JSX `style` props,
// `className` strings, and styling-tagged template literals. See
// specs/002-visual-refresh/contracts/lint-color-rule.md for the full contract.

const COLOR_PATTERN =
  /(?:#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(|\boklch\s*\(|\boklab\s*\(|\bcolor\s*\()/;

const TAILWIND_NAMED_COLOR_PATTERN =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?(?:\/\d+)?\b/;

const ALLOWED_VALUES = new Set([
  "currentColor",
  "inherit",
  "transparent",
  "none",
  "unset",
  "initial",
  "revert",
]);

function isStylingContext(node) {
  let current = node.parent;
  while (current) {
    // Inside a JSX attribute named `style` or `className`.
    if (current.type === "JSXAttribute") {
      const name = current.name && current.name.name;
      if (name === "style" || name === "className") return true;
    }
    // Inside `style.color = "..."` or similar.
    if (
      current.type === "MemberExpression" &&
      current.object &&
      current.object.type === "Identifier" &&
      current.object.name === "style"
    ) {
      return true;
    }
    // Inside a tagged template literal named `css` or `styled.*`.
    if (current.type === "TaggedTemplateExpression") {
      const tag = current.tag;
      if (tag && tag.type === "Identifier" && tag.name === "css") return true;
      if (
        tag &&
        tag.type === "MemberExpression" &&
        tag.object &&
        tag.object.type === "Identifier" &&
        tag.object.name === "styled"
      ) {
        return true;
      }
    }
    current = current.parent;
  }
  return false;
}

function checkValue(value, context, node) {
  if (typeof value !== "string") return;
  if (ALLOWED_VALUES.has(value.trim())) return;
  if (!COLOR_PATTERN.test(value) && !TAILWIND_NAMED_COLOR_PATTERN.test(value))
    return;
  context.report({
    node,
    message:
      "Color literal or named utility '{{value}}' is forbidden outside `app/globals.css`. Use a palette token (`var(--color-...)`) or a Tailwind utility derived from `@theme`.",
    data: { value: value.length > 40 ? value.slice(0, 40) + "..." : value },
  });
}

const noColorLiteralsRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Forbid color literals and Tailwind named colors outside `app/globals.css`.",
    },
    schema: [],
    messages: {},
  },
  create(context) {
    return {
      Literal(node) {
        if (!isStylingContext(node)) return;
        checkValue(node.value, context, node);
      },
      TemplateElement(node) {
        if (!isStylingContext(node)) return;
        checkValue(node.value && node.value.raw, context, node);
      },
    };
  },
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "next-env.d.ts",
  ]),
  {
    files: [
      "app/**/*.{ts,tsx,js,jsx,mjs,cjs}",
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
    ],
    plugins: {
      local: {
        rules: {
          "no-color-literals": noColorLiteralsRule,
        },
      },
    },
    rules: {
      "local/no-color-literals": "error",
    },
  },
  {
    // Tests may legitimately assert against literal colors.
    files: ["tests/**/*.{ts,tsx}", "e2e/**/*.{ts,tsx}"],
    rules: {
      "local/no-color-literals": "off",
    },
  },
]);

export default eslintConfig;
