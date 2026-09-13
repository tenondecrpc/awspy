import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CFPTemplate } from "@/components/templates/CFPTemplate";
import { getEventInfo } from "@/lib/content/event-info";

const EVENT_INFO = getEventInfo("2026");

describe("CFPTemplate", () => {
  it("shows the call for papers with its formats and criteria", () => {
    render(<CFPTemplate eventInfo={EVENT_INFO} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Proponé una charla" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Formatos" })
    ).toBeInTheDocument();
    expect(screen.getByText("Charla técnica")).toBeInTheDocument();
    expect(screen.getByText("Lightning talk")).toBeInTheDocument();
  });

  it("renders only the finished-edition notice when archived (FR-035)", () => {
    render(<CFPTemplate eventInfo={EVENT_INFO} archived />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Proponé una charla" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/La convocatoria de charlas no está disponible/)
    ).toBeInTheDocument();
    expect(screen.queryByText("Formatos")).not.toBeInTheDocument();
  });
});
