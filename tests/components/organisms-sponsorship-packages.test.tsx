import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorshipPackages } from "@/components/organisms/SponsorshipPackages";
import type { Sponsorship } from "@/lib/content/sponsorship";

const PACKAGES: Sponsorship["packages"] = [
  { tier: "Diamante", price: "USD 3.000" },
  { tier: "Silver", price: "USD 500" },
];

const BENEFITS: Sponsorship["benefits"] = [
  { label: "Logo en el sitio", tiers: ["Diamante", "Silver"] },
  { label: "Charla de 45 min", tiers: ["Diamante"] },
];

describe("SponsorshipPackages", () => {
  it("renders a column per package with its price", () => {
    render(<SponsorshipPackages packages={PACKAGES} benefits={BENEFITS} />);
    const headers = screen.getAllByRole("columnheader");
    expect(headers.map((h) => h.textContent)).toEqual([
      "Beneficio",
      "DiamanteUSD 3.000",
      "SilverUSD 500",
    ]);
  });

  it("renders a row header per benefit", () => {
    render(<SponsorshipPackages packages={PACKAGES} benefits={BENEFITS} />);
    expect(
      screen.getByRole("rowheader", { name: "Logo en el sitio" })
    ).toBeInTheDocument();
  });

  it("states inclusion in text, not only with the check mark", () => {
    render(<SponsorshipPackages packages={PACKAGES} benefits={BENEFITS} />);
    const row = screen.getByRole("rowheader", {
      name: "Charla de 45 min",
    }).parentElement as HTMLElement;

    const cells = within(row).getAllByRole("cell");
    expect(cells).toHaveLength(2);
    expect(cells[0]).toHaveTextContent("Incluido");
    expect(cells[1]).toHaveTextContent("No incluido");
  });

  it("is reachable by keyboard so the wide table can be scrolled", () => {
    render(<SponsorshipPackages packages={PACKAGES} benefits={BENEFITS} />);
    expect(
      screen.getByRole("group", { name: "Tabla de paquetes de patrocinio" })
    ).toHaveAttribute("tabindex", "0");
  });

  it("renders nothing without packages or without benefits", () => {
    const { container: noPackages } = render(
      <SponsorshipPackages packages={[]} benefits={BENEFITS} />
    );
    expect(noPackages).toBeEmptyDOMElement();

    const { container: noBenefits } = render(
      <SponsorshipPackages packages={PACKAGES} benefits={[]} />
    );
    expect(noBenefits).toBeEmptyDOMElement();
  });
});
