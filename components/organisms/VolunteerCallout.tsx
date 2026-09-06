// Volunteer registration callout. Keeps the application link-only: the
// external form owns data collection and no Google Forms script is embedded.

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import type { EventInfo } from "@/lib/content/event-info";

type VolunteerCalloutProps = {
  eventInfo: EventInfo;
};

const STATUS_COPY: Record<EventInfo["volunteerRegistrationStatus"], string> = {
  open: "Convocatoria abierta",
  upcoming: "Convocatoria próximamente",
  closed: "Convocatoria cerrada",
};

export function VolunteerCallout({ eventInfo }: VolunteerCalloutProps) {
  const {
    contactEmail,
    volunteerRegistrationStatus,
    volunteerRegistrationUrl,
  } = eventInfo;
  const effectiveStatus =
    volunteerRegistrationStatus === "open" && !volunteerRegistrationUrl
      ? "upcoming"
      : volunteerRegistrationStatus;

  return (
    <div className="space-y-5 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-6 sm:p-8">
      <Badge variant={effectiveStatus === "open" ? "info" : "neutral"}>
        {STATUS_COPY[effectiveStatus]}
      </Badge>

      {effectiveStatus === "open" ? (
        <p className="text-[var(--color-text-secondary)]">
          Estamos sumando personas con ganas de colaborar antes y durante el
          evento. Completá el formulario y contanos cómo te gustaría ayudar.
        </p>
      ) : effectiveStatus === "upcoming" ? (
        <p className="text-[var(--color-text-secondary)]">
          Pronto vamos a abrir la convocatoria de voluntariado. Si querés que te
          avisemos, escribinos.
        </p>
      ) : (
        <p className="text-[var(--color-text-secondary)]">
          La convocatoria de voluntariado para esta edición ya está cerrada.
          Gracias a todas las personas que se sumaron.
        </p>
      )}

      {effectiveStatus === "open" && volunteerRegistrationUrl ? (
        <Button
          as="a"
          href={volunteerRegistrationUrl}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
        >
          Completar formulario de voluntariado
        </Button>
      ) : effectiveStatus === "upcoming" ? (
        <Button
          as="a"
          href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20voluntariado`}
          variant="secondary"
        >
          Avisame por mail
        </Button>
      ) : null}
    </div>
  );
}
