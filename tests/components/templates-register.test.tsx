import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RegisterTemplate } from "@/components/templates/RegisterTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import type { EventInfo } from "@/lib/content/event-info";

const BASE = getEventInfo("2026");

function withStatus(
  registrationStatus: EventInfo["registrationStatus"]
): EventInfo {
  return { ...BASE, registrationStatus };
}

describe("RegisterTemplate", () => {
  it("offers the Eventbrite link while registration is open", () => {
    render(<RegisterTemplate eventInfo={withStatus("open")} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Registro" })
    ).toBeInTheDocument();
    expect(screen.getByText("Registro abierto")).toBeInTheDocument();

    const cta = screen.getByRole("link", {
      name: /Reservar mi lugar en Eventbrite/i,
    });
    expect(cta).toHaveAttribute("href", BASE.eventbriteEventUrl);
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("invites visitors to be notified while registration is upcoming", () => {
    render(<RegisterTemplate eventInfo={withStatus("upcoming")} />);

    expect(screen.getByText("Registro próximamente")).toBeInTheDocument();
    expect(screen.getByText(/Aún no abrimos el registro/)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Reservar mi lugar en Eventbrite/i })
    ).not.toBeInTheDocument();
  });

  it("falls back to the contact address once registration closes", () => {
    render(<RegisterTemplate eventInfo={withStatus("closed")} />);

    expect(screen.getByText("Registro cerrado")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: BASE.contactEmail })
    ).toHaveAttribute("href", `mailto:${BASE.contactEmail}`);
  });

  it("renders only the finished-edition notice when archived (FR-035)", () => {
    render(<RegisterTemplate eventInfo={withStatus("open")} archived />);

    // `archived` must win over an open registration status, so an archived
    // edition can never send visitors to a live Eventbrite page.
    expect(screen.getByText("Edición finalizada")).toBeInTheDocument();
    expect(screen.getByText(/Esta edición ya finalizó/)).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /Reservar mi lugar en Eventbrite/i })
    ).not.toBeInTheDocument();
  });
});
