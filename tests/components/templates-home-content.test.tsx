import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getSponsors } from "@/lib/content/sponsors";
import { getSponsorship } from "@/lib/content/sponsorship";
import { getVenue } from "@/lib/content/venue";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const eventInfo = getEventInfo("2026");

function renderHome() {
  render(
    <HomeTemplate
      eventInfo={eventInfo}
      venue={getVenue("2026")}
      speakers={[]}
      sponsors={getSponsors("2026")}
      sponsorship={getSponsorship("2026")}
      faq={[]}
      organizers={[]}
    />
  );
}

describe("HomeTemplate public content", () => {
  it("keeps the projections and the four reasons to attend", () => {
    renderHome();
    const figures = screen
      .getByRole("heading", {
        name: "Esperamos contar con",
      })
      .closest("section") as HTMLElement;
    eventInfo.expectedFigures.forEach((figure) => {
      expect(within(figures).getByText(figure.label)).toBeInTheDocument();
      expect(within(figures).getByText(figure.value)).toBeInTheDocument();
    });
    [
      "Contenido técnico real",
      "Hecho por la comunidad",
      "Entrada libre",
      "Talleres hands-on",
    ].forEach((title) =>
      expect(screen.getByRole("heading", { name: title })).toBeInTheDocument()
    );
  });

  it("offers open logo slots and a direct sponsor contact", () => {
    renderHome();
    const sponsors = document.getElementById("sponsors") as HTMLElement;
    expect(
      within(sponsors).getByRole("link", {
        name: "Sumá tu organización",
      })
    ).toHaveAttribute("href", "/sponsors");
    expect(
      within(sponsors).getByRole("link", { name: "Escribinos" })
    ).toHaveAttribute(
      "href",
      `mailto:${eventInfo.contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`
    );
  });

  it("keeps three separate ways to participate", () => {
    renderHome();
    const section = document.getElementById("participar") as HTMLElement;
    expect(
      within(section).getByText("Tres formas de ser parte.")
    ).toBeInTheDocument();
    expect(
      within(section).getByRole("link", { name: "Registrarme" })
    ).toHaveAttribute("href", "/register");
    expect(
      within(section).getByRole("link", { name: "Proponer una charla" })
    ).toHaveAttribute("href", "/cfp");
    expect(
      within(section).getByRole("link", { name: "Ser voluntario/a" })
    ).toHaveAttribute("href", "/volunteers");
  });
});
