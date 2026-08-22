// Schedule page template.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { ScheduleGridOrganism } from "@/components/organisms/ScheduleGrid";
import type { ScheduleGrid, Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type ScheduleTemplateProps = {
  grid: ScheduleGrid;
  speakers: Speaker[];
  eventInfo: EventInfo;
  speakerBasePath?: string;
};

export function ScheduleTemplate({
  grid,
  speakers,
  eventInfo,
  speakerBasePath,
}: ScheduleTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mb-10 max-w-3xl space-y-3">
          <Heading level={1}>Agenda</Heading>
          <p className="text-[var(--color-text-secondary)]">
            Charlas, talleres y actividades de {eventInfo.name}. Los horarios se
            muestran en hora local de Asunción (UTC-3).
          </p>
        </div>
        <ScheduleGridOrganism
          grid={grid}
          speakers={speakers}
          speakerBasePath={speakerBasePath}
        />
      </Container>
    </Section>
  );
}
