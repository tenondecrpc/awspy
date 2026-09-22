import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getVenue } from "@/lib/content/venue";
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
      venue={getVenue("2026")}
      speakers={Promise.resolve([SPEAKER])}
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

  // The speaker cards are not asserted here. They render behind a Suspense
  // boundary and React DOM does not resume a `use()` promise under jsdom, so
  // this sweep only ever sees the fallback. `e2e/editions.spec.ts` carries
  // that assertion against a real server instead.
  it("scopes the section actions to the edition", () => {
    renderArchivedEdition();

    const allLinks = screen.getAllByRole("link", { name: "Ver todos →" });
    expect(allLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/editions/2026/speakers",
      "/editions/2026/sponsors",
    ]);
  });
});
