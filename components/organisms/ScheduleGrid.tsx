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
// there is no roving-tabindex behaviour to get subtly wrong. The room name
// is always spelled out, so the choice never rests on the accent color.

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
    <div className="space-y-12">
      {rooms.length > 1 ? (
        <div
          role="group"
          aria-label="Filtrar la agenda por sala"
          className="-mx-1 flex flex-wrap gap-2 overflow-x-auto px-1 pb-1"
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
                  "whitespace-nowrap rounded-[var(--radius-pill)] border px-4 py-2 text-sm font-semibold transition",
                  selected
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-[var(--color-text-on-accent)]"
                    : "border-[var(--color-border-subtle)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
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
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <Heading
              id={`schedule-day-${day.dayKey}`}
              level={2}
              visualLevel={3}
              className="first-letter:uppercase"
            >
              {formatDate(day.representative)}
            </Heading>
            <span
              aria-hidden="true"
              className="h-1 min-w-12 flex-1 rounded-[var(--radius-pill)] bg-[var(--color-border-subtle)]"
            />
            <span className="text-sm font-semibold text-[var(--color-text-muted)]">
              {day.slots.length}{" "}
              {day.slots.length === 1 ? "actividad" : "actividades"}
            </span>
          </div>
          <ul className="space-y-4">
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
