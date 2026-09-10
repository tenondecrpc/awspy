import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { VolunteerCallout } from "@/components/organisms/VolunteerCallout";
import type { EventInfo } from "@/lib/content/event-info";

type VolunteersTemplateProps = {
  eventInfo: EventInfo;
  /** Past-edition routes never expose an active application form. */
  archived?: boolean;
};

export function VolunteersTemplate({
  eventInfo,
  archived = false,
}: VolunteersTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          level={1}
          eyebrow="Sumate al equipo"
          eyebrowGlyph="users"
          title="Voluntariado"
          description="Sumate al equipo que hace posible el AWS Community Day Paraguay y ayudanos a crear una gran experiencia para speakers y asistentes."
          className="mb-14"
        />

        {archived ? (
          <p className="text-center text-[var(--color-text-secondary)]">
            Esta edición ya finalizó. La convocatoria de voluntariado no está
            disponible.
          </p>
        ) : (
          <VolunteerCallout eventInfo={eventInfo} />
        )}
      </Container>
    </Section>
  );
}
