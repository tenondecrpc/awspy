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
        screen.getByRole("link", { name: "Ver los paquetes" })
      ).toHaveAttribute("href", "#paquetes");
    }
  });

  it("explains the empty board and routes companies to the packages", () => {
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

    // No empty board: the page says so and points a company to the packages
    // and to a person it can write to.
    expect(SPONSORSHIP?.packages.length).toBeGreaterThan(0);
    expect(
      screen.getByRole("link", { name: "Ver los paquetes" })
    ).toHaveAttribute("href", "#paquetes");
    expect(
      screen.getByRole("link", { name: "Quiero ser sponsor" })
    ).toHaveAttribute("href", expect.stringContaining("mailto:"));
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

  it("names the packages as the sponsorship deck does", () => {
    render(
      <SponsorsTemplate
        sponsors={[]}
        eventInfo={EVENT_INFO}
        sponsorship={SPONSORSHIP}
      />
    );

    // The comparison table is always visible, one column per package.
    const headers = screen.getAllByRole("columnheader");
    ["Beneficio", "Diamante", "Platinum", "Gold", "Silver"].forEach((name, i) =>
      expect(headers[i].textContent).toMatch(new RegExp(`^${name}`))
    );
    expect(headers).toHaveLength(5);

    // The ladder names the same packages, one row per level.
    ["Diamante", "Platinum", "Gold", "Silver"].forEach((tier) =>
      expect(
        screen.getByRole("heading", { level: 3, name: tier })
      ).toBeInTheDocument()
    );
  });

  it("prints the package conditions right under the package ladder", () => {
    render(
      <SponsorsTemplate
        sponsors={[]}
        eventInfo={EVENT_INFO}
        sponsorship={{
          ...SPONSORSHIP!,
          notes: ["El stand lo arma el sponsor."],
        }}
      />
    );

    const note = screen.getByText("El stand lo arma el sponsor.");
    const conditions = screen.getByRole("list", {
      name: "Condiciones de los paquetes",
    });
    expect(conditions).toContainElement(note);
    // They sit in the packages section, after its heading.
    const heading = screen.getByRole("heading", {
      name: "Paquetes de patrocinio",
    });
    expect(heading.closest("section")).toContainElement(conditions);
    expect(
      heading.compareDocumentPosition(conditions) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it("prints no conditions list when the prospectus has none", () => {
    render(
      <SponsorsTemplate
        sponsors={[]}
        eventInfo={EVENT_INFO}
        sponsorship={{ ...SPONSORSHIP!, notes: [] }}
      />
    );

    expect(
      screen.queryByRole("list", { name: "Condiciones de los paquetes" })
    ).not.toBeInTheDocument();
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
      screen.getByRole("heading", { name: /¿Querés\s+ser\s+sponsor\?/ })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Sumá tu organización" })
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
      screen.queryByRole("link", { name: "Ver los paquetes" })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Paquetes de patrocinio" })
    ).not.toBeInTheDocument();
    // The contact route must survive: without a prospectus, mail is the path.
    expect(
      screen.getByRole("link", { name: "Quiero ser sponsor" })
    ).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });
});
