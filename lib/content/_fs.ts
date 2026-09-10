// Internal FS helpers used by every content loader. These run server-side
// (server components, build) only. Importing this module from a client
// component is a programming error.
//
// Path resolution is relative to `process.cwd()`, which is the repository
// root in both `next dev` and `next build`.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function contentRoot(): string {
  return join(process.cwd(), "content");
}

export function editionDir(year: string): string {
  return join(contentRoot(), "editions", year);
}

/**
 * Resolves a content file inside an edition directory.
 *
 * Several sections ship with empty content (`sponsors.json` is `[]`, the
 * venue is "por confirmar"), which leaves their pages showing an empty state
 * with nothing to look at while working on the design. In **development
 * only**, setting `CONTENT_PREVIEW=1` makes a `<name>.example.json` sibling
 * win over the live file when one exists, so placeholder records can be
 * rendered without editing - or risking a commit of - the real content.
 *
 * Production builds ignore the flag outright. That is deliberate: the site is
 * public, so placeholder sponsors or team members must not be reachable from
 * a deployed build even if the variable is set in the hosting environment.
 */
export function editionFile(year: string, fileName: string): string {
  const live = join(editionDir(year), fileName);

  if (process.env.NODE_ENV === "production") return live;
  if (process.env.CONTENT_PREVIEW !== "1") return live;

  const dot = fileName.lastIndexOf(".");
  if (dot <= 0) return live;

  const example = join(
    editionDir(year),
    `${fileName.slice(0, dot)}.example${fileName.slice(dot)}`
  );
  return existsSync(example) ? example : live;
}

export function readJsonOrThrow<T = unknown>(absolutePath: string): T {
  let text: string;
  try {
    text = readFileSync(absolutePath, "utf8");
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read content file ${absolutePath}: ${cause}`);
  }
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to parse JSON in ${absolutePath}: ${cause}`);
  }
}

export function readTextOrThrow(absolutePath: string): string {
  try {
    return readFileSync(absolutePath, "utf8");
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to read content file ${absolutePath}: ${cause}`);
  }
}
