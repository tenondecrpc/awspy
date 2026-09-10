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
 * Is a `<name>.example.json` sibling allowed to stand in for a live content
 * file?
 *
 * **On by default, everywhere** - local development and deployed builds
 * alike - until it is switched off with `CONTENT_PREVIEW=0`. That is a
 * deliberate choice for this stage of the project: the sections whose real
 * records are not ready yet (sponsors, organizers, venue) show placeholder
 * data rather than an empty state.
 *
 * The consequence is that a deployed build serves placeholder records to
 * real visitors, so every substitution logs a warning naming the file. To
 * switch back to the real content, set `CONTENT_PREVIEW=0` in the hosting
 * environment and redeploy. Removing a `*.example.json` file also drops just
 * that section back to its live content.
 */
function previewEnabled(): boolean {
  const flag = process.env.CONTENT_PREVIEW;
  return flag !== "0" && flag !== "false";
}

/**
 * Resolves a content file inside an edition directory, preferring a
 * `<name>.example.json` sibling when preview mode is on and one exists. The
 * live content file is never modified either way.
 */
export function editionFile(year: string, fileName: string): string {
  const live = join(editionDir(year), fileName);

  if (!previewEnabled()) return live;

  const dot = fileName.lastIndexOf(".");
  if (dot <= 0) return live;

  const example = join(
    editionDir(year),
    `${fileName.slice(0, dot)}.example${fileName.slice(dot)}`
  );
  if (!existsSync(example)) return live;

  announcePreview(fileName);
  return example;
}

// Announced once per file per process. Without it there is no way to tell,
// from a page that renders placeholder sponsors, whether preview mode is on
// or the real records just landed.
const announced = new Set<string>();

function announcePreview(fileName: string): void {
  if (process.env.NODE_ENV === "test") return;
  if (announced.has(fileName)) return;
  announced.add(fileName);

  if (process.env.NODE_ENV === "production") {
    // A deployed build is showing placeholder records to real visitors, which
    // is worth shouting about on every boot until it is switched off.
    console.warn(
      `[content] WARNING: serving placeholder ${fileName} to visitors. Set CONTENT_PREVIEW=0 and redeploy to serve the real content.`
    );
    return;
  }

  console.warn(
    `[content] preview mode: serving placeholder ${fileName} from its .example sibling. Set CONTENT_PREVIEW=0 to turn it off.`
  );
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
