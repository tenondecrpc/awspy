// Starts the dev server with placeholder content so the sections that ship
// empty have something to render.
//
//   npm run dev:preview
//
// Two things are wired up:
//   - CONTENT_PREVIEW=1 makes the content loaders prefer a
//     `<name>.example.json` sibling when one exists (sponsors, organizers,
//     venue). See `editionFile` in lib/content/_fs.ts.
//   - NEXT_PUBLIC_SESSIONIZE_BASE_URL points at the local fixture server
//     started below, so /speakers and /schedule get a full day of sessions
//     instead of the empty state.
//
// Neither reaches a deployed build: `editionFile` ignores the flag when
// NODE_ENV is production, and the fixture server only runs here.
//
// Extra arguments are forwarded to `next dev` (e.g. `npm run dev:preview -- -p 3001`).

import { spawn } from "node:child_process";
import { join } from "node:path";
import { startFixtureServer } from "./preview-sessionize.mjs";

const { server, baseUrl } = await startFixtureServer({ verbose: false });

console.log(`Sessionize fixtures      ${baseUrl}`);
console.log("Placeholder content      CONTENT_PREVIEW=1 (*.example.json)");
console.log("Live content files are not modified.\n");

const child = spawn(
  process.execPath,
  [
    join("node_modules", "next", "dist", "bin", "next"),
    "dev",
    ...process.argv.slice(2),
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      CONTENT_PREVIEW: "1",
      NEXT_PUBLIC_SESSIONIZE_BASE_URL: baseUrl,
    },
  }
);

function shutdown(signal) {
  child.kill(signal);
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

child.on("exit", (code, signal) => {
  server.close();
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
