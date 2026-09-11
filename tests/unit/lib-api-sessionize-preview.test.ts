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
