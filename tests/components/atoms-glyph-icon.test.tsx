import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";

describe("GlyphIcon", () => {
  it("is hidden from assistive technology and unfocusable", () => {
    const { container } = render(<GlyphIcon name="calendar" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("focusable", "false");
  });

  it("renders at the requested square size and inherits currentColor", () => {
    const { container } = render(<GlyphIcon name="pin" size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
    expect(svg).toHaveAttribute("height", "32");
    expect(svg).toHaveAttribute("stroke", "currentColor");
  });

  it("draws a distinct path per glyph name", () => {
    const { container: a } = render(<GlyphIcon name="clock" />);
    const { container: b } = render(<GlyphIcon name="users" />);
    const pathA = a.querySelector("path")?.getAttribute("d");
    const pathB = b.querySelector("path")?.getAttribute("d");
    expect(pathA).toBeTruthy();
    expect(pathB).toBeTruthy();
    expect(pathA).not.toEqual(pathB);
  });
});
