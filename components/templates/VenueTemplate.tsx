import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { VenueCard } from "@/components/organisms/VenueCard";
import type { Venue } from "@/lib/content/venue";

type VenueTemplateProps = {
  venue: Venue;
};

export function VenueTemplate({ venue }: VenueTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <div className="mb-10 max-w-3xl space-y-3">
          <Heading level={1}>Sede</Heading>
          <p className="text-[var(--color-text-secondary)]">
            Dónde nos vemos para el AWS Community Day Paraguay.
          </p>
        </div>
      </Container>
      <VenueCard venue={venue} />
    </Section>
  );
}
