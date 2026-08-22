import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyStateIllustration } from "@/components/atoms/EmptyStateIllustration";

describe("EmptyStateIllustration atom", () => {
  it("renders an aria-hidden SVG by default", () => {
    render(<EmptyStateIllustration />);
    const svg = screen.getByTestId("empty-state-illustration");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg.tagName.toLowerCase()).toBe("svg");
  });

  it("encodes the variant via data-variant for downstream queries", () => {
    render(<EmptyStateIllustration variant="speakers" />);
    expect(screen.getByTestId("empty-state-illustration")).toHaveAttribute(
      "data-variant",
      "speakers"
    );
  });

  it("does not embed any color literal in the rendered SVG (palette tokens only)", () => {
    const { container } = render(<EmptyStateIllustration variant="schedule" />);
    const html = container.innerHTML;
    expect(html).not.toMatch(/#[0-9a-fA-F]{3,8}/);
    expect(html).not.toMatch(/rgba?\(/);
    expect(html).not.toMatch(/hsla?\(/);
  });
});
