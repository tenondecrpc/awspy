// Speakers grid organism. Renders the SpeakerCard list, the loading
// skeleton, or the themed empty state.

import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import { EmptyState } from "@/components/organisms/EmptyState";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";
import { formatTime } from "@/lib/utils/datetime";
import type { ScheduleGrid, Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type SpeakersGridProps = {
  speakers: Speaker[];
  eventInfo: EventInfo;
  basePath?: string;
  /** Published schedule; gives each talk its time and room when known. */
  grid?: ScheduleGrid;
  /**
   * When true and `speakers` is empty, render a skeleton grid that matches
   * the populated layout. When false (default) and the list is empty, the
   * themed empty state is rendered.
   */
  isLoading?: boolean;
};

/** First scheduled session of each speaker: start time and room. */
function talkSlots(grid: ScheduleGrid | undefined) {
  const slots = new Map<
    string,
    { startsAt: string; time: string; room: string }
  >();
  for (const day of grid ?? []) {
    for (const room of day.rooms) {
      for (const session of room.sessions) {
        for (const sp of session.speakers) {
          const prev = slots.get(sp.id);
          if (!prev || session.startsAt < prev.startsAt) {
            slots.set(sp.id, {
              startsAt: session.startsAt,
              time: formatTime(session.startsAt),
              room: room.name,
            });
          }
        }
      }
    }
  }
  return slots;
}

// Every speaker gets the same weight: same width, same square portrait, same
// baseline. Four across on desktop, three on tablets, two on phones. The
// editorial feel comes from the type and the ruled captions, not from making
// some people larger than others.
// Each cell spans the card's four rows (see SpeakerCard) and leaves the gap
// between card rows as its own bottom padding, so the subgrid rows stay tight.
const CELL =
  "row-span-4 grid min-w-0 grid-rows-subgrid pb-8 sm:pb-10 [overflow-wrap:anywhere]";

export function SpeakersGrid({
  speakers,
  eventInfo,
  basePath = "/speakers",
  grid,
  isLoading = false,
}: SpeakersGridProps) {
  if (isLoading && speakers.length === 0) {
    return (
      <LoadingGrid
        columns={4}
        rows={2}
        itemAspectRatio={4 / 5}
        gap="lg"
        loadingLabel="Cargando speakers"
      />
    );
  }

  if (speakers.length === 0) {
    return (
      <EmptyState
        variant="speakers"
        title="Pronto anunciamos a los speakers"
        description="Estamos definiendo la grilla de oradores. Si querés participar, enviá tu propuesta desde la página para proponer charlas."
        actionHref={
          eventInfo.cfpStatus === "open" && eventInfo.cfpSubmissionUrl
            ? "/cfp"
            : `mailto:${eventInfo.contactEmail}`
        }
        actionLabel={
          eventInfo.cfpStatus === "open" ? "Enviar mi charla" : "Escribirnos"
        }
      />
    );
  }

  const slots = talkSlots(grid);

  return (
    <ul
      className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-0 p-0 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4"
      aria-label="Lista de speakers"
    >
      {speakers.map((s, index) => (
        <li key={s.id} className={CELL}>
          <SpeakerCard
            speaker={s}
            basePath={basePath}
            accentIndex={index}
            talkSlot={slots.get(s.id)}
          />
        </li>
      ))}
    </ul>
  );
}
