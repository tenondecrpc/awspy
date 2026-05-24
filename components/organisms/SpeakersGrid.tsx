// Speakers grid organism. Renders the SpeakerCard list or the empty state.

import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import { EmptyState } from "@/components/organisms/EmptyState";
import type { Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type SpeakersGridProps = {
  speakers: Speaker[];
  eventInfo: EventInfo;
  basePath?: string;
};

export function SpeakersGrid({
  speakers,
  eventInfo,
  basePath = "/speakers",
}: SpeakersGridProps) {
  if (speakers.length === 0) {
    return (
      <EmptyState
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
