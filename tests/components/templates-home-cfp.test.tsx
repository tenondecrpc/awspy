import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getVenue } from "@/lib/content/venue";
import type { EventInfo } from "@/lib/content/event-info";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function renderHome(eventInfo: EventInfo) {
  return render(
    <HomeTemplate
      eventInfo={eventInfo}
      venue={getVenue("2026")}
      speakers={[]}
      sponsors={[]}
      faq={[]}
      organizers={[]}
    />
  );
}

describe("HomeTemplate call for speakers card", () => {
  // The card used to hard-code "30 de septiembre" and kept announcing it
  // after the deadline moved in event.json and Sessionize.
  it("announces the deadline from event.json", () => {
    renderHome({
      ...getEventInfo("2026"),
      cfpDeadline: "2026-10-10T23:59:00-03:00",
    });

    expect(
      screen.getByText(
        "Convocatoria de charlas abierta en Sessionize hasta el sábado, 10 de octubre de 2026."
      )
    ).toBeInTheDocument();
  });

  it("omits the date when no deadline is configured", () => {
    renderHome({ ...getEventInfo("2026"), cfpDeadline: null });

    expect(
      screen.getByText("Convocatoria de charlas abierta en Sessionize.")
    ).toBeInTheDocument();
  });
});
