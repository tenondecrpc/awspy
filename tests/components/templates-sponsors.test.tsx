import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorsTemplate } from "@/components/templates/SponsorsTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getSponsors } from "@/lib/content/sponsors";
import { getSponsorship } from "@/lib/content/sponsorship";

const EVENT_INFO = getEventInfo("2026");
const SPONSORSHIP = getSponsorship("2026");
// A currency code or symbol followed by a figure: "USD 3.000", "$500", "Gs. 1".
const AMOUNT = /\b(USD|US\$|Gs\.?)\s*\d|\$\s*\d/;

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

  it("offers an empty frame per open tier instead of an empty board", () => {
    render(
      <SponsorsTemplate
        sponsors={[]}
        eventInfo={EVENT_INFO}
        sponsorship={SPONSORSHIP}
      />
    );

    expect(
      screen.getByText(/Todavía no hay sponsors confirmados/)
    ).toBeInTheDocument();

    // One frame per packaged tier, routed to the package table.
    const packages = SPONSORSHIP?.packages ?? [];
    expect(packages.length).toBeGreaterThan(0);
    const row = screen.getByRole("link", { name: /^Tu logo aquí/ });
    expect(row).toHaveAttribute("href", "#paquetes");
    expect(row.children).toHaveLength(packages.length);
  });

  it("names every package and its benefits but never an amount", () => {
    const { container } = render(
      <SponsorsTemplate
        sponsors={getSponsors("2026")}
        eventInfo={EVENT_INFO}
        sponsorship={SPONSORSHIP}
      />
    );

    const packages = SPONSORSHIP?.packages ?? [];
    expect(packages.length).toBeGreaterThan(0);
    expect(
      screen.getByRole("heading", { name: "Paquetes de patrocinio" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("table", {
        name: "Beneficios incluidos en cada paquete de patrocinio",
      })
    ).toBeInTheDocument();
    expect(container.textContent).not.toMatch(AMOUNT);
  });

  it("falls back to the invitation when the edition prices no tiers", () => {
    render(
      <SponsorsTemplate
        sponsors={[]}
        eventInfo={EVENT_INFO}
        sponsorship={null}
      />
    );

    expect(
      screen.getByRole("heading", { name: "Sumate como sponsor" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /^Tu logo aquí/ })
    ).not.toBeInTheDocument();
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
