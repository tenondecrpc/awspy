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

const MULTI_ROOM_GRID: ScheduleGrid = [
  {
    ...GRID[0],
    rooms: [
      ...GRID[0].rooms,
      {
        id: "r2",
        name: "Sala B",
        sessions: [
          {
            ...GRID[0].rooms[0].sessions[0],
            id: "s3",
            title: "Observabilidad en producción",
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

  it("links room filters and shows only sessions in the selected room", () => {
    render(
      <ScheduleTemplate
        grid={MULTI_ROOM_GRID}
        speakers={SPEAKERS}
        eventInfo={EVENT_INFO}
        selectedRoom="Sala B"
      />
    );

    expect(
      screen.getByRole("link", { name: "Todas las salas" })
    ).toHaveAttribute("href", "/schedule");
    expect(screen.getByRole("link", { name: "Sala B" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getByRole("heading", { name: "Observabilidad en producción" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", {
        name: "Arquitecturas serverless en producción",
      })
    ).not.toBeInTheDocument();
  });

  it("uses the archived schedule path and ignores an unknown room", () => {
    render(
      <ScheduleTemplate
        grid={MULTI_ROOM_GRID}
        speakers={SPEAKERS}
        eventInfo={EVENT_INFO}
        schedulePath="/editions/2026/schedule"
        selectedRoom="No existe"
      />
    );

    expect(
      screen.getByRole("link", { name: "Todas las salas" })
    ).toHaveAttribute("href", "/editions/2026/schedule");
    expect(screen.getByRole("link", { name: "Sala B" })).toHaveAttribute(
      "href",
      "/editions/2026/schedule?room=Sala+B"
    );
    expect(
      screen.getByRole("heading", {
        name: "Arquitecturas serverless en producción",
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Observabilidad en producción" })
    ).toBeInTheDocument();
  });

  it("does not offer empty rooms as filters", () => {
    const grid: ScheduleGrid = [
      {
        ...GRID[0],
        rooms: [
          ...GRID[0].rooms,
          { id: "empty", name: "Sala vacía", sessions: [] },
        ],
      },
    ];
    render(
      <ScheduleTemplate
        grid={grid}
        speakers={SPEAKERS}
        eventInfo={EVENT_INFO}
      />
    );

    expect(
      screen.queryByRole("link", { name: "Sala vacía" })
    ).not.toBeInTheDocument();
  });

  it("announces the gap when the grid is still empty", () => {
    render(<ScheduleTemplate grid={[]} speakers={[]} eventInfo={EVENT_INFO} />);

    expect(
      screen.getByRole("heading", { name: "Agenda próximamente" })
    ).toBeInTheDocument();
    expect(screen.queryByText("Salas")).not.toBeInTheDocument();
  });
});
