import { Container } from "@/components/atoms/Container";
import { Heading } from "@/components/atoms/Heading";
import { Section } from "@/components/atoms/Section";
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
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4">
            <Heading level={1}>Voluntariado</Heading>
            <p className="text-lg text-[var(--color-text-secondary)]">
              Sumate al equipo que hace posible el AWS Community Day Paraguay y
              ayudanos a crear una gran experiencia para speakers y asistentes.
            </p>
          </div>

          {archived ? (
            <p className="text-[var(--color-text-secondary)]">
              Esta edición ya finalizó. La convocatoria de voluntariado no está
              disponible.
            </p>
          ) : (
            <VolunteerCallout eventInfo={eventInfo} />
          )}
        </div>
      </Container>
    </Section>
  );
}
