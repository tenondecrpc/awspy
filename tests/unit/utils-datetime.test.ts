import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatDateTime,
  formatTime,
  formatTimeRange,
  startOfDayKey,
} from "@/lib/utils/datetime";

// Asunción is UTC-3 (no DST since 2010). Use UTC inputs and translate.

describe("formatDate", () => {
  it("renders a long Spanish date in Asuncion time zone", () => {
    // 2026-05-23T15:00:00Z is 2026-05-23 12:00 in Asuncion (UTC-3).
    const out = formatDate("2026-05-23T15:00:00Z");
    expect(out).toMatch(/2026/);
    expect(out).toMatch(/mayo/);
    expect(out).toMatch(/23/);
  });

  it("rolls back to the previous Asuncion day when the UTC time is just past midnight", () => {
    // 2026-05-24T02:00:00Z is 2026-05-23 23:00 in Asuncion.
    const out = formatDate("2026-05-24T02:00:00Z");
    expect(out).toMatch(/23/);
  });

  it("returns an empty string on invalid input", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("formatTime", () => {
  it("renders 24h HH:mm in Asuncion time zone", () => {
    // 2026-05-23T15:00:00Z -> 12:00 in Asuncion.
    expect(formatTime("2026-05-23T15:00:00Z")).toBe("12:00");
  });

  it("pads single-digit hours", () => {
    // 2026-05-23T13:30:00Z -> 10:30 in Asuncion.
    expect(formatTime("2026-05-23T13:30:00Z")).toBe("10:30");
  });

  it("returns empty string on invalid input", () => {
    expect(formatTime(NaN)).toBe("");
  });
});

describe("formatDateTime", () => {
  it("includes month name and time", () => {
    const out = formatDateTime("2026-05-23T15:00:00Z");
    expect(out).toMatch(/mayo/);
    expect(out).toMatch(/12:00/);
  });
});

describe("formatTimeRange", () => {
  it("returns HH:mm - HH:mm for same-day ranges", () => {
    const start = "2026-05-23T13:00:00Z"; // 10:00 in Asuncion
    const end = "2026-05-23T14:30:00Z"; // 11:30 in Asuncion
    expect(formatTimeRange(start, end)).toBe("10:00 - 11:30");
  });

  it("annotates the end label when the range crosses midnight", () => {
    // 2026-05-23T23:00 Asuncion -> 2026-05-24T02:00 UTC
    const start = "2026-05-24T02:00:00Z"; // 23:00 Asuncion (May 23)
    const end = "2026-05-24T04:30:00Z"; // 01:30 Asuncion (May 24)
    const out = formatTimeRange(start, end);
    expect(out).toMatch(/^23:00 - 01:30 \(/);
    // The annotation references May 24 specifically so a reader is not
    // misled into thinking the end time falls on the start day.
    expect(out).toMatch(/24/);
  });

  it("returns empty string on invalid input", () => {
    expect(formatTimeRange("foo", "bar")).toBe("");
  });
});

describe("startOfDayKey", () => {
  it("returns the calendar day in Asuncion regardless of UTC offset", () => {
    // 02:00 UTC on May 24 is 23:00 May 23 in Asuncion.
    expect(startOfDayKey("2026-05-24T02:00:00Z")).toBe("2026-05-23");
    // 04:30 UTC on May 24 is 01:30 May 24 in Asuncion.
    expect(startOfDayKey("2026-05-24T04:30:00Z")).toBe("2026-05-24");
  });
});
