// Dependency audit gate behind `npm run security:audit`.
//
// Runs `npm audit` twice: over production dependencies only, where any high or
// critical advisory fails, and over the full graph, where an advisory fails
// unless it is listed in `AUDIT_ALLOWLIST`. An allowlisted advisory therefore
// stays tolerated only while it is reachable from development tooling alone,
// and only until its review date. The gate fails closed: a report it cannot
// read or attribute counts as a failure.
//
// Every entry needs a matching record in `docs/documented-exceptions.md`.

import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export type AllowedAdvisory = {
  /** GitHub advisory id, e.g. `GHSA-xxxx-xxxx-xxxx`. */
  id: string;
  /** The package the advisory is filed against. */
  package: string;
  /** Record in `docs/documented-exceptions.md`. */
  exception: string;
  /** `YYYY-MM-DD`. From the following day the entry fails the gate. */
  reviewBy: string;
};

export const AUDIT_ALLOWLIST: readonly AllowedAdvisory[] = [
  {
    // Stack exhaustion on deeply nested brace patterns. Reached only through
    // eslint-config-next -> fast-glob -> micromatch at lint time, with
    // patterns the repository owns. No patched braces release exists.
    id: "GHSA-vfj7-8cjw-p6xm",
    package: "braces",
    exception: "EX-003",
    reviewBy: "2026-11-04",
  },
];

type AuditVia =
  string | { name?: string; title?: string; url?: string; severity?: string };

export type AuditReport = {
  vulnerabilities?: Record<string, { via?: AuditVia[] }>;
  metadata?: { vulnerabilities?: Record<string, number> };
  error?: unknown;
};

export type Advisory = {
  id: string;
  package: string;
  severity: string;
  title: string;
};

const BLOCKING = new Set(["high", "critical"]);

function advisoryId(via: Exclude<AuditVia, string>): string {
  const ghsa = via.url?.match(/GHSA(-[a-z0-9]{4}){3}/i)?.[0];
  return ghsa ?? via.url ?? via.title ?? "unknown advisory";
}

/**
 * The high and critical advisories in a report, one per advisory and package.
 * Packages that are only vulnerable through another package (`via` holds a
 * name) are skipped: they inherit the advisory filed against the root one.
 */
export function blockingAdvisories(report: AuditReport): Advisory[] {
  if (report.error !== undefined) {
    throw new Error("npm audit returned an error instead of a report");
  }
  const found = new Map<string, Advisory>();
  for (const vulnerability of Object.values(report.vulnerabilities ?? {})) {
    for (const via of vulnerability.via ?? []) {
      if (typeof via === "string") continue;
      if (!via.severity || !BLOCKING.has(via.severity)) continue;
      const advisory = {
        id: advisoryId(via),
        package: via.name ?? "unknown package",
        severity: via.severity,
        title: via.title ?? "",
      };
      found.set(`${advisory.id}:${advisory.package}`, advisory);
    }
  }
  const counted = report.metadata?.vulnerabilities ?? {};
  if ((counted.high ?? 0) + (counted.critical ?? 0) > 0 && found.size === 0) {
    throw new Error(
      "npm audit counted high or critical findings it did not attribute to an advisory"
    );
  }
  return [...found.values()];
}

function describe(advisory: Advisory): string {
  return `${advisory.id} (${advisory.package}, ${advisory.severity}) ${advisory.title}`.trim();
}

export function evaluateAudit({
  full,
  production,
  allowlist = AUDIT_ALLOWLIST,
  today = new Date().toISOString().slice(0, 10),
}: {
  full: AuditReport;
  production: AuditReport;
  allowlist?: readonly AllowedAdvisory[];
  today?: string;
}): { failures: string[]; notices: string[] } {
  const failures: string[] = [];
  const notices: string[] = [];

  for (const advisory of blockingAdvisories(production)) {
    failures.push(`${describe(advisory)} reaches production dependencies`);
  }

  const reported = blockingAdvisories(full);
  for (const advisory of reported) {
    const entry = allowlist.find(
      (a) => a.id === advisory.id && a.package === advisory.package
    );
    if (!entry) {
      failures.push(describe(advisory));
    } else if (entry.reviewBy < today) {
      failures.push(
        `${advisory.id} allowlist entry passed its review date ${entry.reviewBy}; review ${entry.exception}`
      );
    } else {
      notices.push(
        `${advisory.id} (${advisory.package}) allowed by ${entry.exception} until ${entry.reviewBy}`
      );
    }
  }

  for (const entry of allowlist) {
    const stillReported = reported.some(
      (a) => a.id === entry.id && a.package === entry.package
    );
    if (!stillReported) {
      notices.push(
        `${entry.id} (${entry.package}) is no longer reported; remove it from the allowlist and close ${entry.exception}`
      );
    }
  }

  return { failures, notices };
}

function runAudit(extraArgs: string[]): AuditReport {
  const result = spawnSync("npm", ["audit", "--json", ...extraArgs], {
    encoding: "utf8",
    // npm is a .cmd shim on Windows, which Node only spawns through a shell.
    shell: process.platform === "win32",
    maxBuffer: 64 * 1024 * 1024,
  });
  try {
    return JSON.parse(result.stdout) as AuditReport;
  } catch {
    throw new Error(
      `npm audit ${extraArgs.join(" ")} did not return JSON (exit ${result.status})`
    );
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  const { failures, notices } = evaluateAudit({
    full: runAudit([]),
    production: runAudit(["--omit=dev"]),
  });
  for (const notice of notices) console.log(`notice: ${notice}`);
  if (failures.length > 0) {
    for (const failure of failures) console.error(`error: ${failure}`);
    process.exit(1);
  }
  console.log("npm audit: no unapproved high or critical advisories");
}
