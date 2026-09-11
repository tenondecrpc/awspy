import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ScheduleGridOrganism } from "@/components/organisms/ScheduleGrid";
import type { ScheduleGrid, Speaker } from "@/lib/api/sessionize";

vi.mock("next/navigation", () => ({
  usePathname: () => "/schedule",
}));

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

describe("ScheduleGridOrganism", () => {
  it("renders the empty state when grid is empty", () => {
    render(<ScheduleGridOrganism grid={[]} speakers={SPEAKERS} />);
    expect(
      screen.getByRole("heading", { name: /agenda próximamente/i })
    ).toBeInTheDocument();
  });

  it("groups sessions by day and sorts by start time", () => {
    const grid: ScheduleGrid = [
      {
        date: "2026-09-12T00:00:00Z",
        rooms: [
          {
            id: "r1",
            name: "Sala A",
            sessions: [
              {
                id: "s2",
                title: "Charla B (segunda)",
                startsAt: "2026-09-12T15:00:00-03:00",
                endsAt: "2026-09-12T15:45:00-03:00",
                isPlenumSession: false,
                isServiceSession: false,
                speakers: [],
              },
              {
                id: "s1",
                title: "Charla A (primera)",
                startsAt: "2026-09-12T13:00:00-03:00",
                endsAt: "2026-09-12T13:45:00-03:00",
                isPlenumSession: false,
                isServiceSession: false,
                speakers: [],
              },
            ],
          },
        ],
      },
    ];
    render(<ScheduleGridOrganism grid={grid} speakers={SPEAKERS} />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    // First slot title appears before the second.
    expect(headings.map((h) => h.textContent)).toEqual([
      "Charla A (primera)",
      "Charla B (segunda)",
    ]);
  });

  it("places a midnight-crossing session under its start day only", () => {
    // Start at 2026-09-12 23:00 Asuncion (= 2026-09-13T02:00Z), end at
    // 2026-09-13 01:00 Asuncion (= 2026-09-13T04:00Z). Should appear under
    // 2026-09-12.
    const grid: ScheduleGrid = [
      {
        date: "2026-09-12T00:00:00Z",
        rooms: [
          {
            id: "r1",
            name: "After Party",
            sessions: [
              {
                id: "after",
                title: "Networking nocturno",
                startsAt: "2026-09-13T02:00:00Z",
                endsAt: "2026-09-13T04:00:00Z",
                isPlenumSession: false,
                isServiceSession: false,
                speakers: [],
              },
            ],
          },
        ],
      },
    ];
    render(<ScheduleGridOrganism grid={grid} speakers={SPEAKERS} />);
    // Only one day section.
    const sections = screen.getAllByRole("heading", { level: 2 });
    expect(sections).toHaveLength(1);
    // The day heading references September 12 (start day in Asuncion), not 13.
    expect(sections[0].textContent).toMatch(/12/);
    expect(sections[0].textContent).not.toMatch(/13/);
  });

  it("links speakers using the resolved slug from the speakers list", () => {
    const grid: ScheduleGrid = [
      {
        date: "2026-09-12T00:00:00Z",
        rooms: [
          {
            id: "r1",
            name: "Sala A",
            sessions: [
              {
                id: "s1",
                title: "Cloud para principiantes",
                startsAt: "2026-09-12T13:00:00-03:00",
                endsAt: "2026-09-12T13:45:00-03:00",
                isPlenumSession: false,
                isServiceSession: false,
                speakers: [{ id: "u1", name: "Ana Perez" }],
              },
            ],
          },
        ],
      },
    ];
    render(<ScheduleGridOrganism grid={grid} speakers={SPEAKERS} />);
    expect(screen.getByRole("link", { name: "Ana Perez" })).toHaveAttribute(
      "href",
      "/speakers/ana-perez"
    );
  });

  it("renders an unmatched provider speaker without a fabricated link", () => {
    const grid: ScheduleGrid = [
      {
        date: "2026-09-12T00:00:00Z",
        rooms: [
          {
            id: "r1",
            name: "Sala A",
            sessions: [
              {
                id: "s1",
                title: "Partial provider response",
                startsAt: "2026-09-12T13:00:00-03:00",
                endsAt: "2026-09-12T13:45:00-03:00",
                isPlenumSession: false,
                isServiceSession: false,
                speakers: [{ id: "missing", name: "Unknown Speaker" }],
              },
            ],
          },
        ],
      },
    ];

    render(<ScheduleGridOrganism grid={grid} speakers={SPEAKERS} />);

    expect(screen.getByText("Unknown Speaker")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Unknown Speaker" })
    ).not.toBeInTheDocument();
  });

  describe("room filter", () => {
    const TWO_ROOMS: ScheduleGrid = [
      {
        date: "2026-10-17T00:00:00Z",
        rooms: [
          {
            id: "r1",
            name: "Sala Guaraní",
            sessions: [
              {
                id: "g1",
                title: "Charla en Guaraní",
                startsAt: "2026-10-17T14:30:00-03:00",
                endsAt: "2026-10-17T15:15:00-03:00",
                isPlenumSession: false,
                isServiceSession: false,
                speakers: [],
              },
            ],
          },
          {
            id: "r2",
            name: "Sala Ñandutí",
            sessions: [
              {
                id: "n1",
                title: "Charla en Ñandutí",
                startsAt: "2026-10-17T14:30:00-03:00",
                endsAt: "2026-10-17T15:15:00-03:00",
                isPlenumSession: false,
                isServiceSession: false,
                speakers: [],
              },
            ],
          },
        ],
      },
    ];

    it("shows every room until one is picked", () => {
      render(<ScheduleGridOrganism grid={TWO_ROOMS} speakers={[]} />);
      expect(screen.getByText("Charla en Guaraní")).toBeInTheDocument();
      expect(screen.getByText("Charla en Ñandutí")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Todas las salas", pressed: true })
      ).toBeInTheDocument();
    });

    it("narrows the day to the chosen room", async () => {
      const user = userEvent.setup();
      render(<ScheduleGridOrganism grid={TWO_ROOMS} speakers={[]} />);

      await user.click(screen.getByRole("button", { name: "Sala Ñandutí" }));

      expect(screen.queryByText("Charla en Guaraní")).not.toBeInTheDocument();
      expect(screen.getByText("Charla en Ñandutí")).toBeInTheDocument();
      // The day count follows the filter rather than the whole grid.
      expect(screen.getByText("1 actividad")).toBeInTheDocument();
    });

    it("goes back to the whole day", async () => {
      const user = userEvent.setup();
      render(<ScheduleGridOrganism grid={TWO_ROOMS} speakers={[]} />);

      await user.click(screen.getByRole("button", { name: "Sala Ñandutí" }));
      await user.click(screen.getByRole("button", { name: "Todas las salas" }));

      expect(screen.getByText("Charla en Guaraní")).toBeInTheDocument();
      expect(screen.getByText("2 actividades")).toBeInTheDocument();
    });

    it("omits the filter when the grid has a single room", () => {
      const oneRoom: ScheduleGrid = [
        { ...TWO_ROOMS[0], rooms: [TWO_ROOMS[0].rooms[0]] },
      ];
      render(<ScheduleGridOrganism grid={oneRoom} speakers={[]} />);
      expect(
        screen.queryByRole("group", { name: /filtrar la agenda/i })
      ).not.toBeInTheDocument();
    });
  });
});
