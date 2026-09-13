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

function renderArchivedEdition() {
  return render(
    <HomeTemplate
      eventInfo={getEventInfo("2026")}
      speakers={[SPEAKER]}
      sponsors={[]}
      faq={[]}
      organizers={[]}
      registerHref="/editions/2026/register"
      cfpHref="/editions/2026/cfp"
      speakersHref="/editions/2026/speakers"
      sponsorsHref="/editions/2026/sponsors"
      scheduleHref="/editions/2026/schedule"
      teamHref="/editions/2026/team"
      volunteersHref="/editions/2026/volunteers"
    />
  );
}

describe("HomeTemplate edition links", () => {
  it("keeps every internal link inside the selected edition", () => {
    const { container } = renderArchivedEdition();

    // An archived edition must never link into the current one: any in-app
    // path has to carry the /editions/{year} prefix. External links, mail
    // links and in-page anchors are out of scope.
    const escaped = Array.from(container.querySelectorAll("a"))
      .map((link) => link.getAttribute("href") ?? "")
      .filter((href) => href.startsWith("/"))
      .filter((href) => !href.startsWith("/editions/2026"));

    expect(escaped).toEqual([]);
  });

  it("scopes the speaker detail and the section actions to the edition", () => {
    renderArchivedEdition();

    expect(screen.getByRole("link", { name: /Ada Lovelace/ })).toHaveAttribute(
      "href",
      "/editions/2026/speakers/ada-lovelace"
    );

    const allLinks = screen.getAllByRole("link", { name: "Ver todos →" });
    expect(allLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/editions/2026/speakers",
      "/editions/2026/sponsors",
    ]);
  });
});
