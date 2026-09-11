import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SponsorsBoard } from "@/components/organisms/SponsorsBoard";
import type { Sponsor } from "@/lib/content/sponsors";
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
  cfpStatus: "upcoming",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awscommunitydayparaguay.com",
  social: {},
  expectedFigures: [],
  previousEditions: [],
};

const SPONSORS: Sponsor[] = [
  {
    id: "silver-sponsor",
    name: "Silver Sponsor",
    tier: "Silver",
    logo: { light: "https://example.test/silver.svg" },
    url: "https://silver.example",
  },
  {
    id: "platinum-sponsor",
    name: "Platinum Sponsor",
    tier: "Platinum",
    logo: { light: "https://example.test/platinum.svg" },
    url: "https://platinum.example",
  },
];

describe("SponsorsBoard", () => {
  it("renders the empty state with a sponsor mailto when there are no sponsors", () => {
    render(<SponsorsBoard sponsors={[]} eventInfo={EVENT_INFO} />);
    expect(
      screen.getByRole("heading", { name: /sumate como sponsor/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /quiero ser sponsor/i })
    ).toHaveAttribute(
      "href",
      `mailto:${EVENT_INFO.contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`
    );
  });

  it("groups sponsors by tier in canonical order (Platinum before Silver)", () => {
    render(<SponsorsBoard sponsors={SPONSORS} eventInfo={EVENT_INFO} />);
    const tierHeadings = screen.getAllByRole("heading", { level: 2 });
    expect(tierHeadings.map((h) => h.textContent)).toEqual([
      "Platinum",
      "Silver",
    ]);
  });

  it("renders compact variant without tier badges", () => {
    render(
      <SponsorsBoard
        sponsors={SPONSORS}
        eventInfo={EVENT_INFO}
        variant="compact"
      />
    );
    expect(screen.queryByText("Platinum")).not.toBeInTheDocument();
    expect(screen.queryByText("Silver")).not.toBeInTheDocument();
  });
});
