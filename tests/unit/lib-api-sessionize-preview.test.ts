import { afterEach, describe, expect, it, vi } from "vitest";
import { readPreviewView } from "@/lib/api/sessionize-preview";

// The agenda and the speakers list come from Sessionize, so `editionFile`'s
// `*.example.json` substitution never covered them. These fixtures stand in
// when the live view is empty, under the same CONTENT_PREVIEW flag.

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("readPreviewView", () => {
  it("returns the placeholder agenda by default", () => {
    const grid = readPreviewView("GridSmart") as Array<{
      rooms: Array<{ name: string }>;
    }>;
    expect(grid).not.toBeNull();
    expect(grid[0].rooms.map((r) => r.name)).toContain("Sala Guaraní");
  });

  it("flags every placeholder session with isMockup", () => {
    // The agenda copy reads as a real programme, so the marker is the only
    // thing that tells these records apart from live Sessionize ones.
    const grid = readPreviewView("GridSmart") as Array<{
      rooms: Array<{ sessions: Array<{ isMockup?: boolean }> }>;
    }>;
    const gridSessions = grid.flatMap((day) =>
      day.rooms.flatMap((room) => room.sessions)
    );
    expect(gridSessions.length).toBeGreaterThan(0);
    expect(gridSessions.every((s) => s.isMockup === true)).toBe(true);

    const groups = readPreviewView("Sessions") as Array<{
      sessions: Array<{ isMockup?: boolean }>;
    }>;
    const sessions = groups.flatMap((group) => group.sessions);
    expect(sessions.length).toBeGreaterThan(0);
    expect(sessions.every((s) => s.isMockup === true)).toBe(true);
  });

  it("bills the agenda with names of its own, not the Demo speakers", () => {
    // The `Speakers` view fixture keeps its obviously-fake names; the agenda
    // grid does not, because it is the one section a visitor sees while the
    // real grid is still being organised.
    const grid = readPreviewView("GridSmart") as Array<{
      rooms: Array<{
        sessions: Array<{ speakers: Array<{ name: string }> }>;
      }>;
    }>;
    const billed = grid.flatMap((day) =>
      day.rooms.flatMap((room) => room.sessions.flatMap((s) => s.speakers))
    );
    expect(billed.length).toBeGreaterThan(0);
    expect(billed.some((s) => /demo/i.test(s.name))).toBe(false);
  });

  it("keeps the placeholder agenda copy free of sample-data disclaimers", () => {
    const groups = readPreviewView("Sessions") as Array<{
      sessions: Array<{ title: string; description?: string | null }>;
    }>;
    const copy = groups
      .flatMap((group) => group.sessions)
      .flatMap((s) => [s.title, s.description ?? ""]);
    expect(copy.some((text) => /ejemplo|placeholder|mockup/i.test(text))).toBe(
      false
    );
  });

  it("returns the placeholder speakers by default", () => {
    const speakers = readPreviewView("Speakers") as Array<{
      fullName: string;
    }>;
    expect(speakers.length).toBeGreaterThan(0);
  });

  it.each(["0", "false"])("returns null when CONTENT_PREVIEW=%s", (value) => {
    vi.stubEnv("CONTENT_PREVIEW", value);
    expect(readPreviewView("GridSmart")).toBeNull();
    expect(readPreviewView("Speakers")).toBeNull();
  });

  it("stays on in a production build until the flag switches it off", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(readPreviewView("GridSmart")).not.toBeNull();

    vi.stubEnv("CONTENT_PREVIEW", "0");
    expect(readPreviewView("GridSmart")).toBeNull();
  });
});
