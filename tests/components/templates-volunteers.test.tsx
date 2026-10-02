import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VolunteersTemplate } from "@/components/templates/VolunteersTemplate";
import { getEventInfo } from "@/lib/content/event-info";

const EVENT_INFO = getEventInfo("2026");

describe("VolunteersTemplate", () => {
  it("renders the active volunteer application", () => {
    render(<VolunteersTemplate eventInfo={EVENT_INFO} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Voluntariado" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: "Completar formulario de voluntariado",
      })
    ).toHaveAttribute("href", EVENT_INFO.volunteerRegistrationUrl);
    expect(screen.getByText("Compromiso")).toBeInTheDocument();
    expect(screen.getByText("Un turno durante el evento")).toBeInTheDocument();
    expect(screen.getByText("Remera oficial y almuerzo")).toBeInTheDocument();
    expect(screen.getByText("Ninguno, solo ganas")).toBeInTheDocument();
    expect(
      screen.queryByText(/recorrido con el equipo/i)
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/foto del equipo completo/i)
    ).not.toBeInTheDocument();
  });

  it("renders the archived notice without an application link", () => {
    render(<VolunteersTemplate eventInfo={EVENT_INFO} archived />);

    expect(screen.getByText(/esta edición ya finalizó/i)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Completar formulario de voluntariado",
      })
    ).not.toBeInTheDocument();
  });
});
