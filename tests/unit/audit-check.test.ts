import { describe, expect, it } from "vitest";
import {
  type AllowedAdvisory,
  type AuditReport,
  blockingAdvisories,
  evaluateAudit,
} from "@/scripts/audit-check";

const BRACES = {
  name: "braces",
  title: "braces vulnerable to stack-exhaustion denial of service",
  url: "https://github.com/advisories/GHSA-vfj7-8cjw-p6xm",
  severity: "high",
};

/** The shape `npm audit --json` returned for the braces advisory. */
const DEV_ONLY: AuditReport = {
  vulnerabilities: {
    braces: { via: [BRACES] },
    micromatch: { via: ["braces"] },
    "fast-glob": { via: ["micromatch"] },
  },
  metadata: { vulnerabilities: { high: 3, critical: 0 } },
};

const CLEAN: AuditReport = {
  vulnerabilities: {},
  metadata: { vulnerabilities: { high: 0, critical: 0 } },
};

const ALLOW_BRACES: AllowedAdvisory[] = [
  {
    id: "GHSA-vfj7-8cjw-p6xm",
    package: "braces",
    exception: "EX-003",
    reviewBy: "2026-11-04",
  },
];

describe("blockingAdvisories", () => {
  it("reports the root advisory once, not each package it reaches", () => {
    expect(blockingAdvisories(DEV_ONLY)).toEqual([
      {
        id: "GHSA-vfj7-8cjw-p6xm",
        package: "braces",
        severity: "high",
        title: BRACES.title,
      },
    ]);
  });

  it("ignores advisories below high", () => {
    expect(
      blockingAdvisories({
        vulnerabilities: {
          braces: { via: [{ ...BRACES, severity: "moderate" }] },
        },
        metadata: { vulnerabilities: { high: 0, critical: 0 } },
      })
    ).toEqual([]);
  });

  it("fails closed on an error report", () => {
    expect(() => blockingAdvisories({ error: { code: "ENOTFOUND" } })).toThrow(
      /error instead of a report/
    );
  });

  it("fails closed when counted findings cannot be attributed", () => {
    expect(() =>
      blockingAdvisories({
        vulnerabilities: { braces: { via: ["micromatch"] } },
        metadata: { vulnerabilities: { high: 1, critical: 0 } },
      })
    ).toThrow(/did not attribute/);
  });
});

describe("evaluateAudit", () => {
  it("allows a listed development-only advisory before its review date", () => {
    const result = evaluateAudit({
      full: DEV_ONLY,
      production: CLEAN,
      allowlist: ALLOW_BRACES,
      today: "2026-10-04",
    });
    expect(result.failures).toEqual([]);
    expect(result.notices).toEqual([
      "GHSA-vfj7-8cjw-p6xm (braces) allowed by EX-003 until 2026-11-04",
    ]);
  });

  it("fails an advisory that is not listed", () => {
    const result = evaluateAudit({
      full: DEV_ONLY,
      production: CLEAN,
      allowlist: [],
      today: "2026-10-04",
    });
    expect(result.failures).toEqual([
      `GHSA-vfj7-8cjw-p6xm (braces, high) ${BRACES.title}`,
    ]);
  });

  it("fails a listed advisory once it reaches production dependencies", () => {
    const result = evaluateAudit({
      full: DEV_ONLY,
      production: DEV_ONLY,
      allowlist: ALLOW_BRACES,
      today: "2026-10-04",
    });
    expect(result.failures).toEqual([
      `GHSA-vfj7-8cjw-p6xm (braces, high) ${BRACES.title} reaches production dependencies`,
    ]);
  });

  it("fails a listed advisory after its review date", () => {
    const result = evaluateAudit({
      full: DEV_ONLY,
      production: CLEAN,
      allowlist: ALLOW_BRACES,
      today: "2026-11-05",
    });
    expect(result.failures).toEqual([
      "GHSA-vfj7-8cjw-p6xm allowlist entry passed its review date 2026-11-04; review EX-003",
    ]);
  });

  it("keeps the review date itself inside the allowance", () => {
    const result = evaluateAudit({
      full: DEV_ONLY,
      production: CLEAN,
      allowlist: ALLOW_BRACES,
      today: "2026-11-04",
    });
    expect(result.failures).toEqual([]);
  });

  it("asks to remove an entry once the advisory is gone", () => {
    const result = evaluateAudit({
      full: CLEAN,
      production: CLEAN,
      allowlist: ALLOW_BRACES,
      today: "2026-10-04",
    });
    expect(result.failures).toEqual([]);
    expect(result.notices).toEqual([
      "GHSA-vfj7-8cjw-p6xm (braces) is no longer reported; remove it from the allowlist and close EX-003",
    ]);
  });

  it("does not let an allowlist entry cover the same id on another package", () => {
    const result = evaluateAudit({
      full: {
        vulnerabilities: {
          other: { via: [{ ...BRACES, name: "other" }] },
        },
        metadata: { vulnerabilities: { high: 1 } },
      },
      production: CLEAN,
      allowlist: ALLOW_BRACES,
      today: "2026-10-04",
    });
    expect(result.failures).toHaveLength(1);
  });
});
