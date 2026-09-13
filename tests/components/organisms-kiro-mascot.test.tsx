import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { KiroMascot } from "@/components/organisms/KiroMascot";
import type { FAQItem } from "@/lib/content/faq";

// The mascot's body is a WebGL mesh gradient; jsdom has no WebGL context, and
// the shader is decoration, so it is stubbed out here.
vi.mock("@/components/atoms/MeshGradientSVG", () => ({
  MeshGradientSVG: () => <span data-testid="kiro-shader" />,
}));

const FAQ: FAQItem[] = [
  {
    id: "precio",
    question: "¿Cuánto cuesta la entrada?",
    answer: "El acceso es gratuito, con registro previo.",
  },
  {
    id: "idioma",
    question: "¿En qué idioma son las charlas?",
    answer: "En español.",
  },
];

describe("KiroMascot", () => {
  it("stays closed until the visitor opens it", () => {
    render(<KiroMascot faq={FAQ} />);

    expect(
      screen.getByRole("button", { name: "Abrir chat de Kiro" })
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("answers a suggested question with its FAQ entry", async () => {
    const user = userEvent.setup();
    render(<KiroMascot faq={FAQ} />);

    await user.click(
      screen.getByRole("button", { name: "Abrir chat de Kiro" })
    );
    const panel = screen.getByRole("dialog", {
      name: /Chat de preguntas frecuentes con Kiro/i,
    });
    expect(panel).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "¿Cuánto cuesta la entrada?" })
    );

    expect(
      screen.getByText("El acceso es gratuito, con registro previo.")
    ).toBeInTheDocument();
    // An answered question is not offered again.
    expect(
      screen.queryByRole("button", { name: "¿Cuánto cuesta la entrada?" })
    ).not.toBeInTheDocument();
  });

  it("points to the FAQ page once every question has been asked", async () => {
    const user = userEvent.setup();
    render(<KiroMascot faq={FAQ} />);

    await user.click(
      screen.getByRole("button", { name: "Abrir chat de Kiro" })
    );
    for (const item of FAQ) {
      await user.click(screen.getByRole("button", { name: item.question }));
    }

    expect(screen.getByRole("link", { name: "página de FAQ" })).toHaveAttribute(
      "href",
      "/faq"
    );
  });

  it("closes on Escape and returns focus to the toggle", async () => {
    const user = userEvent.setup();
    render(<KiroMascot faq={FAQ} />);

    const toggle = screen.getByRole("button", { name: "Abrir chat de Kiro" });
    await user.click(toggle);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Abrir chat de Kiro" })
    ).toHaveFocus();
  });

  it("survives an edition with no FAQ entries", () => {
    render(<KiroMascot />);

    expect(
      screen.getByRole("button", { name: "Abrir chat de Kiro" })
    ).toBeInTheDocument();
  });
});
