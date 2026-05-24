// Internal FS helpers used by every content loader. These run server-side
// (server components, build) only. Importing this module from a client
// component is a programming error.
//
// Path resolution is relative to `process.cwd()`, which is the repository
// root in both `next dev` and `next build`.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export function contentRoot(): string {
  return join(process.cwd(), "content");
}

export function editionDir(year: string): string {
  return join(contentRoot(), "editions", year);
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
