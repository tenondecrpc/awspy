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
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { startFixtureServer } from "./preview-sessionize.mjs";

const args = process.argv.slice(2);

/**
 * Next.js records the dev server holding this directory in `.next/dev/lock`.
 * The lock is per directory, not per port, so a second dev server is refused
 * even on a different port - and the running one keeps answering, which makes
 * it look as though preview mode simply did nothing.
 */
function runningDevServer() {
  let lock;
  try {
    lock = JSON.parse(readFileSync(join(".next", "dev", "lock"), "utf8"));
  } catch {
    return null;
  }
  if (!lock?.pid) return null;
  try {
    // Signal 0 only tests for the process; a stale lock must not block us.
    process.kill(lock.pid, 0);
  } catch {
    return null;
  }
  return lock;
}

const running = runningDevServer();
if (running) {
  console.error(
    `\nA dev server is already running for this directory` +
      `${running.port ? ` on port ${running.port}` : ""} (pid ${running.pid}).\n\n` +
      "Next.js allows one dev server per directory, so this is refused even\n" +
      "on a different port. Until you stop the running one it keeps answering\n" +
      "and the sections still look empty.\n\n" +
      `Stop it (Ctrl-C in its terminal, or kill ${running.pid}) and run this again.\n`
  );
  process.exit(1);
}

const { server, baseUrl } = await startFixtureServer({ verbose: false });

console.log(`Sessionize fixtures      ${baseUrl}`);
console.log("Placeholder content      CONTENT_PREVIEW=1 (*.example.json)");
console.log("Live content files are not modified.\n");

const startedAt = Date.now();
const child = spawn(
  process.execPath,
  [join("node_modules", "next", "dist", "bin", "next"), "dev", ...args],
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

  // A quick non-zero exit means the dev server never came up. Say so plainly
  // rather than leaving the reason buried in the output above.
  if (!signal && code && Date.now() - startedAt < 10_000) {
    console.error(
      "\nThe dev server exited immediately, so preview mode is NOT running.\n" +
        "The most common cause is another `next dev` already holding this\n" +
        "directory. See the Next.js output above.\n"
    );
  }

  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 0);
});
