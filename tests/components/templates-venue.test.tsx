import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VenueTemplate } from "@/components/templates/VenueTemplate";
import { getVenue } from "@/lib/content/venue";
import type { Venue } from "@/lib/content/venue";

const VENUE = getVenue("2026");

describe("VenueTemplate", () => {
  it("shows the venue, its address and the external map link", () => {
    render(<VenueTemplate venue={VENUE} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Sede" })
    ).toBeInTheDocument();
    expect(screen.getAllByText(VENUE.name).length).toBeGreaterThan(0);
    expect(screen.getByText(VENUE.address)).toBeInTheDocument();

    const map = screen.getAllByRole("link", { name: /mapa|maps|cómo llegar/i });
    expect(map.length).toBeGreaterThan(0);
  });

  it("drops the transport and accessibility sections when empty", () => {
    const bare: Venue = { ...VENUE, transport: [], accessibility: [] };
    render(<VenueTemplate venue={bare} />);

    expect(
      screen.queryByRole("heading", { name: "Accesibilidad" })
    ).not.toBeInTheDocument();
  });
});
