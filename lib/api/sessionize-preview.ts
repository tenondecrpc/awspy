// Placeholder Sessionize payloads for the views that ship empty.
//
// The agenda and the speakers list come from the Sessionize public API, not
// from `content/editions/`, so `editionFile`'s `*.example.json` substitution
// never reached them: until the CFP fills up, a deployed build showed an
// empty agenda. These fixtures - the same ones `npm run dev:preview` serves
// locally - stand in for that, under the same `CONTENT_PREVIEW` flag.
//
// The substitution is narrower than the one for content files, and
// deliberately so: it only applies when the live view came back **empty**.
// The day Sessionize has a real session, it wins with no redeploy and no
// config change. Setting `CONTENT_PREVIEW=0` turns the placeholder off and
// restores the empty state.
//
// Server-side only, like the content loaders. Importing this from a client
// component is a programming error.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { previewEnabled } from "@/lib/content/_fs";
// Type-only, so this does not create a runtime cycle with the client that
// imports `readPreviewView` from here.
import type { SessionizeView } from "@/lib/api/sessionize";

function fixturePath(view: SessionizeView): string {
  return join(
    process.cwd(),
    "content",
    "preview",
    "sessionize",
    `${view}.json`
  );
}

// Announced once per view per process, matching the content loaders: a
// deployed build serving a placeholder agenda should say so on every boot.
const announced = new Set<SessionizeView>();

function announce(view: SessionizeView): void {
  if (process.env.NODE_ENV === "test") return;
  if (announced.has(view)) return;
  announced.add(view);

  if (process.env.NODE_ENV === "production") {
    console.warn(
      `[sessionize] WARNING: serving the placeholder ${view} view to visitors because the live one is empty. Set CONTENT_PREVIEW=0 and redeploy to show the empty state instead.`
    );
    return;
  }

  console.warn(
    `[sessionize] preview mode: the live ${view} view is empty, serving the placeholder fixture. Set CONTENT_PREVIEW=0 to turn it off.`
  );
}

/**
 * The placeholder payload for `view`, or `null` when preview mode is off or
 * the fixture is not on disk. The caller validates it with the same schema it
 * applies to the live response, so a malformed fixture fails loudly.
 */
export function readPreviewView(view: SessionizeView): unknown | null {
  if (!previewEnabled()) return null;

  const path = fixturePath(view);
  if (!existsSync(path)) return null;

  let raw: string;
  try {
    raw = readFileSync(path, "utf8");
  } catch {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    announce(view);
    return parsed;
  } catch (err) {
    const cause = err instanceof Error ? err.message : String(err);
    throw new Error(
      `Failed to parse the placeholder Sessionize ${view} view at ${path}: ${cause}`
    );
  }
}
