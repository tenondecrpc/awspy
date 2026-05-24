// Speakers grid organism. Renders the SpeakerCard list, the loading
// skeleton, or the themed empty state.

import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import { EmptyState } from "@/components/organisms/EmptyState";
import { LoadingGrid } from "@/components/atoms/LoadingGrid";
import type { Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type SpeakersGridProps = {
  speakers: Speaker[];
  eventInfo: EventInfo;
  basePath?: string;
  /**
   * When true and `speakers` is empty, render a skeleton grid that matches
   * the populated layout. When false (default) and the list is empty, the
   * themed empty state is rendered.
   */
  isLoading?: boolean;
};

export function SpeakersGrid({
  speakers,
  eventInfo,
  basePath = "/speakers",
  isLoading = false,
}: SpeakersGridProps) {
  if (isLoading && speakers.length === 0) {
    return (
      <LoadingGrid
        columns={3}
        rows={2}
        itemAspectRatio={1}
        loadingLabel="Cargando speakers"
      />
    );
  }

  if (speakers.length === 0) {
    return (
      <EmptyState
        variant="speakers"
        title="Pronto anunciamos a los speakers"
        description="Estamos definiendo la grilla de oradores. Si querés proponer una charla, enviá tu propuesta desde la página de CFP."
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

  return (
    <ul
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-label="Lista de speakers"
    >
      {speakers.map((s) => (
        <li key={s.id}>
          <SpeakerCard speaker={s} basePath={basePath} />
        </li>
      ))}
    </ul>
  );
}
