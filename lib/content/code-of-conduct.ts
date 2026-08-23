// Loader for `content/editions/{year}/code-of-conduct.mdx`. We split the
// file's frontmatter (between two `---` lines at the top) from the body so
// the page can render the body with the restricted local Markdown renderer
// while we still validate the frontmatter schema at load time.

import { z } from "zod";
import { join } from "node:path";
import { editionDir, readTextOrThrow } from "@/lib/content/_fs";

export const CodeOfConductFrontmatterSchema = z
  .object({
    lastUpdated: z.string().datetime({ offset: true }).optional(),
    version: z
      .string()
      .regex(/^\d+\.\d+\.\d+$/)
      .optional(),
  })
  .strict();

export type CodeOfConductFrontmatter = z.infer<
  typeof CodeOfConductFrontmatterSchema
>;

export type CodeOfConduct = {
  /** Validated frontmatter, possibly empty. */
  frontmatter: CodeOfConductFrontmatter;
  /** Markdown/MDX body without the frontmatter block. */
  body: string;
};

const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;

/**
 * Minimal YAML-ish frontmatter parser. We only need to handle the keys
 * declared in `CodeOfConductFrontmatterSchema` (string scalars), so a tiny
 * line-based parser is enough and avoids adding `gray-matter` or `js-yaml`
 * as a dependency.
 */
function parseFrontmatter(raw: string): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const line of raw.split("\n")) {
    const match = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/.exec(line);
    if (!match) continue;
    const [, key, value] = match;
    let parsed: unknown = value.trim();
    // Strip optional surrounding quotes.
    if (typeof parsed === "string") {
      const s = parsed as string;
      if (
        (s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))
      ) {
        parsed = s.slice(1, -1);
      }
    }
    out[key] = parsed;
  }
  return out;
}

export function getCodeOfConduct(year: string): CodeOfConduct {
  const path = join(editionDir(year), "code-of-conduct.mdx");
  const raw = readTextOrThrow(path);
  return parseCodeOfConduct(raw, `edition ${year} at ${path}`);
}

export function parseCodeOfConduct(
  raw: string,
  source = "code-of-conduct.mdx"
): CodeOfConduct {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = FRONTMATTER_RE.exec(normalized);

  let frontmatterRaw: Record<string, unknown> = {};
  let body = normalized;
  if (match) {
    frontmatterRaw = parseFrontmatter(match[1]);
    body = match[2];
  }

  const result = CodeOfConductFrontmatterSchema.safeParse(frontmatterRaw);
  if (!result.success) {
    throw new Error(
      `Invalid code-of-conduct.mdx frontmatter for ${source}: ${result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`
    );
  }
  return { frontmatter: result.data, body };
}
