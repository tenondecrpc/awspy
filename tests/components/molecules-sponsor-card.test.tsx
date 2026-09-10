import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SponsorCard } from "@/components/molecules/SponsorCard";
import type { Sponsor } from "@/lib/content/sponsors";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    onError,
  }: {
    src: string;
    alt: string;
    onError?: () => void;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} onError={onError} />
  ),
}));

const SPONSOR: Sponsor = {
  id: "acme",
  name: "Acme Cloud",
  tier: "Gold",
  logo: { light: "https://example.test/logo.svg" },
  url: "https://acme.example",
};

describe("SponsorCard", () => {
  it("renders the sponsor name and tier badge", () => {
    render(<SponsorCard sponsor={SPONSOR} />);
    expect(screen.getByText("Acme Cloud")).toBeInTheDocument();
    expect(screen.getByText("Gold")).toBeInTheDocument();
  });

  it("links to the sponsor's URL with safe attributes", () => {
    render(<SponsorCard sponsor={SPONSOR} />);
    const link = screen.getByRole("link", {
      name: /acme cloud \(sponsor gold\)/i,
    });
    expect(link).toHaveAttribute("href", "https://acme.example");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("falls back to the sponsor name when the logo fails to load", () => {
    render(<SponsorCard sponsor={SPONSOR} />);
    const img = screen.getByRole("img", { name: "Acme Cloud" });
    fireEvent.error(img);
    // After the error, the visible name fallback is rendered inside the link.
    const link = screen.getByRole("link", {
      name: /acme cloud \(sponsor gold\)/i,
    });
    expect(link.textContent).toContain("Acme Cloud");
  });

  it("tints the card accent from the tier token", () => {
    const { container } = render(<SponsorCard sponsor={SPONSOR} />);
    const style = container.querySelector("article")?.getAttribute("style");
    expect(style).toContain("--card-accent: var(--color-tier-gold)");
  });

  it("exposes exactly one link so the card is a single tab stop", () => {
    render(<SponsorCard sponsor={SPONSOR} />);
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link").className).toContain("after:absolute");
  });

  it("hides the tier badge in compact variant", () => {
    render(<SponsorCard sponsor={SPONSOR} variant="compact" />);
    expect(screen.queryByText("Gold")).not.toBeInTheDocument();
  });
});
