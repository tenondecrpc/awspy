// Schedule page template.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
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
        <SectionHeading
          level={1}
          eyebrow="Programa"
          eyebrowGlyph="calendar"
          title="Agenda"
          description={`Charlas, talleres y actividades de ${eventInfo.name}. Los horarios se muestran en hora local de Asunción (UTC-3).`}
          className="mb-14"
        />
        <ScheduleGridOrganism
          grid={grid}
          speakers={speakers}
          speakerBasePath={speakerBasePath}
        />
      </Container>
    </Section>
  );
}
