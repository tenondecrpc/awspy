import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorBoard } from "@/components/organisms/SponsorBoard";
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

describe("SponsorBoard", () => {
  it("groups the confirmed sponsors under their tier, highest first", () => {
    render(
      <SponsorBoard
        sponsors={[
          sponsor({ id: "oro", name: "Oro SA", tier: "Gold" }),
          sponsor({ id: "d1", name: "Diamante Uno", tier: "Diamante" }),
          sponsor({ id: "d2", name: "Diamante Dos", tier: "Diamante" }),
        ]}
        openSlots={0}
        slotHref="#paquetes"
      />
    );

    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual([
      "Sponsor Diamante",
      "Sponsor Oro",
    ]);

    const diamante = headings[0].parentElement as HTMLElement;
    expect(
      within(diamante)
        .getAllByRole("link")
        .map((l) => l.getAttribute("href"))
    ).toEqual(["https://example.com/acme", "https://example.com/acme"]);
    expect(within(diamante).getAllByRole("listitem")).toHaveLength(2);
    expect(
      screen.queryByRole("link", { name: /Tu logo aquí/ })
    ).not.toBeInTheDocument();
  });

  it("follows the sponsors with the empty frames while there is room", () => {
    render(
      <SponsorBoard sponsors={[sponsor()]} openSlots={2} slotHref="/sponsors" />
    );

    const row = screen.getByRole("link", { name: /Tu logo aquí/ });
    expect(row).toHaveAttribute("href", "/sponsors");
    expect(row.children).toHaveLength(2);
  });

  it("offers only the frames while nobody has signed", () => {
    render(<SponsorBoard sponsors={[]} openSlots={3} slotHref="#paquetes" />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Tu logo aquí/ }).children
    ).toHaveLength(3);
  });
});
