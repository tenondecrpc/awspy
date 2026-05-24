import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SiteHeader } from "@/components/organisms/SiteHeader";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("SiteHeader", () => {
  it("renders the skip link as the first focusable element", () => {
    render(<SiteHeader editionYear="2026" />);
    const skip = screen.getByRole("link", { name: /saltar al contenido/i });
    expect(skip).toBeInTheDocument();
    expect(skip).toHaveAttribute("href", "#contenido-principal");
  });

  it("renders the brand mark and the edition pill", () => {
    render(<SiteHeader editionYear="2026" />);
    expect(screen.getByLabelText("Edición 2026")).toBeInTheDocument();
  });

  it("renders the primary navigation labelled in Spanish", () => {
    render(<SiteHeader editionYear="2026" />);
    expect(
      screen.getByRole("navigation", { name: /navegación principal/i })
    ).toBeInTheDocument();
  });

  it("opens the mobile drawer with focus on Cerrar and aria-expanded toggling", () => {
    render(<SiteHeader editionYear="2026" />);
    const trigger = screen.getByRole("button", { name: /abrir menú/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("dialog", { name: /navegación principal/i })
    ).toBeInTheDocument();
    const closeBtn = screen.getByRole("button", { name: /cerrar menú/i });
    expect(closeBtn).toBeInTheDocument();
  });

  it("closes the drawer on Escape", () => {
    render(<SiteHeader editionYear="2026" />);
    const trigger = screen.getByRole("button", { name: /abrir menú/i });
    fireEvent.click(trigger);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { name: /navegación principal/i })
    ).not.toBeInTheDocument();
  });
});
