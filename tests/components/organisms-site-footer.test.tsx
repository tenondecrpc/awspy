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
  cfpSubmissionUrl: null,
  cfpStatus: "upcoming",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awspy.com",
  social: {
    twitter: "https://twitter.com/awspy",
  },
  previousEditions: [],
};

describe("SiteFooter", () => {
  it("renders contact email as a mailto link", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    const link = screen.getByRole("link", { name: FAKE_INFO.contactEmail });
    expect(link).toHaveAttribute(
      "href",
      `mailto:${FAKE_INFO.contactEmail}`
    );
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
  });

  it("renders configured social links with safe attributes", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    const twitter = screen.getByRole("link", { name: "Twitter" });
    expect(twitter).toHaveAttribute("href", "https://twitter.com/awspy");
    expect(twitter).toHaveAttribute("target", "_blank");
    expect(twitter).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("falls back to a 'pronto en redes' message when no social links exist", () => {
    render(
      <SiteFooter eventInfo={{ ...FAKE_INFO, social: {} }} />
    );
    expect(screen.getByText(/próximamente en redes/i)).toBeInTheDocument();
  });

  it("includes the disclaimer about the event being community-organized", () => {
    render(<SiteFooter eventInfo={FAKE_INFO} />);
    expect(
      screen.getByText(/no es un evento oficial de amazon web services/i)
    ).toBeInTheDocument();
  });
});
