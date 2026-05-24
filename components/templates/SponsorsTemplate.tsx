// Sponsors page template. Composes the sponsors board with a "Become a
// sponsor" callout pointing at the configured contact email.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";
import { SponsorsBoard } from "@/components/organisms/SponsorsBoard";
import type { Sponsor } from "@/lib/content/sponsors";
import type { EventInfo } from "@/lib/content/event-info";

type SponsorsTemplateProps = {
  sponsors: Sponsor[];
  eventInfo: EventInfo;
};

export function SponsorsTemplate({
  sponsors,
  eventInfo,
}: SponsorsTemplateProps) {
  return (
    <>
      <Section spacing="lg">
        <Container>
          <div className="mb-10 max-w-3xl space-y-3">
            <Heading level={1}>Sponsors</Heading>
            <p className="text-[var(--color-text-secondary)]">
              Las empresas y comunidades que hacen posible {eventInfo.name}.
            </p>
          </div>
          <SponsorsBoard sponsors={sponsors} eventInfo={eventInfo} />
        </Container>
      </Section>

      <Section spacing="md" tone="muted" aria-labelledby="be-a-sponsor-title">
        <Container>
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <Heading id="be-a-sponsor-title" level={2}>
              ¿Querés ser sponsor?
            </Heading>
            <p className="text-[var(--color-text-secondary)]">
              Si tu empresa quiere apoyar el primer Community Day en Paraguay,
              escribinos. Compartimos los paquetes de auspicio disponibles y
              respondemos a la brevedad.
            </p>
            <Button
              as="a"
              href={`mailto:${eventInfo.contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`}
              variant="primary"
              size="lg"
            >
              Escribirnos por sponsoreo
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
