import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CFPTemplate } from "@/components/templates/CFPTemplate";
import { getEventInfo } from "@/lib/content/event-info";

const EVENT_INFO = getEventInfo("2026");

/** Each "Fechas clave" timeline entry as [date, title], in rendered order. */
function keyDates() {
  const section = screen
    .getByRole("heading", { level: 2, name: "Fechas clave" })
    .closest("section")!;
  return within(section)
    .getAllByRole("listitem")
    .map((item) => {
      const [when, title] = Array.from(item.querySelectorAll("p"));
      return [when?.textContent ?? "", title?.textContent ?? ""];
    });
}

describe("CFPTemplate", () => {
  it("shows the call for papers with its formats and criteria", () => {
    render(<CFPTemplate eventInfo={EVENT_INFO} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Proponé una charla" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Formatos" })
    ).toBeInTheDocument();
    expect(screen.getByText("Charla técnica")).toBeInTheDocument();
    expect(screen.getByText("Lightning talk")).toBeInTheDocument();
  });

  // "Fechas clave" hard-coded the 30 September close and kept showing it
  // after the call was extended, with the notification date now before it.
  it("lists the key dates in order, closing on the configured deadline", () => {
    render(<CFPTemplate eventInfo={EVENT_INFO} />);

    expect(keyDates()).toEqual([
      ["10.10.2026", "Cierre de la convocatoria"],
      ["17.10.2026", "Community Day"],
    ]);
  });

  it("follows the deadline and the event date from event.json", () => {
    render(
      <CFPTemplate
        eventInfo={{
          ...EVENT_INFO,
          cfpDeadline: "2026-10-05T23:59:00-03:00",
          dates: {
            start: "2026-10-18T08:00:00-03:00",
            end: "2026-10-18T18:00:00-03:00",
          },
        }}
      />
    );

    expect(keyDates()[0]).toEqual(["05.10.2026", "Cierre de la convocatoria"]);
    expect(keyDates().at(-1)).toEqual(["18.10.2026", "Community Day"]);
  });

  it("omits the closing date when no deadline is configured", () => {
    render(<CFPTemplate eventInfo={{ ...EVENT_INFO, cfpDeadline: null }} />);

    expect(keyDates().map(([, title]) => title)).not.toContain(
      "Cierre de la convocatoria"
    );
  });

  it("renders only the finished-edition notice when archived (FR-035)", () => {
    render(<CFPTemplate eventInfo={EVENT_INFO} archived />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Proponé una charla" })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/La convocatoria de charlas no está disponible/)
    ).toBeInTheDocument();
    expect(screen.queryByText("Formatos")).not.toBeInTheDocument();
  });
});
