import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SponsorTile } from "@/components/molecules/SponsorTile";
import type { Sponsor } from "@/lib/content/sponsors";

const SPONSOR: Sponsor = {
  id: "acme",
  name: "Acme",
  tier: "Gold",
  logo: { light: "/logos/acme.svg" },
  url: "https://example.com/acme",
};

describe("SponsorTile", () => {
  it("links the sponsor to its own site and names its tier in Spanish", () => {
    render(<SponsorTile sponsor={SPONSOR} />);

    const tile = screen.getByRole("link", { name: "Acme (sponsor Oro)" });
    expect(tile).toHaveAttribute("href", "https://example.com/acme");
    expect(tile).toHaveAttribute("target", "_blank");
    expect(tile).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(tile).toHaveTextContent("Acme");
    // The tier is written out, never left to the logo or a color alone.
    expect(tile).toHaveTextContent("Oro");
  });

  it("renders the logo the content declares, decoratively", () => {
    const { container } = render(<SponsorTile sponsor={SPONSOR} />);

    const logo = container.querySelector<HTMLImageElement>("img");
    // next/image serves SVG as-is and routes raster logos through the
    // optimizer, so decode before asserting on the declared path.
    expect(decodeURIComponent(logo?.getAttribute("src") ?? "")).toContain(
      "/logos/acme.svg"
    );
    // The link already carries the sponsor name, so the logo must not repeat
    // it to a screen reader.
    expect(logo).toHaveAttribute("alt", "");
    expect(logo).toHaveAttribute("aria-hidden", "true");
  });
});
