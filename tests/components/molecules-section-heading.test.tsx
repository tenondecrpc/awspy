import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "@/components/molecules/SectionHeading";

describe("SectionHeading", () => {
  it("renders the title at the requested semantic level", () => {
    render(<SectionHeading level={1} title="Speakers" />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Speakers" })
    ).toBeInTheDocument();
  });

  it("folds the highlight into the same accessible name", () => {
    render(
      <SectionHeading level={2} title="Conocé a los" highlight="speakers" />
    );
    expect(
      screen.getByRole("heading", { level: 2, name: "Conocé a los speakers" })
    ).toBeInTheDocument();
  });

  it("keeps the visual size independent from the semantic level", () => {
    render(<SectionHeading level={2} visualLevel={4} title="Gold" />);
    const heading = screen.getByRole("heading", { level: 2, name: "Gold" });
    expect(heading.className).toContain("text-xl");
  });

  it("renders the eyebrow, the description, and the CTA slot", () => {
    render(
      <SectionHeading
        level={2}
        eyebrow="Sponsors"
        title="Quienes hacen posible"
        highlight="el evento"
        description="Gracias a estas organizaciones."
      >
        <a href="/sponsors">Ver todos</a>
      </SectionHeading>
    );
    expect(screen.getByText("Sponsors")).toBeInTheDocument();
    expect(
      screen.getByText("Gracias a estas organizaciones.")
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ver todos" })).toHaveAttribute(
      "href",
      "/sponsors"
    );
  });

  it("forwards the id so a section can reference it with aria-labelledby", () => {
    render(<SectionHeading level={2} id="about-title" title="Sobre" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveAttribute(
      "id",
      "about-title"
    );
  });
});
