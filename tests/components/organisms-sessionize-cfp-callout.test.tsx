import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionizeCFPCallout } from "@/components/organisms/SessionizeCFPCallout";
import type { EventInfo } from "@/lib/content/event-info";

const BASE: EventInfo = {
  year: "2026",
  name: "AWS Community Day Paraguay 2026",
  tagline: "x",
  heroTitle: "x",
  heroSubtitle: "x",
  dates: {
    start: "2026-09-12T13:00:00-03:00",
    end: "2026-09-12T22:00:00-03:00",
  },
  location: { city: "Asuncion", country: "Paraguay", summary: "Asuncion" },
  sessionizeEventId: null,
  eventbriteEventUrl: null,
  volunteerRegistrationUrl: null,
  volunteerRegistrationStatus: "upcoming",
  cfpSubmissionUrl: null,
  cfpStatus: "open",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awscommunitydayparaguay.com",
  social: {},
  previousEditions: [],
};

describe("SessionizeCFPCallout", () => {
  it("renders the open state with the submission URL when CFP is open", () => {
    render(
      <SessionizeCFPCallout
        eventInfo={{
          ...BASE,
          cfpStatus: "open",
          cfpSubmissionUrl: "https://sessionize.com/awspy",
          cfpDeadline: "2026-08-01T23:59:59-03:00",
        }}
      />
    );
    expect(screen.getByText(/convocatoria abierta/i)).toBeInTheDocument();
    const cta = screen.getByRole("link", {
      name: /enviar propuesta en sessionize/i,
    });
    expect(cta).toHaveAttribute("href", "https://sessionize.com/awspy");
    expect(cta).toHaveAttribute("target", "_blank");
    expect(cta).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the upcoming state with a mailto fallback when CFP is upcoming", () => {
    render(
      <SessionizeCFPCallout eventInfo={{ ...BASE, cfpStatus: "upcoming" }} />
    );
    expect(screen.getByText(/convocatoria próximamente/i)).toBeInTheDocument();
    const link = screen.getByRole("link", {
      name: /avisame de la convocatoria/i,
    });
    expect(link).toHaveAttribute(
      "href",
      "mailto:hola@awscommunitydayparaguay.com?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20charlas"
    );
  });

  it("renders the closed state pointing visitors at the speakers list", () => {
    render(
      <SessionizeCFPCallout
        eventInfo={{
          ...BASE,
          cfpStatus: "closed",
          cfpDeadline: "2025-08-01T23:59:59-03:00",
        }}
      />
    );
    expect(screen.getByText(/convocatoria cerrada/i)).toBeInTheDocument();
    expect(screen.getByText(/cerró el/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /ver speakers confirmados/i })
    ).toHaveAttribute("href", "/speakers");
  });

  it("falls back to the upcoming state copy when CFP is open but no URL is configured", () => {
    render(
      <SessionizeCFPCallout
        eventInfo={{ ...BASE, cfpStatus: "open", cfpSubmissionUrl: null }}
      />
    );
    // CTA should NOT be the Sessionize link.
    expect(
      screen.queryByRole("link", { name: /enviar propuesta en sessionize/i })
    ).not.toBeInTheDocument();
  });
});
