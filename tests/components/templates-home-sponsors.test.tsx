import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getSponsors } from "@/lib/content/sponsors";
import { getSponsorship } from "@/lib/content/sponsorship";
import { getVenue } from "@/lib/content/venue";
import { TIER_LABEL_ES } from "@/lib/utils/sponsor-tiers";

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
  it("shows the confirmed sponsors under their tier", () => {
    const section = renderHome();

    expect(sponsors.length).toBeGreaterThan(0);
    new Set(sponsors.map((s) => TIER_LABEL_ES[s.tier])).forEach((label) => {
      expect(
        within(section).getByRole("heading", {
          level: 3,
          name: `Sponsor ${label}`,
        })
      ).toBeInTheDocument();
    });
    sponsors.forEach((s) => {
      expect(within(section).getByText(s.name)).toBeInTheDocument();
    });
  });

  it("invites a logo instead of quoting the package prices", () => {
    const section = renderHome();

    const row = within(section).getByRole("link", { name: /^Tu logo aquí/ });
    expect(row).toHaveAttribute("href", "/sponsors");
    expect(row.children.length).toBeGreaterThan(0);
    expect(section.textContent).not.toMatch(AMOUNT);
    expect(screen.queryByText(/Disponible/)).not.toBeInTheDocument();
  });
});
