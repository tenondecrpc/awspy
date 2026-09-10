import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

// Defense-in-depth complement to the ESLint `local/no-color-literals` rule.
// Walks the source directories and asserts no source file declares a color
// literal in a styling context. Source of truth is `app/globals.css`.

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, "../..");

const SCAN_DIRS = ["app", "components", "lib"].map((d) => join(REPO_ROOT, d));
const ALLOWED_EXTENSIONS = new Set([".ts", ".tsx"]);
const SKIP_FILES = new Set([
  // The OG image renders via Satori, which does not resolve CSS custom
  // properties; the file documents this limitation and disables the rule
  // explicitly. The literals there are intentionally synced with the palette.
  join(REPO_ROOT, "app", "opengraph-image.tsx"),
]);

const COLOR_PATTERN =
  /(#[0-9a-fA-F]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(|\boklch\s*\(|\boklab\s*\(|\bcolor\s*\()/;

const TAILWIND_NAMED_COLOR_PATTERN =
  /\b(?:bg|text|border|ring|outline|fill|stroke|from|via|to)-(?:black|white|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-\d{2,3})?(?:\/\d+)?\b/;

const STYLING_CONTEXT_HINT_PATTERN =
  /(className\s*[:=]|style\s*[:=]|`[^`]*\$\{[^}]*\}[^`]*`)/;

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      yield* walk(full);
    } else {
      const ext = full.slice(full.lastIndexOf("."));
      if (ALLOWED_EXTENSIONS.has(ext)) yield full;
    }
  }
}

describe("palette boundary in app/, components/, lib/", () => {
  it.each(["bg-black/40", "text-white", "border-slate-300", "from-blue-500"])(
    "recognizes Tailwind named color utility %s as outside the palette",
    (utility) => {
      expect(TAILWIND_NAMED_COLOR_PATTERN.test(utility)).toBe(true);
    }
  );

  it("no source file under app/, components/, lib/ contains an out-of-palette color in a styling context", () => {
    const offenders: { file: string; line: number; text: string }[] = [];

    for (const dir of SCAN_DIRS) {
      for (const file of walk(dir)) {
        if (SKIP_FILES.has(file)) continue;
        const source = readFileSync(file, "utf8");
        const lines = source.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (
            !COLOR_PATTERN.test(line) &&
            !TAILWIND_NAMED_COLOR_PATTERN.test(line)
          ) {
            continue;
          }
          // Skip lines that are clearly comments-only.
          const trimmed = line.trim();
          if (trimmed.startsWith("//") || trimmed.startsWith("*")) continue;
          // Heuristic: only flag when the line also looks like styling.
          if (!STYLING_CONTEXT_HINT_PATTERN.test(line)) continue;
          offenders.push({ file, line: i + 1, text: line.trim() });
        }
      }
    }

    expect(offenders, JSON.stringify(offenders, null, 2)).toEqual([]);
  });
});
