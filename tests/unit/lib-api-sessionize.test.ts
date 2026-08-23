import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  SpeakerWallSchema,
  SessionizeSessionSchema,
  SessionsListSchema,
  ScheduleGridSchema,
  SpeakersListSchema,
  attachSpeakerSlugs,
  buildSessionizeUrl,
  getScheduleGrid,
  getSpeakerBySlug,
  listSessions,
  listSpeakers,
  normalizeSessionizeBaseUrl,
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
  it("builds each view URL from the configured provider base", () => {
    const baseUrl = normalizeSessionizeBaseUrl(
      process.env.NEXT_PUBLIC_SESSIONIZE_BASE_URL ??
        "https://sessionize.com/api/v2"
    );
    expect(buildSessionizeUrl("jl4ktls0", "Speakers")).toBe(
      `${baseUrl}/jl4ktls0/view/Speakers`
    );
    expect(buildSessionizeUrl("jl4ktls0", "GridSmart")).toBe(
      `${baseUrl}/jl4ktls0/view/GridSmart`
    );
  });

  it("normalizes a trailing slash from the base URL", () => {
    expect(normalizeSessionizeBaseUrl("https://example.test/api/")).toBe(
      "https://example.test/api"
    );
  });

  const credentialUrl = new URL("https://example.test/api");
  credentialUrl.username = "user";
  credentialUrl.password = "pass";

  it.each([
    "http://example.test/api",
    "ftp://example.test/api",
    credentialUrl.toString(),
  ])("rejects unsafe provider base URL %s", (url) => {
    expect(() => normalizeSessionizeBaseUrl(url)).toThrow();
  });

  it.each([
    "http://localhost:3001/api",
    "http://127.0.0.1:3001/api",
    "https://sessionize.example/api",
  ])("accepts safe provider base URL %s", (url) => {
    expect(normalizeSessionizeBaseUrl(url)).toBe(url);
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

  it("accepts HTTP speaker links from the captured provider contract", () => {
    const speakers = SpeakersListSchema.parse(loadFixture("Speakers"));
    expect(speakers.some((speaker) => speaker.links.length > 0)).toBe(true);
  });

  it("rejects active and non-web speaker link schemes", () => {
    const base = {
      id: "1",
      firstName: "Ada",
      lastName: "Lovelace",
      links: [],
      sessions: [],
    };
    for (const url of [
      "javascript:alert(1)",
      "data:text/html,attack",
      "ftp://example.test/file",
    ]) {
      const result = SpeakersListSchema.safeParse([
        { ...base, links: [{ title: "Unsafe", url, linkType: "Other" }] },
      ]);
      expect(result.success).toBe(false);
    }
  });

  it("rejects sessions whose end precedes their start", () => {
    const result = SessionizeSessionSchema.safeParse({
      id: "session-1",
      title: "Invalid ordering",
      startsAt: "2026-09-12T15:00:00-03:00",
      endsAt: "2026-09-12T14:00:00-03:00",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["endsAt"]);
    }
  });

  it("keeps one-sided optional session timestamps compatible", () => {
    expect(
      SessionizeSessionSchema.safeParse({
        id: "session-1",
        title: "Start only",
        startsAt: "2026-09-12T15:00:00-03:00",
      }).success
    ).toBe(true);
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
