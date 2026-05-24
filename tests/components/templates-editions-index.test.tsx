import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { EditionsIndexTemplate } from "@/components/templates/EditionsIndexTemplate";

describe("EditionsIndexTemplate", () => {
  it("renders the empty state when there are no past editions", () => {
    render(<EditionsIndexTemplate pastEditions={[]} />);
    expect(
      screen.getByRole("heading", { name: /aún no hay ediciones anteriores/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /volver al inicio/i })
    ).toHaveAttribute("href", "/");
  });

  it("renders one card per past edition with the correct link", () => {
    render(<EditionsIndexTemplate pastEditions={["2025", "2024"]} />);
    const link2025 = screen.getByRole("link", { name: /ver edición 2025/i });
    const link2024 = screen.getByRole("link", { name: /ver edición 2024/i });
    expect(link2025).toHaveAttribute("href", "/editions/2025");
    expect(link2024).toHaveAttribute("href", "/editions/2024");
  });

  it("renders the page heading", () => {
    render(<EditionsIndexTemplate pastEditions={["2025"]} />);
    expect(
      screen.getByRole("heading", { level: 1, name: /ediciones anteriores/i })
    ).toBeInTheDocument();
  });
});
