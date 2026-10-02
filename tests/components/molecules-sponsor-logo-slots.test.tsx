import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorLogoSlots } from "@/components/molecules/SponsorLogoSlots";
import { listAvailableTiers } from "@/lib/content/sponsors";
import type { Sponsor } from "@/lib/content/sponsors";

function sponsor(overrides: Partial<Sponsor> = {}): Sponsor {
  return {
    id: "acme",
    name: "Acme",
    tier: "Gold",
    logo: { light: "/logos/acme.svg" },
    url: "https://example.com/acme",
    ...overrides,
  };
}

describe("SponsorLogoSlots", () => {
  it("invites with one sentence and a single link to the given href", () => {
    render(<SponsorLogoSlots count={3} href="#paquetes" />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(
      screen.getByText(/Quedan 3 niveles de patrocinio abiertos/)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Sumá tu organización" })
    ).toHaveAttribute("href", "#paquetes");
  });

  it("uses the singular when one tier is left", () => {
    render(<SponsorLogoSlots count={1} href="/sponsors" />);

    expect(
      screen.getByText(/Queda un nivel de patrocinio abierto/)
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/sponsors");
  });

  it("names no tier and no amount, so the invitation never quotes a price", () => {
    const { container } = render(
      <SponsorLogoSlots count={4} href="/sponsors" />
    );

    expect(container.textContent).toBe(
      "Quedan 4 niveles de patrocinio abiertos. Sumá tu organización"
    );
  });

  it("renders nothing when there is no room left", () => {
    const { container } = render(<SponsorLogoSlots count={0} href="#" />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("listAvailableTiers", () => {
  const packages = [
    { tier: "Diamante" as const },
    { tier: "Platinum" as const },
    { tier: "Gold" as const },
  ];

  it("offers every priced tier while nobody has signed", () => {
    expect(listAvailableTiers(packages, [])).toEqual([
      "Diamante",
      "Platinum",
      "Gold",
    ]);
  });

  it("keeps a tier open once a sponsor holds it, since tiers take several", () => {
    expect(listAvailableTiers(packages, [sponsor({ tier: "Gold" })])).toEqual([
      "Diamante",
      "Platinum",
      "Gold",
    ]);
  });

  it("drops a tier once its declared capacity is filled", () => {
    const capped = [{ tier: "Gold" as const, slots: 2 }];
    const one = [sponsor({ id: "a", tier: "Gold" })];
    const two = [...one, sponsor({ id: "b", tier: "Gold" })];

    expect(listAvailableTiers(capped, one)).toEqual(["Gold"]);
    expect(listAvailableTiers(capped, two)).toEqual([]);
  });

  it("offers nothing when the edition prices no packages", () => {
    expect(listAvailableTiers([], [sponsor()])).toEqual([]);
  });

  it("never repeats a tier the prospectus lists twice", () => {
    expect(
      listAvailableTiers([{ tier: "Gold" }, { tier: "Gold" }], [])
    ).toEqual(["Gold"]);
  });
});
