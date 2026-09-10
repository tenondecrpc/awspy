import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { VenueCard } from "@/components/organisms/VenueCard";
import type { Venue } from "@/lib/content/venue";

type VenueTemplateProps = {
  venue: Venue;
};

export function VenueTemplate({ venue }: VenueTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          level={1}
          eyebrow="Ubicación"
          eyebrowGlyph="pin"
          title="Sede"
          description="Dónde nos vemos para el AWS Community Day Paraguay."
          className="mb-14"
        />
      </Container>
      <VenueCard venue={venue} />
    </Section>
  );
}
