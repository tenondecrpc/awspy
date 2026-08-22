import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpeakersGrid } from "@/components/organisms/SpeakersGrid";
import type { Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

vi.mock("next/image", () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} />
  ),
}));

const EVENT_INFO: EventInfo = {
  year: "2026",
  name: "AWS Community Day Paraguay 2026",
  tagline: "First edition",
  heroTitle: "x",
  heroSubtitle: "y",
  dates: {
    start: "2026-09-12T13:00:00-03:00",
    end: "2026-09-12T22:00:00-03:00",
  },
  location: { city: "Asuncion", country: "Paraguay", summary: "Asuncion" },
  sessionizeEventId: "jl4ktls0",
  eventbriteEventUrl: null,
  cfpSubmissionUrl: "https://sessionize.com/awspy",
  cfpStatus: "open",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awscommunitydayparaguay.com",
  social: {},
  previousEditions: [],
};

const speakers: Speaker[] = [
  {
    id: "1",
    slug: "ana-perez",
    firstName: "Ana",
    lastName: "Perez",
    fullName: "Ana Perez",
    links: [],
    sessions: [],
  },
  {
    id: "2",
    slug: "beto-lopez",
    firstName: "Beto",
    lastName: "Lopez",
    fullName: "Beto Lopez",
    links: [],
    sessions: [],
  },
];

describe("SpeakersGrid", () => {
  it("renders one card per speaker", () => {
    render(<SpeakersGrid speakers={speakers} eventInfo={EVENT_INFO} />);
    expect(screen.getByRole("link", { name: "Ana Perez" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Beto Lopez" })
    ).toBeInTheDocument();
  });

  it("renders the empty state when there are no speakers", () => {
    render(<SpeakersGrid speakers={[]} eventInfo={EVENT_INFO} />);
    expect(
      screen.getByRole("heading", { name: /pronto anunciamos/i })
    ).toBeInTheDocument();
  });

  it("links the empty state CTA to /cfp when CFP is open", () => {
    render(<SpeakersGrid speakers={[]} eventInfo={EVENT_INFO} />);
    expect(
      screen.getByRole("link", { name: /enviar mi charla/i })
    ).toHaveAttribute("href", "/cfp");
  });

  it("falls back to mailto when CFP is not open", () => {
    render(
      <SpeakersGrid
        speakers={[]}
        eventInfo={{ ...EVENT_INFO, cfpStatus: "upcoming" }}
      />
    );
    expect(screen.getByRole("link", { name: /escribirnos/i })).toHaveAttribute(
      "href",
      `mailto:${EVENT_INFO.contactEmail}`
    );
  });
});
