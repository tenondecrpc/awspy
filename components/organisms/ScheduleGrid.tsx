// Schedule grid organism. Groups sessions by Asuncion calendar day and
// sorts by start time, regardless of the room. Sessions that cross midnight
// appear under their start day only (per data-model and FR-021).

import { ScheduleSlot, type ScheduleSlotData } from "@/components/molecules/ScheduleSlot";
import { Heading } from "@/components/atoms/Heading";
import { EmptyState } from "@/components/organisms/EmptyState";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";
import { formatDate, startOfDayKey } from "@/lib/utils/datetime";
import { slugify } from "@/lib/utils/slug";
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

function groupByStartDay(
  grid: ScheduleGrid,
  speakers: Speaker[]
): DayGroup[] {
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
            slug:
              speakerSlugById.get(sp.id) ?? (slugify(sp.name) || undefined),
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

export function ScheduleGridOrganism({
  grid,
  speakers,
  speakerBasePath,
  isLoading = false,
}: ScheduleGridOrganismProps) {
  const days = groupByStartDay(grid, speakers);

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
          <Heading
            id={`schedule-day-${day.dayKey}`}
            level={2}
            visualLevel={3}
            className="mb-4 capitalize"
          >
            {formatDate(day.representative)}
          </Heading>
          <ul className="space-y-3">
            {day.slots.map((slot) => (
              <li key={slot.id}>
                <ScheduleSlot
                  slot={slot}
                  speakerBasePath={speakerBasePath}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
