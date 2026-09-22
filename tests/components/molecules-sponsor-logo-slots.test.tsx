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
  it("draws one empty frame per open slot behind a single link", () => {
    render(<SponsorLogoSlots count={3} href="#paquetes" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    const row = screen.getByRole("link", {
      name: "Tu logo aquí: sumate como sponsor",
    });
    expect(row).toHaveAttribute("href", "#paquetes");
    expect(row.children).toHaveLength(3);
    Array.from(row.children).forEach((frame) => {
      expect(frame).toHaveTextContent("Tu logo aquí");
      expect(frame).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("names no tier and no amount, so the invitation never quotes a price", () => {
    render(<SponsorLogoSlots count={4} href="/sponsors" />);

    const row = screen.getByRole("link");
    expect(row.textContent).toBe("Tu logo aquí".repeat(4));
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
