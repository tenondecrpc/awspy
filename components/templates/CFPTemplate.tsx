import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { SessionizeCFPCallout } from "@/components/organisms/SessionizeCFPCallout";
import type { EventInfo } from "@/lib/content/event-info";

type CFPTemplateProps = {
  eventInfo: EventInfo;
  /** When true, renders only the archived notice (FR-035). */
  archived?: boolean;
};

export function CFPTemplate({ eventInfo, archived = false }: CFPTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Heading level={1}>Proponé una charla</Heading>

          {archived ? (
            <p className="text-[var(--color-text-secondary)]">
              Esta edición ya finalizó. La convocatoria de charlas no está
              disponible.
            </p>
          ) : (
            <>
              <p className="text-[var(--color-text-secondary)]">
                Compartí tu experiencia con la comunidad. Buscamos charlas
                técnicas, casos reales, talleres y lightning talks en español.
              </p>
              <SessionizeCFPCallout eventInfo={eventInfo} />
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
