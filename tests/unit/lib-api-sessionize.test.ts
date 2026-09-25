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
  getSpeakerWall,
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
  vi.unstubAllEnvs();
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

  const invalidSchemeCredentialUrl = new URL("ftp://example.test/api");
  invalidSchemeCredentialUrl.username = "user";
  invalidSchemeCredentialUrl.password = "pass";

  it("rejects malformed and non-web provider URLs with the HTTP(S) error", () => {
    for (const url of [
      "not a URL",
      "ftp://example.test/api",
      invalidSchemeCredentialUrl.toString(),
    ]) {
      expect(() => normalizeSessionizeBaseUrl(url)).toThrow(
        "Sessionize base URL must be an absolute HTTP(S) URL"
      );
    }
  });

  it("rejects credentials in a web provider URL with the credentials error", () => {
    expect(() => normalizeSessionizeBaseUrl(credentialUrl.toString())).toThrow(
      "Sessionize base URL must not contain credentials"
    );
  });

  it("rejects remote HTTP with the transport-policy error", () => {
    expect(() => normalizeSessionizeBaseUrl("http://example.test/api")).toThrow(
      "Sessionize base URL must use HTTPS outside loopback"
    );
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

  it("leaves isMockup unset on a live session payload", () => {
    // The live Sessionize API never sends the field; only the placeholder
    // fixtures set it, so anything parsed from the provider reads as real.
    const session = SessionizeSessionSchema.parse({
      id: "session-1",
      title: "Real session",
      startsAt: "2026-09-12T15:00:00-03:00",
      endsAt: "2026-09-12T16:00:00-03:00",
    });
    expect(session.isMockup).toBeUndefined();

    const mock = SessionizeSessionSchema.parse({
      id: "session-2",
      title: "Placeholder session",
      isMockup: true,
    });
    expect(mock.isMockup).toBe(true);
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

describe("schedule times as Sessionize sends them", () => {
  // Once the schedule is announced, Sessionize sends the event's wall-clock
  // time with no zone. Rejecting it emptied the grid and every speaker's
  // session list; reading it in the server's zone (UTC on Amplify) would
  // shift every session by three hours.
  const LOCAL_SESSION = {
    id: "1305534",
    title: "Patrones avanzados de despliegue en EKS",
    startsAt: "2026-10-17T11:00:00",
    endsAt: "2026-10-17T12:00:00",
    speakers: [{ id: "live-1", name: "Cecilia Neira" }],
  };

  it("accepts the GridSmart view and pins its times to Asunción", () => {
    const grid = ScheduleGridSchema.parse([
      {
        date: "2026-10-17T00:00:00",
        rooms: [
          {
            id: 1,
            name: "Pedro Juan Caballero (Charla Técnica)",
            sessions: [LOCAL_SESSION],
          },
        ],
      },
    ]);

    const session = grid[0].rooms[0].sessions[0];
    expect(session.startsAt).toBe("2026-10-17T11:00:00-03:00");
    expect(session.endsAt).toBe("2026-10-17T12:00:00-03:00");
  });

  it("accepts the Sessions view with the same times", () => {
    const groups = SessionsListSchema.parse([
      { groupId: null, groupName: "All", sessions: [LOCAL_SESSION] },
    ]);

    expect(groups[0].sessions[0].startsAt).toBe("2026-10-17T11:00:00-03:00");
  });

  it("still rejects a local session that ends before it starts", () => {
    const result = SessionizeSessionSchema.safeParse({
      ...LOCAL_SESSION,
      endsAt: "2026-10-17T10:00:00",
    });

    expect(result.success).toBe(false);
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
  it("opts every Sessionize view out of the persistent Next.js cache", async () => {
    const requests: Array<{
      view: string;
      payload: unknown;
      load: () => Promise<unknown>;
    }> = [
      {
        view: "Speakers",
        payload: loadFixture("Speakers"),
        load: () => listSpeakers("test-event"),
      },
      {
        view: "Sessions",
        payload: loadFixture("Sessions"),
        load: () => listSessions("test-event"),
      },
      {
        view: "GridSmart",
        payload: loadFixture("GridSmart"),
        load: () => getScheduleGrid("test-event"),
      },
      {
        view: "SpeakerWall",
        payload: loadFixture("SpeakerWall"),
        load: () => getSpeakerWall("test-event"),
      },
    ];

    for (const request of requests) {
      mockFetch(request.view, request.payload);

      await request.load();

      const fetchMock = vi.mocked(fetch);
      expect(fetchMock).toHaveBeenCalledOnce();
      const [, init] = fetchMock.mock.calls[0];
      expect(init).toMatchObject({ cache: "no-store" });
      expect(init).not.toHaveProperty("next");
    }
  });

  it("keeps a published speaker whose photo is served by the Sessionize CDN", async () => {
    // Production uses the CDN; the demo fixtures only exercise sessionize.com.
    const speaker = {
      id: "speaker-cdn",
      firstName: "Ada",
      lastName: "Lovelace",
      fullName: "Ada Lovelace",
      profilePicture: "https://cdn.sessionize.com/image/speaker.jpg",
      links: [],
      sessions: [{ id: 123, name: "Cloud operations" }],
    };
    mockFetch("Speakers", [speaker]);

    const speakers = await listSpeakers("test-event");

    expect(speakers).toHaveLength(1);
    expect(speakers[0]).toMatchObject({
      fullName: "Ada Lovelace",
      slug: "ada-lovelace",
      profilePicture: speaker.profilePicture,
      sessions: [{ id: "123", name: "Cloud operations" }],
    });
  });

  it("returns the parsed speakers from the demo fixture", async () => {
    mockFetch("Speakers", loadFixture("Speakers"));
    const speakers = await listSpeakers("jl4ktls0");
    expect(speakers.length).toBeGreaterThan(0);
    expect(speakers[0].slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("returns [] when eventId is null", async () => {
    expect(await listSpeakers(null)).toEqual([]);
  });

  // An unreachable or broken upstream leaves the view empty, which is the
  // case the placeholder fixtures cover. These assert the flag-off path, so
  // the fallback in `withPreviewFallback` stays out of the way.
  it("returns [] when Sessionize 404s and preview is off", async () => {
    vi.stubEnv("CONTENT_PREVIEW", "0");
    mockFetch("Speakers", null, 404);
    expect(await listSpeakers("nope")).toEqual([]);
  });

  it("serves the placeholder speakers when Sessionize 404s", async () => {
    mockFetch("Speakers", null, 404);
    const speakers = await listSpeakers("nope");
    expect(speakers.length).toBeGreaterThan(0);
    expect(speakers.every((s) => s.slug)).toBe(true);
  });

  it("returns [] when Sessionize returns malformed JSON and preview is off", async () => {
    vi.stubEnv("CONTENT_PREVIEW", "0");
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
  it("keeps unscheduled sessions in the provider's ungrouped list", async () => {
    mockFetch("Sessions", [
      {
        groupId: null,
        groupName: "All",
        sessions: [
          {
            id: "123",
            title: "Cloud operations",
            startsAt: null,
            endsAt: null,
            roomId: null,
            speakers: [{ id: "speaker-cdn", name: "Ada Lovelace" }],
          },
        ],
      },
    ]);

    const sessions = await listSessions("test-event");

    expect(sessions).toHaveLength(1);
    expect(sessions[0]).toMatchObject({
      title: "Cloud operations",
      startsAt: null,
      endsAt: null,
      speakers: [{ id: "speaker-cdn", name: "Ada Lovelace" }],
    });
  });

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
