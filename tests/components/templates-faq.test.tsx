import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FAQTemplate } from "@/components/templates/FAQTemplate";
import { getFAQ } from "@/lib/content/faq";

describe("FAQTemplate", () => {
  it("renders one entry per question from the edition content", () => {
    const items = getFAQ("2026");
    render(<FAQTemplate items={items} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Preguntas frecuentes" })
    ).toBeInTheDocument();
    items.forEach((item) => {
      expect(
        screen.getByRole("heading", { name: item.question })
      ).toBeInTheDocument();
    });
  });

  it("explains the gap instead of rendering an empty list", () => {
    render(<FAQTemplate items={[]} />);

    expect(
      screen.getByText(/Estamos preparando las preguntas frecuentes/)
    ).toBeInTheDocument();
    // The contact section below stays; only the question list disappears.
    getFAQ("2026").forEach((item) => {
      expect(
        screen.queryByRole("heading", { name: item.question })
      ).not.toBeInTheDocument();
    });
  });
});
