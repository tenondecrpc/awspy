import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorSlotCard } from "@/components/molecules/SponsorSlotCard";
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

describe("SponsorSlotCard", () => {
  it("offers the tier as an open slot and links to the packages", () => {
    render(
      <SponsorSlotCard tier="Diamante" price="USD 3.000" href="#paquetes" />
    );

    const slot = screen.getByRole("link", {
      name: "Cupo de sponsor Diamante disponible, USD 3.000",
    });
    expect(slot).toHaveAttribute("href", "#paquetes");
    expect(slot).toHaveTextContent("Disponible");
    // The tier is spelled out, so the color chip is never the only signal.
    expect(slot).toHaveTextContent("Diamante");
    expect(slot).toHaveTextContent("USD 3.000");
  });

  it("drops the price when the tier is unpriced", () => {
    render(<SponsorSlotCard tier="Community" href="mailto:hola@example.com" />);

    const slot = screen.getByRole("link", {
      name: "Cupo de sponsor Comunidad disponible",
    });
    expect(slot).toHaveTextContent("Comunidad");
    expect(slot).not.toHaveTextContent("USD");
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

  it("drops a tier as soon as a sponsor holds it", () => {
    expect(listAvailableTiers(packages, [sponsor({ tier: "Gold" })])).toEqual([
      "Diamante",
      "Platinum",
    ]);
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
