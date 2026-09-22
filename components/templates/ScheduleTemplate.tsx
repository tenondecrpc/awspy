// Schedule page, rebuilt from scratch to reproduce the "Agenda" mockup
// (`AWS Community Day Paraguay (colored)/Agenda.dc.html`) 1:1 — same sections,
// same order, same colors (via exact design tokens), and same spacing.
//
// The real data is wired through: the Sessionize GridSmart response is grouped
// by its Asunción start day (kept from the previous grid logic) and rendered as
// the mockup's dense session rows. Each room keeps a stable accent from the
// categorical token ramp, shown both as a legend and as the row stripe. The
// empty state is preserved for editions whose grid has not been published yet.

import NextLink from "next/link";
import { PageHeader, WRAP } from "@/components/molecules/SectionPrimitives";
import { formatDate, formatTime, startOfDayKey } from "@/lib/utils/datetime";
import type { ScheduleGrid, Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type ScheduleTemplateProps = {
  grid: ScheduleGrid;
  speakers: Speaker[];
  eventInfo: EventInfo;
  speakerBasePath?: string;
  schedulePath?: string;
  selectedRoom?: string | null;
};

// A fixed-order set of categorical hues that tells sibling rooms apart. It is
// identity, never meaning: every room also carries its written name, so a
// reader who cannot distinguish the hues loses nothing.
const ROOM_COLORS = [
  "var(--color-category-blue)",
  "var(--color-category-teal)",
  "var(--color-category-amber)",
  "var(--color-category-green)",
  "var(--color-category-violet)",
  "var(--color-category-pink)",
] as const;

type SlotSpeaker = { id: string; name: string; slug?: string };

type Slot = {
  id: string;
  startsAt: string;
  endsAt: string;
  title: string;
  description?: string | null;
  roomName: string;
  roomColor: string;
  isPlenum: boolean;
  isService: boolean;
  speakers: SlotSpeaker[];
};

type DayGroup = {
  dayKey: string;
  representative: string;
  slots: Slot[];
};

/** Rooms in first-appearance order, each mapped to a stable accent hue. */
function listRooms(grid: ScheduleGrid): Array<{ name: string; color: string }> {
  const seen = new Map<string, string>();
  for (const day of grid) {
    for (const room of day.rooms) {
      if (room.sessions.length > 0 && !seen.has(room.name)) {
        seen.set(room.name, ROOM_COLORS[seen.size % ROOM_COLORS.length]);
      }
    }
  }
  return Array.from(seen, ([name, color]) => ({ name, color }));
}

/**
 * Groups every session by its Asunción start day and sorts days and slots
 * ascending. Sessions that cross midnight appear under their start day only.
 */
function groupByStartDay(grid: ScheduleGrid, speakers: Speaker[]): DayGroup[] {
  const roomColor = new Map(listRooms(grid).map((r) => [r.name, r.color]));
  const slugById = new Map<string, string>();
  for (const sp of speakers) slugById.set(sp.id, sp.slug);

  const map = new Map<string, DayGroup>();
  for (const day of grid) {
    for (const room of day.rooms) {
      for (const session of room.sessions) {
        const dayKey = startOfDayKey(session.startsAt);
        if (!dayKey) continue;
        let group = map.get(dayKey);
        if (!group) {
          group = { dayKey, representative: session.startsAt, slots: [] };
          map.set(dayKey, group);
        }
        group.slots.push({
          id: session.id,
          startsAt: session.startsAt,
          endsAt: session.endsAt,
          title: session.title,
          description: session.description,
          roomName: room.name,
          roomColor: roomColor.get(room.name) ?? ROOM_COLORS[0],
          isPlenum: session.isPlenumSession,
          isService: session.isServiceSession,
          speakers: session.speakers.map((sp) => ({
            id: sp.id,
            name: sp.name,
            slug: slugById.get(sp.id),
          })),
        });
      }
    }
  }

  const days = Array.from(map.values());
  days.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  for (const d of days) {
    d.slots.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }
  return days;
}

function durationLabel(startsAt: string, endsAt: string): string {
  const mins = Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60000
  );
  return `${Math.max(0, mins)} min`;
}

export function ScheduleTemplate({
  grid,
  speakers,
  eventInfo,
  speakerBasePath = "/speakers",
  schedulePath = "/schedule",
  selectedRoom,
}: ScheduleTemplateProps) {
  const rooms = listRooms(grid);
  const days = groupByStartDay(grid, speakers);
  const activeRoom = rooms.find((room) => room.name === selectedRoom)?.name;
  const visibleDays = activeRoom
    ? days
        .map((day) => ({
          ...day,
          slots: day.slots.filter((slot) => slot.roomName === activeRoom),
        }))
        .filter((day) => day.slots.length > 0)
    : days;
  const multiDay = visibleDays.length > 1;

  return (
    <>
      <PageHeader
        eyebrow="Programa"
        title="Agenda"
        description={`Charlas, talleres y actividades de ${eventInfo.name}. Los horarios están en hora local de Asunción (UTC−3) y pueden ajustarse hasta la semana del evento.`}
      />

      {rooms.length > 0 ? (
        <section className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-warm)]">
          <nav
            aria-label="Filtrar agenda por sala"
            className={`${WRAP} flex flex-wrap items-center gap-2.5 py-[22px]`}
          >
            <span className="mr-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
              Salas
            </span>
            <NextLink
              href={schedulePath}
              prefetch={false}
              scroll={false}
              aria-current={!activeRoom ? "page" : undefined}
              className={`inline-flex items-center rounded-[3px] border px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-[var(--color-accent)] ${
                !activeRoom
                  ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                  : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
              }`}
            >
              Todas las salas
            </NextLink>
            {rooms.map((room) => (
              <NextLink
                key={room.name}
                href={{ pathname: schedulePath, query: { room: room.name } }}
                prefetch={false}
                scroll={false}
                aria-current={activeRoom === room.name ? "page" : undefined}
                className={`inline-flex items-center gap-2 rounded-[3px] border px-3 py-1.5 text-[13px] font-semibold transition-colors hover:border-[var(--color-accent)] ${
                  activeRoom === room.name
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-surface)]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-[9px] w-[9px] rounded-[2px]"
                  style={{ background: room.color }}
                />
                {room.name}
              </NextLink>
            ))}
          </nav>
        </section>
      ) : null}

      <section className="bg-[var(--color-surface)]">
        <div className={`${WRAP} pb-[72px] pt-11`}>
          {days.length === 0 ? (
            <div className="border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] px-7 py-14 text-center">
              <h2 className="m-0 text-[22px] font-bold tracking-[-0.02em]">
                Agenda próximamente
              </h2>
              <p className="mx-auto mt-3 max-w-[34rem] text-[15px] text-[var(--color-text-secondary)]">
                Estamos cerrando la agenda con horarios y salas. Volvé en unos
                días para verla completa.
              </p>
            </div>
          ) : (
            visibleDays.map((day) => (
              <div key={day.dayKey} className={multiDay ? "mb-12" : ""}>
                {multiDay ? (
                  <h2 className="mb-4 text-[20px] font-extrabold tracking-[-0.03em] first-letter:uppercase">
                    {formatDate(day.representative)}
                  </h2>
                ) : null}
                <div className="border-t border-[var(--color-text-primary)]">
                  {day.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={
                        // Same stacking as the home agenda preview: below `sm`
                        // the colour bar runs down the left and time, detail
                        // and room labels stack beside it. The four-column
                        // layout needs ~470px and was forcing the whole page
                        // to scroll sideways on every phone.
                        "grid items-start gap-x-[18px] gap-y-2 border-b border-[var(--color-border-subtle)] px-1 py-[18px] [grid-template-columns:4px_minmax(0,1fr)] sm:gap-y-0 sm:[grid-template-columns:minmax(110px,130px)_4px_minmax(0,1fr)_minmax(0,0.75fr)] " +
                        (slot.isService
                          ? "bg-[var(--color-surface-muted)]"
                          : "transition-colors hover:bg-[var(--color-surface-muted)]")
                      }
                    >
                      <div className="col-start-2 row-start-1 min-w-0 sm:col-start-auto sm:row-start-auto">
                        <div className="font-mono text-[14px] font-medium text-[var(--color-text-primary)]">
                          {formatTime(slot.startsAt)}
                        </div>
                        <div className="mt-0.5 font-mono text-[11.5px] text-[var(--color-text-muted)]">
                          {durationLabel(slot.startsAt, slot.endsAt)}
                        </div>
                      </div>

                      <span
                        aria-hidden="true"
                        className="col-start-1 row-start-1 row-span-3 w-1 self-stretch rounded-[2px] sm:col-start-auto sm:row-start-auto sm:row-span-1"
                        style={{ background: slot.roomColor }}
                      />

                      <div className="col-start-2 row-start-2 min-w-0 sm:col-start-auto sm:row-start-auto">
                        <h3 className="m-0 mb-1 text-[17px] font-bold leading-[1.3] tracking-[-0.018em]">
                          {slot.title}
                        </h3>
                        {slot.description ? (
                          <p className="m-0 mb-1.5 max-w-[44rem] text-[14px] text-[var(--color-text-muted)]">
                            {slot.description}
                          </p>
                        ) : null}
                        {slot.speakers.length > 0 ? (
                          <p className="m-0 text-[13.5px] font-semibold text-[var(--color-accent)]">
                            {slot.speakers.map((sp, i) => (
                              <span key={sp.id}>
                                {i > 0 ? " · " : ""}
                                {sp.slug ? (
                                  <NextLink
                                    href={`${speakerBasePath}/${sp.slug}`}
                                    className="hover:underline"
                                  >
                                    {sp.name}
                                  </NextLink>
                                ) : (
                                  sp.name
                                )}
                              </span>
                            ))}
                          </p>
                        ) : null}
                      </div>

                      <div className="col-start-2 row-start-3 flex min-w-0 flex-wrap justify-start gap-1.5 pt-0.5 sm:col-start-auto sm:row-start-auto">
                        <span className="whitespace-nowrap rounded-[3px] border border-[var(--color-border-subtle)] px-[9px] py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--color-text-secondary)]">
                          {slot.roomName}
                        </span>
                        {slot.isPlenum ? (
                          <span className="whitespace-nowrap rounded-[3px] bg-[var(--color-surface-muted)] px-[9px] py-1 font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--color-accent)]">
                            Plenaria
                          </span>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {days.length > 0 ? (
            <p className="mt-[22px] text-[13.5px] text-[var(--color-text-muted)]">
              Los horarios pueden ajustarse hasta la semana del evento. La
              grilla definitiva se publica desde Sessionize.
            </p>
          ) : null}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-5 border border-[var(--color-border-subtle)] p-7">
            <div className="min-w-0">
              <h2 className="m-0 mb-1.5 text-[19px] font-bold tracking-[-0.02em]">
                Los talleres tienen cupo limitado
              </h2>
              <p className="m-0 text-[14.5px] text-[var(--color-text-secondary)]">
                Traé tu notebook y una cuenta de AWS activa. Se anota en el
                mostrador de acreditación.
              </p>
            </div>
            <NextLink
              href="/register"
              className="inline-flex flex-none items-center rounded-[4px] bg-[var(--color-action)] px-[26px] py-[13px] text-[15px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
            >
              Registrarme gratis
            </NextLink>
          </div>
        </div>
      </section>
    </>
  );
}
