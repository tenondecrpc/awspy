import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "@/components/atoms/Skeleton";

describe("Skeleton atom", () => {
  it("exposes role=status, aria-live=polite, and aria-busy=true", () => {
    const { container } = render(<Skeleton label="Cargando" />);
    const node = container.querySelector('[role="status"]');
    expect(node).not.toBeNull();
    expect(node).toHaveAttribute("aria-live", "polite");
    expect(node).toHaveAttribute("aria-busy", "true");
  });

  it("renders a visually hidden label when provided", () => {
    render(<Skeleton label="Cargando charlas" />);
    const sr = screen.getByText("Cargando charlas");
    expect(sr.className).toContain("sr-only");
  });

  it("applies width and height inline styles", () => {
    const { container } = render(<Skeleton width="120px" height="20px" />);
    const node = container.querySelector('[role="status"]');
    expect(node).toHaveStyle({ width: "120px", height: "20px" });
  });

  it("renders as a circle when circle=true", () => {
    const { container } = render(<Skeleton circle width={40} height={40} />);
    const node = container.querySelector('[role="status"]');
    expect(node).toHaveStyle({ borderRadius: "9999px" });
  });
});
