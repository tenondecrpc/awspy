import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EyebrowPill } from "@/components/atoms/EyebrowPill";

describe("EyebrowPill", () => {
  it("renders its label as text", () => {
    render(<EyebrowPill>Speakers</EyebrowPill>);
    expect(screen.getByText("Speakers")).toBeInTheDocument();
  });

  it("keeps the optional glyph decorative so the label carries the meaning", () => {
    const { container } = render(
      <EyebrowPill glyph="mic">Speakers</EyebrowPill>
    );
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true"
    );
    // The accessible text is unchanged by the glyph.
    expect(screen.getByText("Speakers")).toBeInTheDocument();
  });

  it("uses the frosted panel helper over dark tones", () => {
    const { container } = render(
      <EyebrowPill tone="hero">Keynote</EyebrowPill>
    );
    expect(container.firstElementChild?.className).toContain("glass-panel");
  });

  it("uses palette tokens - never a color literal - on light tones", () => {
    const { container } = render(
      <EyebrowPill tone="default">Agenda</EyebrowPill>
    );
    const className = container.firstElementChild?.className ?? "";
    expect(className).toMatch(/var\(--color-accent-soft\)/);
    expect(className).not.toMatch(/#[0-9a-fA-F]{3,8}/);
  });
});
