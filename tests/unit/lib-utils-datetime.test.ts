import { describe, expect, it } from "vitest";
import { formatTime, wallTimeToInstant } from "@/lib/utils/datetime";

describe("wallTimeToInstant", () => {
  it("pins a zone-less Sessionize time to Asunción", () => {
    const instant = wallTimeToInstant("2026-10-17T09:00:00");

    expect(instant).toBe("2026-10-17T09:00:00-03:00");
    expect(new Date(instant).toISOString()).toBe("2026-10-17T12:00:00.000Z");
    expect(formatTime(instant)).toBe("09:00");
  });

  it("uses the offset Asunción observed on that date", () => {
    // Paraguay kept daylight saving time until 2024, so a July session was
    // at UTC-4. The offset comes from the zone rules, not a constant.
    expect(wallTimeToInstant("2023-07-15T09:00:00")).toBe(
      "2023-07-15T09:00:00-04:00"
    );
  });

  it("leaves a timestamp that already names its zone alone", () => {
    expect(wallTimeToInstant("2023-09-16T09:00:00Z")).toBe(
      "2023-09-16T09:00:00Z"
    );
    expect(wallTimeToInstant("2026-10-17T09:00:00-03:00")).toBe(
      "2026-10-17T09:00:00-03:00"
    );
  });
});
