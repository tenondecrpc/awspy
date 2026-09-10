// Dev-only fixture server for the Sessionize views.
//
// The site reads its speakers and schedule from the public Sessionize API.
// Until the real event publishes its grid, that leaves /schedule (and the
// speaker detail sessions) empty, so there is nothing to look at while
// working on those designs. This server answers the same URL shape as
// Sessionize using the JSON under `content/preview/sessionize/`.
//
// It is a local tool: no application code reads from it, and it is wired in
// only through `NEXT_PUBLIC_SESSIONIZE_BASE_URL`, the override that
// `.env.example` already documents.
//
// Usually you want `npm run dev:preview`, which starts this server and the
// dev server together. Run it on its own with `npm run preview:data` when you
// want to point something else at it.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { basename, join } from "node:path";

export const DEFAULT_PREVIEW_PORT = 8799;

const FIXTURE_DIR = join(process.cwd(), "content", "preview", "sessionize");
const VIEWS = new Set(["Speakers", "Sessions", "GridSmart", "SpeakerWall"]);

function createFixtureServer({ verbose = true } = {}) {
  return createServer(async (req, res) => {
    // Sessionize URLs look like /{eventId}/view/{View}. The event id is
    // ignored on purpose so this works whatever `sessionizeEventId` is set to.
    const view = (req.url ?? "").split("/view/")[1]?.split("?")[0];

    if (!view || !VIEWS.has(view)) {
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: `Unknown view: ${view ?? "(none)"}` }));
      return;
    }

    try {
      const body = await readFile(join(FIXTURE_DIR, `${view}.json`));
      res.writeHead(200, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
      });
      res.end(body);
      if (verbose) console.log(`sessionize fixture 200 ${view}`);
    } catch (err) {
      res.writeHead(500, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: String(err) }));
      console.error(`sessionize fixture 500 ${view}`, err);
    }
  });
}

/** Starts the fixture server and resolves with its base URL. */
export function startFixtureServer({
  port = DEFAULT_PREVIEW_PORT,
  verbose = true,
} = {}) {
  return new Promise((resolve, reject) => {
    const server = createFixtureServer({ verbose });
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => {
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

// Running this file directly starts the server on its own.
if (process.argv[1] && import.meta.url.endsWith(basename(process.argv[1]))) {
  const port = Number(process.env.PREVIEW_PORT ?? DEFAULT_PREVIEW_PORT);
  const { baseUrl } = await startFixtureServer({ port });
  console.log(`Sessionize preview fixtures on ${baseUrl}`);
  console.log(`Serving ${FIXTURE_DIR}`);
  console.log(
    `\nPoint the site at it with:\n  NEXT_PUBLIC_SESSIONIZE_BASE_URL=${baseUrl} npm run dev\n`
  );
}
