import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  SpeakerWallSchema,
  SessionsListSchema,
  ScheduleGridSchema,
  SpeakersListSchema,
  attachSpeakerSlugs,
  buildSessionizeUrl,
  getScheduleGrid,
  getSpeakerBySlug,
  listSessions,
  listSpeakers,
} from "@/lib/api/sessionize";

function loadFixture(view: string): unknown {
  const path = join(process.cwd(), "tests/fixtures/sessionize", `${view}.json`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function mockFetch(view: string, payload: unknown, status = 200): void {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();
      // Sanity check: we are calling the right URL.
      if (!url.includes(`/view/${view}`)) {
        throw new Error(
          `unexpected URL ${url}, expected to contain /view/${view}`
        );
      }
      return new Response(JSON.stringify(payload), {
        status,
        headers: { "content-type": "application/json" },
      });
    })
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("buildSessionizeUrl", () => {
  it("builds the canonical URL for each view", () => {
    expect(buildSessionizeUrl("jl4ktls0", "Speakers")).toBe(
      "https://sessionize.com/api/v2/jl4ktls0/view/Speakers"
    );
    expect(buildSessionizeUrl("jl4ktls0", "GridSmart")).toBe(
      "https://sessionize.com/api/v2/jl4ktls0/view/GridSmart"
    );
  });
});

describe("Zod schemas against the captured fixtures", () => {
  it("Speakers fixture parses cleanly", () => {
    const data = loadFixture("Speakers");
    expect(() => SpeakersListSchema.parse(data)).not.toThrow();
  });

  it("Sessions fixture parses cleanly", () => {
    const data = loadFixture("Sessions");
    expect(() => SessionsListSchema.parse(data)).not.toThrow();
  });

  it("GridSmart fixture parses cleanly", () => {
    const data = loadFixture("GridSmart");
    expect(() => ScheduleGridSchema.parse(data)).not.toThrow();
  });

  it("SpeakerWall fixture parses cleanly", () => {
    const data = loadFixture("SpeakerWall");
    expect(() => SpeakerWallSchema.parse(data)).not.toThrow();
  });
});

describe("attachSpeakerSlugs", () => {
  it("derives a full name when only first and last are present", () => {
    const out = attachSpeakerSlugs([
      {
        id: "1",
        firstName: "Ada",
        lastName: "Lovelace",
        links: [],
        sessions: [],
      },
    ]);
    expect(out[0].slug).toBe("ada-lovelace");
    expect(out[0].fullName).toBe("Ada Lovelace");
  });

  it("disambiguates collisions by id", () => {
    const out = attachSpeakerSlugs([
      {
        id: "C",
        firstName: "Ana",
        lastName: "Lopez",
        links: [],
        sessions: [],
      },
      {
        id: "A",
        firstName: "Ana",
        lastName: "Lopez",
        links: [],
        sessions: [],
      },
    ]);
    // "A" comes first by id ascending so it keeps the base slug.
    expect(out.find((s) => s.id === "A")?.slug).toBe("ana-lopez");
    expect(out.find((s) => s.id === "C")?.slug).toBe("ana-lopez-2");
  });
});

describe("listSpeakers", () => {
  it("returns the parsed speakers from the demo fixture", async () => {
    mockFetch("Speakers", loadFixture("Speakers"));
    const speakers = await listSpeakers("jl4ktls0");
    expect(speakers.length).toBeGreaterThan(0);
    expect(speakers[0].slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("returns [] when eventId is null", async () => {
    expect(await listSpeakers(null)).toEqual([]);
  });

  it("returns [] when Sessionize 404s", async () => {
    mockFetch("Speakers", null, 404);
    expect(await listSpeakers("nope")).toEqual([]);
  });

  it("returns [] when Sessionize returns malformed JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("<html>boom</html>", {
            status: 200,
            headers: { "content-type": "text/html" },
          })
      )
    );
    expect(await listSpeakers("jl4ktls0")).toEqual([]);
  });
});

describe("getSpeakerBySlug", () => {
  it("returns the matching speaker with deterministic slug", async () => {
    mockFetch("Speakers", loadFixture("Speakers"));
    const all = await listSpeakers("jl4ktls0");
    const target = all[0];
    mockFetch("Speakers", loadFixture("Speakers"));
    const found = await getSpeakerBySlug("jl4ktls0", target.slug);
    expect(found?.id).toBe(target.id);
  });

  it("returns null for an unknown slug", async () => {
    mockFetch("Speakers", loadFixture("Speakers"));
    expect(await getSpeakerBySlug("jl4ktls0", "no-such-speaker")).toBeNull();
  });
});

describe("listSessions", () => {
  it("flattens the grouped Sessions view into a single array", async () => {
    mockFetch("Sessions", loadFixture("Sessions"));
    const sessions = await listSessions("jl4ktls0");
    expect(sessions.length).toBeGreaterThan(0);
    expect(typeof sessions[0].id).toBe("string");
    expect(sessions[0].title.length).toBeGreaterThan(0);
  });

  it("returns [] when eventId is null", async () => {
    expect(await listSessions(null)).toEqual([]);
  });
});

describe("getScheduleGrid", () => {
  it("returns the day-by-day grid from the fixture", async () => {
    mockFetch("GridSmart", loadFixture("GridSmart"));
    const grid = await getScheduleGrid("jl4ktls0");
    expect(grid.length).toBeGreaterThan(0);
    expect(grid[0].rooms.length).toBeGreaterThan(0);
  });

  it("returns [] when eventId is null", async () => {
    expect(await getScheduleGrid(null)).toEqual([]);
  });
});
