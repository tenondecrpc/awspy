import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Tokens that MUST be declared in app/globals.css. The list mirrors
// specs/002-visual-refresh/data-model.md. If a token is missing in either the
// light block or the dark block, the test fails loudly so contributors update
// both modes together.

const REQUIRED_TOKENS = [
  // Brand and action
  "--color-brand-primary",
  "--color-action",
  "--color-action-strong",
  "--color-accent",
  "--color-accent-strong",
  "--color-accent-soft",
  // Surfaces
  "--color-surface",
  "--color-surface-muted",
  "--color-surface-elevated",
  "--color-surface-inverse",
  "--color-surface-hero",
  // Text
  "--color-text-primary",
  "--color-text-secondary",
  "--color-text-muted",
  "--color-text-on-action",
  "--color-text-on-accent",
  "--color-text-on-inverse",
  "--color-text-on-hero",
  // Borders
  "--color-border-subtle",
  "--color-border-strong",
  // State
  "--color-focus",
  "--color-success",
  "--color-success-soft",
  "--color-warning",
  "--color-warning-soft",
  "--color-danger",
  "--color-danger-soft",
  // Sponsor tier
  "--color-tier-platinum",
  "--color-tier-gold",
  "--color-tier-silver",
  "--color-tier-bronze",
  "--color-tier-community",
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const GLOBALS_CSS_PATH = resolve(__dirname, "../../app/globals.css");

function extractBlock(css: string, header: RegExp): string {
  const startMatch = header.exec(css);
  if (!startMatch) return "";
  let depth = 0;
  let started = false;
  let result = "";
  for (let i = startMatch.index; i < css.length; i++) {
    const ch = css[i];
    result += ch;
    if (ch === "{") {
      depth++;
      started = true;
    } else if (ch === "}") {
      depth--;
      if (started && depth === 0) break;
    }
  }
  return result;
}

describe("palette tokens in app/globals.css", () => {
  const css = readFileSync(GLOBALS_CSS_PATH, "utf8");

  // The light @theme block is the first occurrence not preceded by a media
  // query. We grab it by matching the first `@theme {`.
  const lightBlock = extractBlock(css, /@theme\s*\{/);
  const darkBlock = extractBlock(
    css,
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{[\s\S]*?@theme\s*\{/
  );

  it("declares a light @theme block", () => {
    expect(lightBlock.length).toBeGreaterThan(0);
  });

  it("declares a dark @theme block under prefers-color-scheme", () => {
    expect(darkBlock.length).toBeGreaterThan(0);
  });

  it.each(REQUIRED_TOKENS)("declares %s in light mode", (token) => {
    expect(lightBlock).toContain(`${token}:`);
  });

  it.each(REQUIRED_TOKENS)("declares %s in dark mode", (token) => {
    expect(darkBlock).toContain(`${token}:`);
  });
});
