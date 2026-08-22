import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FAQList } from "@/components/organisms/FAQList";

describe("FAQList", () => {
  it("renders the empty state when there are no items", () => {
    render(<FAQList items={[]} />);
    expect(
      screen.getByRole("heading", { name: /preparando las preguntas/i })
    ).toBeInTheDocument();
  });

  it("renders one accordion item per question", () => {
    render(
      <FAQList
        items={[
          { id: "q1", question: "Pregunta 1", answer: "Respuesta 1" },
          { id: "q2", question: "Pregunta 2", answer: "Respuesta 2" },
        ]}
      />
    );
    expect(
      screen.getByRole("button", { name: "Pregunta 1" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Pregunta 2" })
    ).toBeInTheDocument();
  });

  it("opens the first item by default for visual context", () => {
    render(
      <FAQList
        items={[
          { id: "q1", question: "Pregunta 1", answer: "Respuesta 1" },
          { id: "q2", question: "Pregunta 2", answer: "Respuesta 2" },
        ]}
      />
    );
    expect(screen.getByRole("button", { name: "Pregunta 1" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByRole("button", { name: "Pregunta 2" })).toHaveAttribute(
      "aria-expanded",
      "false"
    );
  });
});
