import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getVenue } from "@/lib/content/venue";
import type { Speaker } from "@/lib/api/sessionize";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const SPEAKER: Speaker = {
  id: "speaker-1",
  firstName: "Ada",
  lastName: "Lovelace",
  fullName: "Ada Lovelace",
  slug: "ada-lovelace",
  tagLine: "Cloud Architect en Demo Cloud",
  links: [],
  sessions: [{ id: "s1", name: "Arquitecturas serverless en producción" }],
};

function renderSpeakersSection() {
  render(
    <HomeTemplate
      eventInfo={getEventInfo("2026")}
      venue={getVenue("2026")}
      speakers={[SPEAKER]}
      sponsors={[]}
      faq={[]}
      organizers={[]}
    />
  );
  return document.getElementById("speakers") as HTMLElement;
}

describe("HomeTemplate speakers preview", () => {
  it("identifies the speaker and leaves the talk to the agenda", () => {
    const section = renderSpeakersSection();

    expect(
      within(section).getByRole("heading", { level: 3, name: "Ada Lovelace" })
    ).toBeInTheDocument();
    expect(
      within(section).getByText("Cloud Architect en Demo Cloud")
    ).toBeInTheDocument();
    expect(
      within(section).queryByText("Arquitecturas serverless en producción")
    ).not.toBeInTheDocument();
  });
});
