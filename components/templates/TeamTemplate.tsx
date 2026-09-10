import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { OrganizersGrid } from "@/components/organisms/OrganizersGrid";
import type { Organizer } from "@/lib/content/organizers";
import type { EventInfo } from "@/lib/content/event-info";

type TeamTemplateProps = {
  organizers: Organizer[];
  eventInfo: EventInfo;
  volunteersHref?: string;
};

export function TeamTemplate({
  organizers,
  eventInfo,
  volunteersHref,
}: TeamTemplateProps) {
  return (
    <Section spacing="lg">
      <Container>
        <SectionHeading
          level={1}
          eyebrow="Quiénes somos"
          eyebrowGlyph="users"
          title="Equipo organizador"
          description="Voluntarios y voluntarias que arman cada edición del Community Day en Paraguay."
          className="mb-14"
        />
        <OrganizersGrid
          organizers={organizers}
          eventInfo={eventInfo}
          volunteersHref={volunteersHref}
        />
      </Container>
    </Section>
  );
}
