import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorsTemplate } from "@/components/templates/SponsorsTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getSponsors } from "@/lib/content/sponsors";
import { getSponsorship } from "@/lib/content/sponsorship";

const EVENT_INFO = getEventInfo("2026");
const SPONSORSHIP = getSponsorship("2026");

describe("SponsorsTemplate", () => {
  it("renders the confirmed sponsors and the prospectus packages", () => {
    const sponsors = getSponsors("2026");
    render(
      <SponsorsTemplate
        sponsors={sponsors}
        eventInfo={EVENT_INFO}
        sponsorship={SPONSORSHIP}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Sponsors" })
    ).toBeInTheDocument();
    sponsors.forEach((sponsor) => {
      expect(
        screen.getByRole("link", {
          name: new RegExp(sponsor.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
        })
      ).toHaveAttribute("href", sponsor.url);
    });

    if (SPONSORSHIP && SPONSORSHIP.packages.length > 0) {
      expect(
        screen.getByRole("link", { name: "Ver paquetes" })
      ).toHaveAttribute("href", "#paquetes");
    }
  });

  it("invites sponsors instead of showing an empty board", () => {
    render(
      <SponsorsTemplate
        sponsors={[]}
        eventInfo={EVENT_INFO}
        sponsorship={SPONSORSHIP}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Sumate como sponsor" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Aún no hay sponsors confirmados/)
    ).toBeInTheDocument();
  });

  it("drops the prospectus sections when the edition published none", () => {
    render(
      <SponsorsTemplate
        sponsors={getSponsors("2026")}
        eventInfo={EVENT_INFO}
        sponsorship={null}
      />
    );

    expect(
      screen.queryByRole("link", { name: "Ver paquetes" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Paquetes de patrocinio" })
    ).not.toBeInTheDocument();
    // The contact route must survive: without a prospectus, mail is the path.
    expect(screen.getByRole("link", { name: "Escribirnos" })).toHaveAttribute(
      "href",
      expect.stringContaining("mailto:")
    );
  });
});
