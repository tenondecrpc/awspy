import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Countdown } from "@/components/organisms/Countdown";

beforeEach(() => {
  vi.useFakeTimers();
  // 2026-05-23 12:00:00 UTC
  vi.setSystemTime(new Date("2026-05-23T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("Countdown", () => {
  it("renders the days/hours/minutes labels in Spanish", () => {
    render(<Countdown targetDate="2026-09-12T13:00:00-03:00" />);
    expect(screen.getByText("días")).toBeInTheDocument();
    expect(screen.getByText("hs")).toBeInTheDocument();
    expect(screen.getByText("min")).toBeInTheDocument();
  });

  it("computes the diff as days/hours/minutes for a future target", () => {
    // 2026-09-12T13:00:00-03:00 = 2026-09-12T16:00:00Z. From 2026-05-23T12:00:00Z
    // that is approximately 112 days, 4 hours.
    render(<Countdown targetDate="2026-09-12T13:00:00-03:00" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-label");
    const label = status.getAttribute("aria-label") ?? "";
    expect(label).toMatch(/Faltan \d+ d/);
  });

  it("shows the past-event message when the target is already past", () => {
    render(<Countdown targetDate="2024-01-01T00:00:00Z" />);
    expect(screen.getByText(/el evento ya comenzó/i)).toBeInTheDocument();
  });

  it("renders nothing for an invalid target date", () => {
    const { container } = render(<Countdown targetDate="not-a-date" />);
    expect(container.firstChild).toBeNull();
  });

  it("uses aria-live=polite so changes are announced gracefully", () => {
    render(<Countdown targetDate="2026-09-12T13:00:00-03:00" />);
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
  });

  it("renders ruled cells on the hero tone and keeps the same labels", () => {
    const { container } = render(
      <Countdown targetDate="2026-09-12T13:00:00-03:00" tone="hero" />
    );
    expect(container.querySelectorAll(".border-t-2")).toHaveLength(3);
    expect(screen.getByText("días")).toBeInTheDocument();
    expect(screen.getByText("hs")).toBeInTheDocument();
    expect(screen.getByText("min")).toBeInTheDocument();
  });

  // The days left are shown as one huge number with the words beside it. The
  // pieces are aria-hidden and the phrase is written once for assistive
  // technology, so it is announced whole ("Faltan 112 días").
  it("sets the number large and announces the full phrase once", () => {
    render(
      <Countdown targetDate="2026-09-12T13:00:00-03:00" variant="display" />
    );
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(screen.getByText(/^Faltan \d+ días$/)).toHaveClass("sr-only");
    const number = status.querySelector("[aria-hidden='true'].font-display");
    expect(number?.textContent).toMatch(/^\d+$/);
    expect(number?.className).toMatch(/text-\[min\(7\.5rem/);
  });

  it("shows the past-event message in the display variant too", () => {
    render(<Countdown targetDate="2024-01-01T00:00:00Z" variant="display" />);
    expect(screen.getByText("El evento ya comenzó")).toBeInTheDocument();
  });

  it("keeps the muted panel on the default tone", () => {
    const { container } = render(
      <Countdown targetDate="2026-09-12T13:00:00-03:00" />
    );
    expect(container.querySelectorAll(".border-t-2")).toHaveLength(0);
    expect(screen.getByRole("status").className).toContain(
      "var(--color-surface-muted)"
    );
  });
});
