import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { EventbriteRegisterButton } from "@/components/organisms/EventbriteRegisterButton";
import type { EventInfo } from "@/lib/content/event-info";

type RegisterTemplateProps = {
  eventInfo: EventInfo;
  /** When true, renders only the "Esta edición ya finalizó" message. Used by
   *  past-edition routes per FR-035. */
  archived?: boolean;
};

export function RegisterTemplate({
  eventInfo,
  archived = false,
}: RegisterTemplateProps) {
  const closed = archived || eventInfo.registrationStatus === "closed";

  return (
    <Section spacing="lg">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <Heading level={1}>Registro</Heading>

          {archived ? (
            <p className="text-[var(--color-text-secondary)]">
              Esta edición ya finalizó. El registro no está disponible.
            </p>
          ) : closed ? (
            <p className="text-[var(--color-text-secondary)]">
              El registro para esta edición ya está cerrado. Si querés que te
              avisemos de la próxima edición, escribinos a{" "}
              <a
                className="text-[var(--color-accent)] underline-offset-2 hover:underline"
                href={`mailto:${eventInfo.contactEmail}`}
              >
                {eventInfo.contactEmail}
              </a>
              .
            </p>
          ) : eventInfo.registrationStatus === "upcoming" ? (
            <>
              <p className="text-[var(--color-text-secondary)]">
                Aún no abrimos el registro. Vas a poder reservar tu lugar cuando
                esté disponible.
              </p>
              <EventbriteRegisterButton
                eventbriteEventUrl={eventInfo.eventbriteEventUrl}
                contactEmail={eventInfo.contactEmail}
                label="Avisame por mail"
              />
            </>
          ) : (
            <>
              <p className="text-[var(--color-text-secondary)]">
                El acceso al evento es gratuito. Reservá tu lugar a través de
                Eventbrite. Es un proceso rápido y solo necesitás un mail.
              </p>
              <div className="flex justify-center">
                <EventbriteRegisterButton
                  eventbriteEventUrl={eventInfo.eventbriteEventUrl}
                  contactEmail={eventInfo.contactEmail}
                />
              </div>
            </>
          )}
        </div>
      </Container>
    </Section>
  );
}
