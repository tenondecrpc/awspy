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
    expect(number?.className).toMatch(/text-\[clamp\(3\.5rem,18vw,7\.5rem\)\]/);
  });

  // The headline counts Asunción calendar days, not whole 24-hour periods:
  // on Saturday 20:17 the event on the next Saturday at 09:00 is 6 days and
  // 12 hours away, and the attendee reads that as "7 días".
  it("counts the days left as Asunción calendar days", () => {
    vi.setSystemTime(new Date("2026-10-10T20:17:00-03:00"));
    render(
      <Countdown targetDate="2026-10-17T09:00:00-03:00" variant="display" />
    );
    expect(screen.getByText("Faltan 7 días")).toHaveClass("sr-only");
  });

  // 23:30 in Asunción is already the next day in UTC; the count still follows
  // the Asunción date, whatever zone the visitor's device is set to.
  it("keeps the Asunción date when UTC has already rolled over", () => {
    vi.setSystemTime(new Date("2026-10-11T02:30:00Z"));
    render(
      <Countdown targetDate="2026-10-17T09:00:00-03:00" variant="inline" />
    );
    expect(screen.getByRole("status")).toHaveTextContent("Faltan 7 días");
  });

  it("uses the singular on the day before", () => {
    vi.setSystemTime(new Date("2026-10-16T12:00:00-03:00"));
    render(
      <Countdown targetDate="2026-10-17T09:00:00-03:00" variant="display" />
    );
    expect(screen.getByText("Falta 1 día")).toHaveClass("sr-only");
  });

  // On the day itself "Faltan 0 días" says nothing, so the headline switches
  // to the hours, then the minutes, still to go.
  it.each([
    ["2026-10-17T05:30:00-03:00", "Faltan 3 horas"],
    ["2026-10-17T07:59:30-03:00", "Falta 1 hora"],
    ["2026-10-17T08:15:00-03:00", "Faltan 45 minutos"],
    ["2026-10-17T08:59:30-03:00", "Falta 1 minuto"],
  ])("counts down in hours and minutes on the day (%s)", (now, phrase) => {
    vi.setSystemTime(new Date(now));
    render(
      <Countdown targetDate="2026-10-17T09:00:00-03:00" variant="display" />
    );
    expect(screen.getByText(phrase)).toHaveClass("sr-only");
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
