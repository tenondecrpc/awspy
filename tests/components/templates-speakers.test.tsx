import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SpeakersTemplate } from "@/components/templates/SpeakersTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import type { Speaker } from "@/lib/api/sessionize";

const EVENT_INFO = getEventInfo("2026");

const SPEAKERS: Speaker[] = [
  {
    id: "u1",
    slug: "ana-perez",
    firstName: "Ana",
    lastName: "Perez",
    fullName: "Ana Perez",
    tagLine: "Cloud Engineer",
    links: [],
    sessions: [],
  },
];

describe("SpeakersTemplate", () => {
  it("links every speaker to their detail page and counts them", () => {
    render(<SpeakersTemplate speakers={SPEAKERS} eventInfo={EVENT_INFO} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Speakers" })
    ).toBeInTheDocument();
    expect(screen.getByText(/1 persona confirmada/)).toBeInTheDocument();
    // The card exposes more than one link to the same speaker (portrait and
    // name); every one of them must resolve to the detail page.
    const links = screen.getAllByRole("link", { name: /Ana Perez/ });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) =>
      expect(link).toHaveAttribute("href", "/speakers/ana-perez")
    );
  });

  it("keeps detail links inside an archived edition", () => {
    render(
      <SpeakersTemplate
        speakers={SPEAKERS}
        eventInfo={EVENT_INFO}
        basePath="/editions/2026/speakers"
      />
    );

    screen
      .getAllByRole("link", { name: /Ana Perez/ })
      .forEach((link) =>
        expect(link).toHaveAttribute(
          "href",
          "/editions/2026/speakers/ana-perez"
        )
      );
  });

  it("uses the plural count and stays usable with no speakers yet", () => {
    render(<SpeakersTemplate speakers={[]} eventInfo={EVENT_INFO} />);

    expect(screen.getByText(/0 personas confirmadas/)).toBeInTheDocument();
  });
});
