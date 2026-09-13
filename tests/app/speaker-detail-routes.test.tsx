import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import type { Speaker, SessionizeSession } from "@/lib/api/sessionize";

const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
vi.mock("next/navigation", () => ({
  notFound: () => notFound(),
  usePathname: () => "/speakers/ada-lovelace",
}));

// Sessionize is an external boundary; the routes are tested against a fixed
// roster so they never depend on the live view or on preview fallbacks.
const SPEAKER: Speaker = {
  id: "u1",
  slug: "ada-lovelace",
  firstName: "Ada",
  lastName: "Lovelace",
  fullName: "Ada Lovelace",
  tagLine: "Cloud Architect",
  links: [],
  sessions: [{ id: "s1", name: "Charla de ejemplo" }],
};
const SESSION: SessionizeSession = {
  id: "s1",
  title: "Charla de ejemplo",
  startsAt: "2026-10-17T13:00:00-03:00",
  endsAt: "2026-10-17T13:45:00-03:00",
  isPlenumSession: false,
  isServiceSession: false,
  speakers: [{ id: "u1", name: "Ada Lovelace" }],
  roomId: "r1",
  room: "Sala A",
};

vi.mock("@/lib/api/sessionize", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/api/sessionize")>()),
  listSpeakers: vi.fn(async () => [SPEAKER]),
  getSpeakerBySlug: vi.fn(async (_id: string | null, slug: string) =>
    slug === SPEAKER.slug ? SPEAKER : null
  ),
  listSessions: vi.fn(async () => [SESSION]),
}));

import * as current from "@/app/speakers/[slug]/page";
import * as archived from "@/app/editions/[year]/speakers/[slug]/page";

describe("speaker detail routes", () => {
  beforeEach(() => {
    notFound.mockClear();
  });

  it("pre-renders one path per speaker of the current edition", async () => {
    await expect(current.generateStaticParams()).resolves.toEqual([
      { slug: "ada-lovelace" },
    ]);
  });

  it("pre-renders one path per speaker and edition for the archive", async () => {
    const params = await archived.generateStaticParams();
    expect(params).toContainEqual({ year: "2026", slug: "ada-lovelace" });
  });

  it("titles the page after the speaker", async () => {
    const metadata = await current.generateMetadata({
      params: Promise.resolve({ slug: "ada-lovelace" }),
    });
    expect(metadata.title).toContain("Ada Lovelace");
  });

  it("falls back to a generic title for an unknown edition", async () => {
    const metadata = await archived.generateMetadata({
      params: Promise.resolve({ year: "1999", slug: "ada-lovelace" }),
    });
    expect(metadata.title).toContain("Edición no encontrada");
    expect(notFound).not.toHaveBeenCalled();
  });

  it("renders the speaker with their sessions", async () => {
    render(
      await current.default({ params: Promise.resolve({ slug: SPEAKER.slug }) })
    );
    expect(
      screen.getByRole("heading", { level: 1, name: "Ada Lovelace" })
    ).toBeInTheDocument();
    expect(screen.getByText("Charla de ejemplo")).toBeInTheDocument();
  });

  it("keeps the archived detail page inside its edition", async () => {
    render(
      await archived.default({
        params: Promise.resolve({ year: "2026", slug: SPEAKER.slug }),
      })
    );
    expect(
      screen.getByRole("link", { name: /Volver a todos los speakers/i })
    ).toHaveAttribute("href", "/editions/2026/speakers");
  });

  it("is a 404 for an unknown speaker", async () => {
    await expect(
      current.default({ params: Promise.resolve({ slug: "no-existe" }) })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("is a 404 for an unknown edition", async () => {
    await expect(
      archived.default({
        params: Promise.resolve({ year: "1999", slug: SPEAKER.slug }),
      })
    ).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });
});
