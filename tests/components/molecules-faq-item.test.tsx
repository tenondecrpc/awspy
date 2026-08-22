import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { FAQItem } from "@/components/molecules/FAQItem";

const ITEM = {
  id: "que-es",
  question: "¿Qué es el evento?",
  answer: "Es una jornada gratuita de la comunidad AWS.",
};

describe("FAQItem", () => {
  it("renders the question as a button", () => {
    render(<FAQItem item={ITEM} />);
    expect(
      screen.getByRole("button", { name: "¿Qué es el evento?" })
    ).toBeInTheDocument();
  });

  it("starts collapsed by default", () => {
    render(<FAQItem item={ITEM} />);
    const trigger = screen.getByRole("button", { name: "¿Qué es el evento?" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    // Region exists and is hidden via the `hidden` attribute (not in the
    // accessibility tree).
    expect(screen.queryByRole("region")).toBeNull();
  });

  it("starts open when defaultOpen is set", () => {
    render(<FAQItem item={ITEM} defaultOpen />);
    expect(
      screen.getByRole("button", { name: "¿Qué es el evento?" })
    ).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("region", { name: "¿Qué es el evento?" })
    ).toBeInTheDocument();
    expect(screen.getByText(/jornada gratuita/i)).toBeInTheDocument();
  });

  it("toggles via click and updates aria-expanded", () => {
    render(<FAQItem item={ITEM} />);
    const trigger = screen.getByRole("button", { name: "¿Qué es el evento?" });
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/jornada gratuita/i)).toBeVisible();
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("links the trigger and the panel via aria-controls / aria-labelledby", () => {
    render(<FAQItem item={ITEM} defaultOpen />);
    const trigger = screen.getByRole("button");
    const panel = screen.getByRole("region");
    expect(trigger).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", trigger.id);
  });
});
