import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/organisms/SiteFooter";
import type { EventInfo } from "@/lib/content/event-info";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const FAKE_INFO: EventInfo = {
  year: "2026",
  name: "AWS Community Day Paraguay 2026",
  tagline: "First edition",
  heroTitle: "AWS Community Day Paraguay 2026",
  heroSubtitle: "Una jornada gratuita",
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
  cfpStatus: "upcoming",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awscommunitydayparaguay.com",
  social: {
    twitter: "https://twitter.com/awspy",
  },
  expectedFigures: [],
  previousEditions: [],
};

describe("SiteFooter", () => {
  it("keeps the event context and column headings", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    expect(screen.getByText("First edition")).toBeInTheDocument();
    expect(screen.getByText("Entrada gratuita")).toBeInTheDocument();
    expect(screen.getByText("Evento")).toBeInTheDocument();
    expect(screen.getByText("Participar")).toBeInTheDocument();
    expect(screen.getByText("Contacto")).toBeInTheDocument();
  });

  it("renders contact email as a mailto link", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    const link = screen.getByRole("link", { name: FAKE_INFO.contactEmail });
    expect(link).toHaveAttribute("href", `mailto:${FAKE_INFO.contactEmail}`);
  });

  it("renders the privacy footer note pointing to Eventbrite's policy", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    const link = screen.getByRole("link", { name: "Eventbrite" });
    expect(link).toHaveAttribute(
      "href",
      "https://www.eventbrite.com/help/en-us/articles/460838/eventbrite-privacy-policy/"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link.className).toContain("underline");
  });

  it("links volunteer applicants to Google's privacy policy", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    const link = screen.getByRole("link", {
      name: "Política de Privacidad de Google",
    });
    expect(link).toHaveAttribute(
      "href",
      "https://policies.google.com/privacy?hl=es-419"
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("states that the site collects no personal data while analytics is off", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    expect(
      screen.getByText(/este sitio no recopila datos personales/i)
    ).toBeInTheDocument();
    expect(screen.queryByText(/google analytics/i)).not.toBeInTheDocument();
  });

  it("discloses Google Analytics cookies when analytics is on", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} analyticsEnabled />);
    const notice = screen.getByText(/usa google analytics/i);
    expect(notice).toHaveTextContent(/guarda cookies en el navegador/i);
    expect(notice).toHaveTextContent(
      /google analytics y google forms están sujetos a la política de privacidad de google/i
    );
    expect(notice).not.toHaveTextContent(/no recopila datos personales/i);
    expect(
      screen.getByRole("link", { name: "Política de Privacidad de Google" })
    ).toHaveAttribute("href", "https://policies.google.com/privacy?hl=es-419");
    expect(
      screen.getByRole("link", { name: "Eventbrite" })
    ).toBeInTheDocument();
  });

  it("renders configured social links with safe attributes", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    const twitter = screen.getByRole("link", { name: "Twitter" });
    expect(twitter).toHaveAttribute("href", "https://twitter.com/awspy");
    expect(twitter).toHaveAttribute("target", "_blank");
    expect(twitter).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("falls back to a 'pronto en redes' message when no social links exist", () => {
    render(<SiteFooter eventInfo={{ ...FAKE_INFO, social: {} }} />);
    expect(screen.getByText(/próximamente en redes/i)).toBeInTheDocument();
  });

  it("includes the disclaimer about the event being community-organized", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    expect(
      screen.getByText(/no es un evento oficial de amazon web services/i)
    ).toBeInTheDocument();
  });
});
