// Schedule grid organism. Groups sessions by Asuncion calendar day and
// sorts by start time, regardless of the room. Sessions that cross midnight
// appear under their start day only (per data-model and FR-021).

import {
  ScheduleSlot,
  type ScheduleSlotData,
} from "@/components/molecules/ScheduleSlot";
import { Heading } from "@/components/atoms/Heading";
import { EmptyState } from "@/components/organisms/EmptyState";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";
import { formatDate, startOfDayKey } from "@/lib/utils/datetime";
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

export function ScheduleGridOrganism({
  grid,
  speakers,
  speakerBasePath,
  isLoading = false,
}: ScheduleGridOrganismProps) {
  const days = groupByStartDay(grid, speakers);
  const roomAccents = buildRoomAccents(days);

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
      {days.map((day) => (
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
