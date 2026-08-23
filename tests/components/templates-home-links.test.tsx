import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import type { Speaker } from "@/lib/api/sessionize";

vi.mock("next/navigation", () => ({
  usePathname: () => "/editions/2026",
}));

const SPEAKER: Speaker = {
  id: "speaker-1",
  firstName: "Ada",
  lastName: "Lovelace",
  fullName: "Ada Lovelace",
  slug: "ada-lovelace",
  links: [],
  sessions: [],
};

describe("HomeTemplate edition links", () => {
  it("keeps archived preview links inside the selected edition", () => {
    render(
      <HomeTemplate
        eventInfo={getEventInfo("2026")}
        speakersPreview={[SPEAKER]}
        sponsorsPreview={[]}
        speakersHref="/editions/2026/speakers"
        sponsorsHref="/editions/2026/sponsors"
      />
    );

    expect(screen.getByRole("link", { name: "Ada Lovelace" })).toHaveAttribute(
      "href",
      "/editions/2026/speakers/ada-lovelace"
    );
    const allLinks = screen.getAllByRole("link", { name: "Ver todos" });
    expect(allLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/editions/2026/speakers",
      "/editions/2026/sponsors",
    ]);
  });
});
