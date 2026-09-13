import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TeamTemplate } from "@/components/templates/TeamTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getOrganizers } from "@/lib/content/organizers";

const EVENT_INFO = getEventInfo("2026");

describe("TeamTemplate", () => {
  it("lists every organizer from the edition content", () => {
    const organizers = getOrganizers("2026");
    render(<TeamTemplate organizers={organizers} eventInfo={EVENT_INFO} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Equipo organizador" })
    ).toBeInTheDocument();
    organizers.forEach((organizer) => {
      expect(screen.getByText(organizer.name)).toBeInTheDocument();
    });
  });

  it("scopes the volunteer invitation to the given edition", () => {
    render(
      <TeamTemplate
        organizers={[]}
        eventInfo={EVENT_INFO}
        volunteersHref="/editions/2026/volunteers"
      />
    );

    expect(
      screen.getByRole("link", { name: /Quiero ser voluntario\/a/ })
    ).toHaveAttribute("href", "/editions/2026/volunteers");
  });
});
