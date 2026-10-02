import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MeshGradientSVG } from "@/components/atoms/MeshGradientSVG";

// jsdom has no WebGL; the shader only needs to mark where its canvas lands.
vi.mock("@paper-design/shaders-react", () => ({
  MeshGradient: ({ className }: { className?: string }) => (
    <div data-testid="kiro-shader" className={className} />
  ),
}));

describe("MeshGradientSVG atom", () => {
  it("keeps the shader canvas out of an SVG foreignObject", () => {
    // WebKit ignores both the clipPath and the viewBox scale on composited
    // content inside <foreignObject>: on every iPhone browser the WebGL canvas
    // painted as an unclipped 256px square that hid the eyes.
    const { container } = render(<MeshGradientSVG />);
    expect(container.querySelector("foreignObject")).toBeNull();
    expect(screen.getByTestId("kiro-shader").closest("svg")).toBeNull();
  });

  it("clips the shader to Kiro's body with a CSS mask", () => {
    render(<MeshGradientSVG />);
    const body = screen.getByTestId("kiro-shader").parentElement!;
    expect(body.style.maskImage).toMatch(/^url\("data:image\/svg\+xml,/);
    expect(body.style.maskSize).toBe("100% 100%");
  });

  it("draws the eyes over the body and keeps Kiro's accessible name", () => {
    const { container } = render(<MeshGradientSVG />);
    expect(screen.getByRole("img", { name: "Kiro" })).toBeInTheDocument();
    expect(container.querySelectorAll(".kiro-eye")).toHaveLength(2);
  });
});
