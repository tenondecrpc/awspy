import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrganizersGrid } from "@/components/organisms/OrganizersGrid";
import type { Organizer } from "@/lib/content/organizers";
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
  dates: { start: "2026-09-12T13:00:00-03:00", end: "2026-09-12T22:00:00-03:00" },
  location: { city: "Asuncion", country: "Paraguay", summary: "Asuncion" },
  sessionizeEventId: null,
  eventbriteEventUrl: null,
  cfpSubmissionUrl: null,
  cfpStatus: "upcoming",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awscommunitydayparaguay.com",
  social: {},
  previousEditions: [],
};

const ORGANIZERS: Organizer[] = [
  {
    id: "ana-perez",
    name: "Ana Perez",
    role: "Lead",
    links: { linkedin: "https://linkedin.com/in/ana" },
  },
  { id: "beto-lopez", name: "Beto Lopez", role: "Logística", links: {} },
];

describe("OrganizersGrid", () => {
  it("renders the empty state with a volunteer mailto when there are no organizers", () => {
    render(<OrganizersGrid organizers={[]} eventInfo={EVENT_INFO} />);
    expect(
      screen.getByRole("heading", { name: /equipo en formación/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /quiero colaborar/i })
    ).toHaveAttribute(
      "href",
      `mailto:${EVENT_INFO.contactEmail}?subject=Voluntariado%20AWS%20Community%20Day%20Paraguay`
    );
  });

  it("renders one card per organizer", () => {
    render(<OrganizersGrid organizers={ORGANIZERS} eventInfo={EVENT_INFO} />);
    expect(screen.getByText("Ana Perez")).toBeInTheDocument();
    expect(screen.getByText("Beto Lopez")).toBeInTheDocument();
  });

  it("renders organizer social links with safe attributes", () => {
    render(<OrganizersGrid organizers={ORGANIZERS} eventInfo={EVENT_INFO} />);
    const link = screen.getByRole("link", { name: "LinkedIn" });
    expect(link).toHaveAttribute("href", "https://linkedin.com/in/ana");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
