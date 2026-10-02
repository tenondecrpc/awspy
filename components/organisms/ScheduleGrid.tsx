// Schedule grid organism. Groups sessions by Asuncion calendar day and
// sorts by start time, regardless of the room. Sessions that cross midnight
// appear under their start day only (per data-model and FR-021).
//
// With more than one room the day is a merged list, so two tracks running at
// the same hour sit next to each other and read as a contradiction. The room
// filter above the list resolves that: pick a room and the day shows only
// that track. It is the one piece of state on the page, so it lives in the
// browser rather than in the URL, which keeps the archived editions
// statically generated.
//
// The filter is a set of toggle buttons rather than an ARIA tablist: every
// button is a normal tab stop, `aria-pressed` says which one is on, and
// there is no roving-tabindex behaviour to get subtly wrong. The pressed
// button is filled and bordered, so the choice never rests on color alone.

"use client";

import { useMemo, useState } from "react";
import {
  ScheduleSlot,
  type ScheduleSlotData,
} from "@/components/molecules/ScheduleSlot";
import { Heading } from "@/components/atoms/Heading";
import { EmptyState } from "@/components/organisms/EmptyState";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";
import { formatDate, startOfDayKey } from "@/lib/utils/datetime";
import { cn } from "@/lib/utils/cn";
import type { ScheduleGrid } from "@/lib/api/sessionize";
import type { Speaker } from "@/lib/api/sessionize";

type ScheduleGridOrganismProps = {
  grid: ScheduleGrid;
  /** Used to resolve speaker slugs for the in-slot links. */
  speakers: Speaker[];
  speakerBasePath?: string;
  /** When true and the grid is empty, render a skeleton instead. */
  isLoading?: boolean;
};

type DayGroup = {
  dayKey: string;
  /** ISO timestamp suitable for `formatDate`. */
  representative: string;
  slots: ScheduleSlotData[];
};

function groupByStartDay(grid: ScheduleGrid, speakers: Speaker[]): DayGroup[] {
  const speakerSlugById = new Map<string, string>();
  for (const sp of speakers) speakerSlugById.set(sp.id, sp.slug);

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
          title: session.title,
          startsAt: session.startsAt,
          endsAt: session.endsAt,
          roomName: room.name,
          isPlenum: session.isPlenumSession,
          speakers: session.speakers.map((sp) => ({
            id: sp.id,
            name: sp.name,
            slug: speakerSlugById.get(sp.id),
          })),
        });
      }
    }
  }

  // Sort days ascending and slots inside each day by start time ascending.
  const days = Array.from(map.values());
  days.sort((a, b) => a.dayKey.localeCompare(b.dayKey));
  for (const d of days) {
    d.slots.sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }
  return days;
}

/**
 * Maps every room name to a stable accent index, ordered by first appearance
 * in the grid. A room therefore keeps the same accent across days and across
 * re-renders, which is what makes the color useful as a visual anchor.
 */
function buildRoomAccents(days: DayGroup[]): Map<string, number> {
  const accents = new Map<string, number>();
  for (const day of days) {
    for (const slot of day.slots) {
      if (!accents.has(slot.roomName)) accents.set(slot.roomName, accents.size);
    }
  }
  return accents;
}

/** Every room in the grid, ordered by first appearance. */
function listRooms(days: DayGroup[]): string[] {
  const rooms: string[] = [];
  for (const day of days) {
    for (const slot of day.slots) {
      if (!rooms.includes(slot.roomName)) rooms.push(slot.roomName);
    }
  }
  return rooms;
}

const ALL_ROOMS = "__all__";

export function ScheduleGridOrganism({
  grid,
  speakers,
  speakerBasePath,
  isLoading = false,
}: ScheduleGridOrganismProps) {
  const days = useMemo(() => groupByStartDay(grid, speakers), [grid, speakers]);
  const roomAccents = useMemo(() => buildRoomAccents(days), [days]);
  const rooms = useMemo(() => listRooms(days), [days]);

  const [room, setRoom] = useState<string>(ALL_ROOMS);
  // A room that vanishes (new grid, renamed room) must not blank the page.
  const activeRoom = room !== ALL_ROOMS && rooms.includes(room) ? room : null;

  const visibleDays = activeRoom
    ? days
        .map((d) => ({
          ...d,
          slots: d.slots.filter((s) => s.roomName === activeRoom),
        }))
        .filter((d) => d.slots.length > 0)
    : days;

  if (isLoading && days.length === 0) {
    return (
      <LoadingGrid
        columns={1}
        rows={6}
        itemAspectRatio={6}
        loadingLabel="Cargando la agenda"
      />
    );
  }

  if (days.length === 0) {
    return (
      <EmptyState
        variant="schedule"
        title="Agenda próximamente"
        description="Estamos cerrando la agenda con horarios y salas. Volvé en unos días para verla completa."
      />
    );
  }

  return (
    <div className="space-y-14">
      {rooms.length > 1 ? (
        <div
          role="group"
          aria-label="Filtrar la agenda por sala"
          className="-mx-1 flex snap-x snap-proximity gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {[ALL_ROOMS, ...rooms].map((value) => {
            const selected =
              value === ALL_ROOMS ? activeRoom === null : activeRoom === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={selected}
                onClick={() => setRoom(value)}
                className={cn(
                  "min-h-[var(--size-touch)] shrink-0 snap-start whitespace-nowrap rounded-[var(--radius-sm)] border-2 px-4 text-step--1 font-semibold transition-colors",
                  selected
                    ? "border-[var(--color-text-primary)] bg-[var(--color-text-primary)] text-[var(--color-surface)]"
                    : "border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] hover:border-[var(--color-text-primary)]"
                )}
              >
                {value === ALL_ROOMS ? "Todas las salas" : value}
              </button>
            );
          })}
        </div>
      ) : null}

      {visibleDays.map((day) => (
        <section
          key={day.dayKey}
          aria-labelledby={`schedule-day-${day.dayKey}`}
        >
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
            <Heading
              id={`schedule-day-${day.dayKey}`}
              level={2}
              visualLevel={3}
              className="first-letter:uppercase"
            >
              {formatDate(day.representative)}
            </Heading>
            <span className="text-step--1 text-[var(--color-text-secondary)]">
              {day.slots.length}{" "}
              {day.slots.length === 1 ? "actividad" : "actividades"}
            </span>
          </div>
          <ul className="m-0 list-none p-0">
            {day.slots.map((slot) => (
              <li key={slot.id}>
                <ScheduleSlot
                  slot={slot}
                  speakerBasePath={speakerBasePath}
                  accentIndex={roomAccents.get(slot.roomName) ?? 0}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
