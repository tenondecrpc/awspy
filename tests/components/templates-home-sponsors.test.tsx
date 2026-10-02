import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getSponsors } from "@/lib/content/sponsors";
import { getSponsorship } from "@/lib/content/sponsorship";
import { getVenue } from "@/lib/content/venue";
import { TIER_LABEL } from "@/lib/utils/sponsor-tiers";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const eventInfo = getEventInfo("2026");
const venue = getVenue("2026");
const sponsors = getSponsors("2026");
const sponsorship = getSponsorship("2026");
// A currency code or symbol followed by a figure: "USD 3.000", "$500", "Gs. 1".
const AMOUNT = /\b(USD|US\$|Gs\.?)\s*\d|\$\s*\d/;

function renderHome() {
  render(
    <HomeTemplate
      eventInfo={eventInfo}
      venue={venue}
      speakers={[]}
      sponsors={sponsors}
      sponsorship={sponsorship}
      faq={[]}
      organizers={[]}
    />
  );
  return document.getElementById("sponsors") as HTMLElement;
}

describe("HomeTemplate sponsors board", () => {
  it("shows the confirmed sponsors, naming each one's tier", () => {
    const section = renderHome();

    expect(sponsors.length).toBeGreaterThan(0);
    // The tier heading is written only when the board has several tiers to
    // tell apart; a single tier would just repeat the page.
    const tiers = new Set(sponsors.map((s) => TIER_LABEL[s.tier]));
    tiers.forEach((label) => {
      const heading = within(section).queryByRole("heading", {
        level: 3,
        name: `Sponsor ${label}`,
      });
      if (tiers.size > 1) expect(heading).toBeInTheDocument();
      else expect(heading).not.toBeInTheDocument();
    });
    // Whatever the headings, every logo link carries name and tier.
    sponsors.forEach((s) => {
      const link = within(section).getByRole("link", {
        name: `${s.name} (sponsor ${TIER_LABEL[s.tier]})`,
      });
      expect(link).toHaveAttribute("href", s.url);
      expect(link.textContent?.replace(/\s+/g, " ")).toBe(s.name);
    });
  });

  it("invites a logo instead of quoting the package prices", () => {
    const section = renderHome();

    const action = within(section).getByRole("link", { name: "Ser sponsor" });
    expect(action).toHaveAttribute("href", "/sponsors");
    expect(section.textContent).not.toMatch(AMOUNT);
    expect(screen.queryByText(/Disponible/)).not.toBeInTheDocument();
  });
});
