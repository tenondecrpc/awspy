import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FAQTemplate } from "@/components/templates/FAQTemplate";
import { getFAQ } from "@/lib/content/faq";

// Questions are typeset with a non-breaking space before the last word
// (tieLast), so compare the accessible name with whitespace collapsed.
const named = (text: string) => (name: string) =>
  name.replace(/\s+/g, " ") === text;

describe("FAQTemplate", () => {
  it("renders one entry per question from the edition content", () => {
    const items = getFAQ("2026");
    render(<FAQTemplate items={items} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Preguntas frecuentes" })
    ).toBeInTheDocument();
    items.forEach((item) => {
      expect(
        screen.getByRole("heading", { name: named(item.question) })
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
        screen.queryByRole("heading", { name: named(item.question) })
      ).not.toBeInTheDocument();
    });
  });
});
