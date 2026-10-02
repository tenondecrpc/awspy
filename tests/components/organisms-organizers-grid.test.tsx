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
  dates: {
    start: "2026-09-12T13:00:00-03:00",
    end: "2026-09-12T22:00:00-03:00",
  },
  location: { city: "Asuncion", country: "Paraguay", summary: "Asuncion" },
  sessionizeEventId: null,
  eventbriteEventUrl: null,
  volunteerRegistrationUrl: "https://docs.google.com/forms/d/example/viewform",
  volunteerRegistrationStatus: "open",
  cfpSubmissionUrl: null,
  cfpStatus: "upcoming",
  cfpDeadline: null,
  registrationStatus: "upcoming",
  contactEmail: "hola@awscommunitydayparaguay.com",
  social: {},
  expectedFigures: [],
  previousEditions: [],
};

const ORGANIZERS: Organizer[] = [
  {
    id: "ana-perez",
    name: "Ana Perez",
    role: "Lead",
    bio: "Coordina el comité y la relación con la comunidad local.",
    photo: "/team/ana-perez.jpg",
    links: { linkedin: "https://linkedin.com/in/ana" },
  },
  { id: "beto-lopez", name: "Beto Lopez", role: "Logística", links: {} },
];

describe("OrganizersGrid", () => {
  it("renders the empty state with a link to volunteer registration", () => {
    render(<OrganizersGrid organizers={[]} eventInfo={EVENT_INFO} />);
    expect(
      screen.getByRole("heading", { name: /equipo en formación/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /quiero colaborar/i })
    ).toHaveAttribute("href", "/volunteers");
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

  it("renders the bio when the record carries one", () => {
    render(<OrganizersGrid organizers={ORGANIZERS} eventInfo={EVENT_INFO} />);
    expect(
      screen.getByText(/coordina el comité y la relación/i)
    ).toBeInTheDocument();
  });

  it("shows the full bio and labels the website link", () => {
    const organizer = {
      ...ORGANIZERS[0],
      bio: "Una biografía extensa para la tarjeta. ".repeat(8),
      links: { website: "https://example.test" },
    };
    render(<OrganizersGrid organizers={[organizer]} eventInfo={EVENT_INFO} />);
    const bio = screen.getByText(/una biografía extensa/i);
    expect(bio.className).not.toContain("line-clamp");
    expect(screen.getByRole("link", { name: "Sitio web" })).toHaveAttribute(
      "href",
      "https://example.test"
    );
  });

  it("omits the bio paragraph for a record without one", () => {
    render(
      <OrganizersGrid organizers={[ORGANIZERS[1]]} eventInfo={EVENT_INFO} />
    );
    const card = screen.getByText("Beto Lopez").closest("article");
    // Only the role line remains: no bio paragraph.
    expect(card?.querySelectorAll("p")).toHaveLength(1);
    expect(card?.querySelector("p")).toHaveTextContent("Logística");
  });

  it("uses the repo photo as the card image, named after the organizer", () => {
    render(<OrganizersGrid organizers={ORGANIZERS} eventInfo={EVENT_INFO} />);
    const image = document.querySelector('img[src="/team/ana-perez.jpg"]');
    expect(image).not.toBeNull();
    expect(image).toHaveAttribute("alt", "Ana Perez");
  });

  it("falls back to initials when there is no photo", () => {
    render(
      <OrganizersGrid organizers={[ORGANIZERS[1]]} eventInfo={EVENT_INFO} />
    );
    expect(screen.getByText("BL")).toBeInTheDocument();
  });
});
