import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

// Tokens that MUST be declared in app/globals.css. The list mirrors
// specs/002-visual-refresh/data-model.md. If a token is missing in either the
// light block or the dark block, the test fails loudly so contributors update
// both modes together.

const REQUIRED_TOKENS = [
  // Brand, action, and national identity
  "--color-brand-primary",
  "--color-action",
  "--color-action-strong",
  "--color-action-label",
  "--color-accent",
  "--color-accent-strong",
  "--color-accent-soft",
  "--color-national-red",
  "--color-national-red-label",
  "--color-national-red-on-dark",
  // Surfaces
  "--color-surface",
  "--color-surface-muted",
  "--color-surface-elevated",
  "--color-surface-inverse",
  "--color-surface-hero",
  "--color-overlay",
  "--color-scrim-strong",
  "--color-glass",
  "--color-glass-border",
  // Decorative glow: only ever the outer stop of a box-shadow, so these
  // carry no contrast pair.
  "--color-glow-action",
  "--color-glow-accent",
  "--color-glow-red",
  // Text
  "--color-text-primary",
  "--color-text-secondary",
  "--color-text-muted",
  "--color-text-on-action",
  "--color-text-on-accent",
  "--color-text-on-inverse",
  "--color-text-on-hero",
  "--color-text-on-tier",
  // Borders
  "--color-border-subtle",
  "--color-border-strong",
  // State
  "--color-focus",
  "--color-focus-on-hero",
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

type ColorMode = "light" | "dark";

type ContrastPair = {
  foreground: string;
  background: string;
  minimum: number;
};

const CONTRAST_PAIRS: ContrastPair[] = [
  {
    foreground: "--color-text-primary",
    background: "--color-surface",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-secondary",
    background: "--color-surface",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-muted",
    background: "--color-surface",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-primary",
    background: "--color-surface-muted",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-action",
    background: "--color-action",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-action",
    background: "--color-action-strong",
    minimum: 4.5,
  },
  {
    foreground: "--color-action-label",
    background: "--color-surface",
    minimum: 4.5,
  },
  {
    foreground: "--color-action-label",
    background: "--color-surface-muted",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-accent",
    background: "--color-accent",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-accent",
    background: "--color-accent-strong",
    minimum: 4.5,
  },
  {
    foreground: "--color-accent-strong",
    background: "--color-accent-soft",
    minimum: 4.5,
  },
  {
    foreground: "--color-accent",
    background: "--color-surface",
    minimum: 4.5,
  },
  {
    foreground: "--color-accent",
    background: "--color-surface-muted",
    minimum: 4.5,
  },
  {
    foreground: "--color-national-red-label",
    background: "--color-surface",
    minimum: 4.5,
  },
  {
    foreground: "--color-national-red-label",
    background: "--color-surface-muted",
    minimum: 4.5,
  },
  {
    foreground: "--color-national-red-on-dark",
    background: "--color-surface-inverse",
    minimum: 4.5,
  },
  {
    foreground: "--color-national-red-on-dark",
    background: "--color-surface-hero",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-inverse",
    background: "--color-surface-inverse",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-hero",
    background: "--color-surface-hero",
    minimum: 4.5,
  },
  {
    foreground: "--color-success",
    background: "--color-success-soft",
    minimum: 4.5,
  },
  {
    foreground: "--color-warning",
    background: "--color-warning-soft",
    minimum: 4.5,
  },
  {
    foreground: "--color-danger",
    background: "--color-danger-soft",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-tier",
    background: "--color-tier-platinum",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-tier",
    background: "--color-tier-gold",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-tier",
    background: "--color-tier-silver",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-tier",
    background: "--color-tier-bronze",
    minimum: 4.5,
  },
  {
    foreground: "--color-text-on-tier",
    background: "--color-tier-community",
    minimum: 4.5,
  },
  { foreground: "--color-focus", background: "--color-surface", minimum: 3 },
  {
    foreground: "--color-focus-on-hero",
    background: "--color-surface-hero",
    minimum: 3,
  },
  {
    foreground: "--color-border-strong",
    background: "--color-surface",
    minimum: 3,
  },
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

function parseColors(block: string): Record<string, string> {
  return Object.fromEntries(
    [
      ...block.matchAll(
        /(--color-[\w-]+):\s*(#[\da-fA-F]{6}(?:[\da-fA-F]{2})?)\s*;/g
      ),
    ].map(([, token, value]) => [token, value])
  );
}

function relativeLuminance(hex: string): number {
  const channels = [1, 3, 5].map(
    (index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255
  );
  const linear = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );

  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

function contrastRatio(first: string, second: string): number {
  const luminances = [relativeLuminance(first), relativeLuminance(second)].sort(
    (a, b) => b - a
  );
  return (luminances[0] + 0.05) / (luminances[1] + 0.05);
}

describe("palette tokens in app/globals.css", () => {
  const css = readFileSync(GLOBALS_CSS_PATH, "utf8");

  // The light @theme block is the first occurrence not preceded by a media
  // query. We grab it by matching the first `@theme {`.
  const lightBlock = extractBlock(css, /@theme\s*\{/);
  const darkBlock = extractBlock(css, /html\[data-theme=["']dark["']\]\s*\{/);
  const systemDarkBlock = extractBlock(
    css,
    /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{/
  );
  const parsedColors: Record<ColorMode, Record<string, string>> = {
    light: parseColors(lightBlock),
    dark: parseColors(darkBlock),
  };

  it("declares a light @theme block", () => {
    expect(lightBlock.length).toBeGreaterThan(0);
  });

  it("keeps the Tailwind @theme declaration top-level", () => {
    expect(css.match(/@theme\s*\{/g)).toHaveLength(1);
    expect(Object.keys(parsedColors.light)).toEqual(
      expect.arrayContaining(REQUIRED_TOKENS)
    );
  });

  it.each(REQUIRED_TOKENS)("declares %s in light mode", (token) => {
    expect(lightBlock).toContain(`${token}:`);
  });

  it("uses the OS preference by default and supports explicit theme overrides", () => {
    expect(css).toMatch(/@media\s*\(prefers-color-scheme:\s*dark\)/);
    expect(css).toMatch(/html:not\(\[data-theme\]\)/);
    expect(css).toMatch(/html\[data-theme=["']light["']\]/);
    expect(css).toMatch(/html\[data-theme=["']dark["']\]/);
  });

  it("keeps OS dark values aligned with the explicit dark override", () => {
    expect(parseColors(systemDarkBlock)).toMatchObject(parsedColors.dark);
  });

  it.each(["light", "dark"] as const)(
    "meets documented WCAG contrast pairs in %s mode",
    (mode) => {
      const failures = CONTRAST_PAIRS.flatMap(
        ({ foreground, background, minimum }) => {
          const ratio = contrastRatio(
            parsedColors[mode][foreground],
            parsedColors[mode][background]
          );
          return ratio + Number.EPSILON < minimum
            ? [
                `${foreground} on ${background}: ${ratio.toFixed(2)} < ${minimum}`,
              ]
            : [];
        }
      );

      expect(failures).toEqual([]);
    }
  );

  it.each(REQUIRED_TOKENS)("declares dark value for %s", (token) => {
    expect(parsedColors.dark[token]).toMatch(
      /^#[\da-fA-F]{6}(?:[\da-fA-F]{2})?$/
    );
  });
});
