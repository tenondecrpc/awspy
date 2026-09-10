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
//   Terminal 1:  npm run preview:data
//   Terminal 2:  NEXT_PUBLIC_SESSIONIZE_BASE_URL=http://127.0.0.1:8799 npm run dev
//
// On Windows PowerShell, set the variable first:
//   $env:NEXT_PUBLIC_SESSIONIZE_BASE_URL="http://127.0.0.1:8799"; npm run dev

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const PORT = Number(process.env.PREVIEW_PORT ?? 8799);
const FIXTURE_DIR = join(process.cwd(), "content", "preview", "sessionize");
const VIEWS = new Set(["Speakers", "Sessions", "GridSmart", "SpeakerWall"]);

const server = createServer(async (req, res) => {
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
    console.log(`200 ${view}`);
  } catch (err) {
    res.writeHead(500, { "content-type": "application/json" });
    res.end(JSON.stringify({ error: String(err) }));
    console.error(`500 ${view}`, err);
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Sessionize preview fixtures on http://127.0.0.1:${PORT}`);
  console.log(`Serving ${FIXTURE_DIR}`);
  console.log(
    `\nRun the site against it with:\n  NEXT_PUBLIC_SESSIONIZE_BASE_URL=http://127.0.0.1:${PORT} npm run dev\n`
  );
});
