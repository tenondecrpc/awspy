import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScheduleSlot } from "@/components/molecules/ScheduleSlot";

vi.mock("next/navigation", () => ({
  usePathname: () => "/schedule",
}));

const SLOT = {
  id: "s1",
  title: "Construyendo APIs serverless en AWS",
  startsAt: "2026-09-12T13:00:00-03:00",
  endsAt: "2026-09-12T13:45:00-03:00",
  roomName: "Sala Principal",
  speakers: [
    { id: "1", name: "Ana Perez", slug: "ana-perez" },
    { id: "2", name: "Beto Lopez" },
  ],
};

describe("ScheduleSlot", () => {
  it("renders title, room, and time range", () => {
    render(<ScheduleSlot slot={SLOT} />);
    expect(
      screen.getByRole("heading", { level: 3, name: SLOT.title })
    ).toBeInTheDocument();
    expect(screen.getByText("Sala Principal")).toBeInTheDocument();
    expect(screen.getByText(/13:00 - 13:45/)).toBeInTheDocument();
  });

  it("links speakers with slugs but renders plain text otherwise", () => {
    render(<ScheduleSlot slot={SLOT} />);
    const linked = screen.getByRole("link", { name: "Ana Perez" });
    expect(linked).toHaveAttribute("href", "/speakers/ana-perez");
    expect(screen.getByText("Beto Lopez")).toBeInTheDocument();
  });

  it("renders a 'Plenaria' badge when isPlenum is true", () => {
    render(<ScheduleSlot slot={{ ...SLOT, isPlenum: true }} />);
    expect(screen.getByText("Plenaria")).toBeInTheDocument();
  });

  it("respects a custom speakerBasePath for archived editions", () => {
    render(
      <ScheduleSlot
        slot={SLOT}
        speakerBasePath="/editions/2025/speakers"
      />
    );
    expect(
      screen.getByRole("link", { name: "Ana Perez" })
    ).toHaveAttribute("href", "/editions/2025/speakers/ana-perez");
  });
});
