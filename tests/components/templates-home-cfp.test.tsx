import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getVenue } from "@/lib/content/venue";
import type { EventInfo } from "@/lib/content/event-info";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function closingSection() {
  return screen
    .getByRole("heading", { name: /^Te esperamos en/ })
    .closest("section") as HTMLElement;
}

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

describe("HomeTemplate closing invitation", () => {
  // The card used to hard-code "30 de septiembre" and kept announcing it
  // after the deadline moved in event.json and Sessionize.
  it("announces the deadline from event.json", () => {
    renderHome({
      ...getEventInfo("2026"),
      cfpDeadline: "2026-10-10T23:59:00-03:00",
    });

    const section = closingSection();
    expect(
      within(section).getByRole("link", { name: "Proponer una charla" })
    ).toBeInTheDocument();
    expect(section.textContent).toContain(
      "Convocatoria de charlas abierta en Sessionize hasta el sábado, 10 de octubre de 2026."
    );
  });

  it("omits the date when no deadline is configured", () => {
    renderHome({ ...getEventInfo("2026"), cfpDeadline: null });

    const section = closingSection();
    expect(
      within(section).getByRole("link", { name: "Proponer una charla" })
    ).toBeInTheDocument();
    expect(section.textContent).toContain(
      "Convocatoria de charlas abierta en Sessionize."
    );
    expect(section.textContent).not.toContain("hasta el");
  });

  // Actions are buttons with visual weight, not links buried in a sentence.
  it("offers registering, a talk and volunteering as three separate actions", () => {
    renderHome(getEventInfo("2026"));

    const section = closingSection();
    expect(
      within(section).getByRole("link", { name: "Registrarme" })
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("link", { name: "Proponer una charla" })
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("link", { name: "Ser voluntario/a" })
    ).toBeInTheDocument();
  });
});
