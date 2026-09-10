import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VolunteerCallout } from "@/components/organisms/VolunteerCallout";
import { getEventInfo } from "@/lib/content/event-info";

const EVENT_INFO = getEventInfo("2026");

describe("VolunteerCallout", () => {
  it("renders the open state with a safe external form link", () => {
    render(<VolunteerCallout eventInfo={EVENT_INFO} />);

    expect(screen.getByText("Convocatoria abierta")).toBeInTheDocument();
    const link = screen.getByRole("link", {
      name: "Completar formulario de voluntariado",
    });
    expect(link).toHaveAttribute(
      "href",
      "https://docs.google.com/forms/d/1GIKrU2urGvaUg-CixQY3PknkdhSIZo2hSKm3PQZhlEc/viewform"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("falls back to a mailto link when the open form URL is missing", () => {
    render(
      <VolunteerCallout
        eventInfo={{ ...EVENT_INFO, volunteerRegistrationUrl: null }}
      />
    );

    expect(screen.getByText("Convocatoria próximamente")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Completar formulario de voluntariado",
      })
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Avisame por mail" })
    ).toHaveAttribute(
      "href",
      "mailto:awscommunitydayparaguay@gmail.com?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20voluntariado"
    );
  });

  it("renders a closed notice without a registration action", () => {
    render(
      <VolunteerCallout
        eventInfo={{
          ...EVENT_INFO,
          volunteerRegistrationStatus: "closed",
        }}
      />
    );

    expect(screen.getByText("Convocatoria cerrada")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", {
        name: "Completar formulario de voluntariado",
      })
    ).not.toBeInTheDocument();
  });

  it("lists what helping involves while the call is not closed", () => {
    render(<VolunteerCallout eventInfo={EVENT_INFO} />);
    expect(screen.getByText(/en qué podés ayudar/i)).toBeInTheDocument();
    expect(
      screen.getByText("Acreditación y bienvenida de asistentes")
    ).toBeInTheDocument();
  });

  it("drops the task list once the call is closed", () => {
    render(
      <VolunteerCallout
        eventInfo={{ ...EVENT_INFO, volunteerRegistrationStatus: "closed" }}
      />
    );
    expect(screen.queryByText(/en qué podés ayudar/i)).not.toBeInTheDocument();
  });
});
