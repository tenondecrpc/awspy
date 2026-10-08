import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import { getVenue } from "@/lib/content/venue";
import type { KeynoteCardData } from "@/lib/utils/keynotes";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

const NELLY: KeynoteCardData = {
  id: "nelly-andrade",
  name: "Nelly Andrade",
  role: "Head of Developer Relations LATAM at AWS",
  organization: "Amazon Web Services",
  photo: "/assets/keynotes/nelly-andrade.jpg",
  linkedinUrl: "https://www.linkedin.com/in/nelly-andrade",
};

const CRISTIAN: KeynoteCardData = {
  id: "cristian-yegros",
  name: "Cristian Yegros",
  role: "Director - CTA Paraguay Corea - SNPP",
  organization: "Servicio Nacional de Promoción Profesional",
  photo: "/assets/keynotes/cristian-yegros.jpg",
  linkedinUrl: null,
};

function renderHome(keynotes?: KeynoteCardData[]) {
  render(
    <HomeTemplate
      eventInfo={getEventInfo("2026")}
      venue={getVenue("2026")}
      speakers={[]}
      keynotes={keynotes}
      sponsors={[]}
      faq={[]}
      organizers={[]}
    />
  );
  return document.getElementById("keynotes");
}

describe("HomeTemplate keynotes", () => {
  it("presents each keynote with photo, role and organization", () => {
    const section = renderHome([NELLY, CRISTIAN]) as HTMLElement;

    expect(
      within(section).getByRole("heading", {
        level: 2,
        name: "Keynote speakers",
      })
    ).toBeInTheDocument();
    for (const k of [NELLY, CRISTIAN]) {
      expect(
        within(section).getByRole("heading", { level: 3, name: k.name })
      ).toBeInTheDocument();
      expect(within(section).getByRole("img", { name: k.name })).toBeVisible();
      expect(within(section).getByText(k.role)).toBeInTheDocument();
      expect(within(section).getByText(k.organization)).toBeInTheDocument();
    }
  });

  it("links LinkedIn only where Sessionize provided it", () => {
    const section = renderHome([NELLY, CRISTIAN]) as HTMLElement;

    const links = within(section).getAllByRole("link");
    expect(links).toHaveLength(1);
    const linkedin = within(section).getByRole("link", {
      name: "LinkedIn de Nelly Andrade",
    });
    expect(linkedin).toHaveAttribute("href", NELLY.linkedinUrl);
    expect(linkedin).toHaveAttribute("target", "_blank");
    expect(linkedin).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("sits between the agenda and the speakers", () => {
    renderHome([NELLY]);
    const ids = Array.from(document.querySelectorAll("section[id]")).map(
      (s) => s.id
    );
    expect(ids.indexOf("keynotes")).toBe(ids.indexOf("agenda") + 1);
    expect(ids.indexOf("speakers")).toBe(ids.indexOf("keynotes") + 1);
  });

  it("leaves the section out while no keynote is announced", () => {
    expect(renderHome()).toBeNull();
  });
});
