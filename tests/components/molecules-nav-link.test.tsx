import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLink } from "@/components/molecules/NavLink";

vi.mock("next/navigation", () => ({
  usePathname: () => "/speakers",
}));

describe("NavLink", () => {
  it("renders the label as a link", () => {
    render(<NavLink href="/sponsors">Sponsors</NavLink>);
    expect(screen.getByRole("link", { name: "Sponsors" })).toBeInTheDocument();
  });

  it("marks the current page with aria-current", () => {
    render(<NavLink href="/speakers">Speakers</NavLink>);
    const link = screen.getByRole("link", { name: "Speakers" });
    expect(link).toHaveAttribute("aria-current", "page");
  });

  it("does not mark unrelated pages", () => {
    render(<NavLink href="/sponsors">Sponsors</NavLink>);
    const link = screen.getByRole("link", { name: "Sponsors" });
    expect(link).not.toHaveAttribute("aria-current");
  });

  it("matches deeper paths under the same segment", () => {
    render(<NavLink href="/speakers">Speakers</NavLink>);
    // pathname is /speakers and href is /speakers - active.
    const link = screen.getByRole("link", { name: "Speakers" });
    expect(link).toHaveAttribute("aria-current", "page");
  });
});
