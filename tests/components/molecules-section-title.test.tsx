import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SectionTitle } from "@/components/molecules/SectionPrimitives";

// Two arbitrary color utilities on one element resolve by stylesheet order,
// not class order, and the paper ink is emitted last. A title on the navy band
// that still carried it was painted navy on navy.
describe("SectionTitle", () => {
  it("sets a title on the navy band in the inverse ink only", () => {
    render(<SectionTitle size="lg" title="Keynote speakers" onDark />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("text-[var(--color-text-on-inverse)]");
    expect(heading.className).not.toContain("text-[var(--color-text-primary)]");
  });

  it("keeps the paper ink on light sections", () => {
    render(<SectionTitle title="Agenda del día" />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading.className).toContain("text-[var(--color-text-primary)]");
  });
});
