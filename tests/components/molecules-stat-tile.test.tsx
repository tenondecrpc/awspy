import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatTile } from "@/components/molecules/StatTile";

describe("StatTile", () => {
  it("renders the value and its label", () => {
    render(<StatTile value="200+" label="Asistentes" />);
    expect(screen.getByText("200+")).toBeInTheDocument();
    expect(screen.getByText("Asistentes")).toBeInTheDocument();
  });

  it("keeps the figure as written, including a trailing plus", () => {
    render(<StatTile value="8+" label="Horas de contenido" />);
    expect(screen.getByText("8+")).toBeInTheDocument();
  });

  it("leaves the value in proportional figures", () => {
    // `tabular-nums` widens every digit to a zero, which reads loose at
    // display sizes. See the stat-tile contract in the dataviz guidance.
    const { container } = render(<StatTile value="15+" label="Sesiones" />);
    expect(container.innerHTML).not.toContain("tabular-nums");
  });
});
