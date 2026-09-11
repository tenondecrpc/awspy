import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomeTemplate } from "@/components/templates/HomeTemplate";
import { getEventInfo } from "@/lib/content/event-info";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

const eventInfo = getEventInfo("2026");

describe("HomeTemplate expected figures band", () => {
  it("renders one tile per figure from the edition content", () => {
    render(
      <HomeTemplate
        eventInfo={eventInfo}
        speakersPreview={[]}
        sponsorsPreview={[]}
      />
    );

    const band = screen.getByRole("region", { name: "Esperamos contar con" });
    const tiles = within(band).getAllByRole("listitem");
    expect(tiles).toHaveLength(eventInfo.expectedFigures.length);
    eventInfo.expectedFigures.forEach((figure) => {
      expect(within(band).getByText(figure.value)).toBeInTheDocument();
      expect(within(band).getByText(figure.label)).toBeInTheDocument();
    });
  });

  it("drops the whole band when the edition declares no figures", () => {
    render(
      <HomeTemplate
        eventInfo={{ ...eventInfo, expectedFigures: [] }}
        speakersPreview={[]}
        sponsorsPreview={[]}
      />
    );

    expect(
      screen.queryByRole("region", { name: "Esperamos contar con" })
    ).not.toBeInTheDocument();
  });
});
