// Sponsors page template. Composes the sponsors board with a "Become a
// sponsor" callout pointing at the configured contact email.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
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
          <SectionHeading
            level={1}
            eyebrow="Auspiciantes"
            title="Sponsors"
            description={`Las empresas y comunidades que hacen posible ${eventInfo.name}.`}
            className="mb-14"
          />
          <SponsorsBoard sponsors={sponsors} eventInfo={eventInfo} />
        </Container>
      </Section>

      <Section spacing="md" tone="muted" aria-labelledby="be-a-sponsor-title">
        <Container>
          <SectionHeading
            id="be-a-sponsor-title"
            level={2}
            eyebrow="Auspicios"
            title="¿Querés ser"
            highlight="sponsor?"
            tone="muted"
            description="Si tu empresa quiere apoyar el primer Community Day en Paraguay, escribinos. Compartimos los paquetes de auspicio disponibles y respondemos a la brevedad."
          >
            <Button
              as="a"
              href={`mailto:${eventInfo.contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`}
              variant="primary"
              size="lg"
              shape="pill"
            >
              Escribirnos por sponsoreo
            </Button>
          </SectionHeading>
        </Container>
      </Section>
    </>
  );
}
