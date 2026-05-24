// Speakers list template. Composes the page heading, intro, and the grid.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
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
        <div className="mb-10 max-w-3xl space-y-3">
          <Heading level={1}>Speakers</Heading>
          <p className="text-[var(--color-text-secondary)]">
            Conocé a los oradores que estarán compartiendo charlas y talleres
            en {eventInfo.name}.
          </p>
        </div>
        <SpeakersGrid
          speakers={speakers}
          eventInfo={eventInfo}
          basePath={basePath}
        />
      </Container>
    </Section>
  );
}
