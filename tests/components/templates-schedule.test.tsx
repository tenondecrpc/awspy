import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScheduleTemplate } from "@/components/templates/ScheduleTemplate";
import { getEventInfo } from "@/lib/content/event-info";
import type { ScheduleGrid, Speaker } from "@/lib/api/sessionize";

const EVENT_INFO = getEventInfo("2026");

const SPEAKERS: Speaker[] = [
  {
    id: "u1",
    slug: "ana-perez",
    firstName: "Ana",
    lastName: "Perez",
    fullName: "Ana Perez",
    links: [],
    sessions: [],
  },
];

const GRID: ScheduleGrid = [
  {
    date: "2026-10-17T00:00:00Z",
    rooms: [
      {
        id: "r1",
        name: "Sala A",
        sessions: [
          {
            id: "s1",
            title: "Arquitecturas serverless en producción",
            description: "Lo que aprendimos migrando a Lambda.",
            startsAt: "2026-10-17T13:00:00-03:00",
            endsAt: "2026-10-17T13:45:00-03:00",
            isPlenumSession: false,
            isServiceSession: false,
            speakers: [{ id: "u1", name: "Ana Perez" }],
          },
          {
            id: "s2",
            title: "Apertura",
            startsAt: "2026-10-17T12:00:00-03:00",
            endsAt: "2026-10-17T12:30:00-03:00",
            isPlenumSession: true,
            isServiceSession: false,
            speakers: [],
          },
        ],
      },
    ],
  },
];

describe("ScheduleTemplate", () => {
  it("renders the agenda with its rooms, sessions and speaker links", () => {
    render(
      <ScheduleTemplate
        grid={GRID}
        speakers={SPEAKERS}
        eventInfo={EVENT_INFO}
      />
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Agenda" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("Sala A").length).toBeGreaterThan(0);
    expect(
      screen.getByText("Arquitecturas serverless en producción")
    ).toBeInTheDocument();
    expect(screen.getByText("Apertura")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ana Perez" })).toHaveAttribute(
      "href",
      "/speakers/ana-perez"
    );
  });

  it("scopes speaker links to an archived edition", () => {
    render(
      <ScheduleTemplate
        grid={GRID}
        speakers={SPEAKERS}
        eventInfo={EVENT_INFO}
        speakerBasePath="/editions/2026/speakers"
      />
    );

    expect(screen.getByRole("link", { name: "Ana Perez" })).toHaveAttribute(
      "href",
      "/editions/2026/speakers/ana-perez"
    );
  });

  it("announces the gap when the grid is still empty", () => {
    render(<ScheduleTemplate grid={[]} speakers={[]} eventInfo={EVENT_INFO} />);

    expect(
      screen.getByRole("heading", { name: "Agenda próximamente" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Salas")).not.toBeInTheDocument();
  });
});
