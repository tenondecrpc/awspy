// Speakers list template. Composes the page heading, intro, and the grid.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { SpeakersGrid } from "@/components/organisms/SpeakersGrid";
import type { Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type SpeakersTemplateProps = {
  speakers: Speaker[];
  eventInfo: EventInfo;
  basePath?: string;
};

export function SpeakersTemplate({
  speakers,
  eventInfo,
  basePath,
}: SpeakersTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          level={1}
          eyebrow="Comunidad"
          eyebrowGlyph="mic"
          title="Speakers"
          description={`Conocé a los oradores que estarán compartiendo charlas y talleres en ${eventInfo.name}.`}
          className="mb-14"
        />
        <SpeakersGrid
          speakers={speakers}
          eventInfo={eventInfo}
          basePath={basePath}
        />
      </Container>
    </Section>
  );
}
