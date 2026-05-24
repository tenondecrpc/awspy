import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
