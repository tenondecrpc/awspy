import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
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
        <div className="mb-10 max-w-3xl space-y-3">
          <Heading level={1}>Equipo organizador</Heading>
          <p className="text-[var(--color-text-secondary)]">
            Voluntarios y voluntarias que arman cada edición del Community Day
            en Paraguay.
          </p>
        </div>
        <OrganizersGrid
          organizers={organizers}
          eventInfo={eventInfo}
          volunteersHref={volunteersHref}
        />
      </Container>
    </Section>
  );
}
