// Volunteer registration callout. Keeps the application link-only: the
// external form owns data collection and no Google Forms script is embedded.
//
// Shaped like the closing call to action the rest of the AWS Community Day
// family uses: a dark panel, the state as a badge, what helping actually
// involves as a checklist, and one pill CTA.

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { DecorativePattern } from "@/components/atoms/DecorativePattern";
import type { EventInfo } from "@/lib/content/event-info";

type VolunteerCalloutProps = {
  eventInfo: EventInfo;
};

const STATUS_COPY: Record<EventInfo["volunteerRegistrationStatus"], string> = {
  open: "Convocatoria abierta",
  upcoming: "Convocatoria próximamente",
  closed: "Convocatoria cerrada",
};

// Examples of what the volunteer shifts usually cover. Illustrative, so the
// section has substance before the team confirms the final roles.
const TASKS = [
  "Acreditación y bienvenida de asistentes",
  "Apoyo a speakers antes y durante su charla",
  "Control de horarios y armado de salas",
  "Registro de fotos y contenido para redes",
  "Orientación en el espacio de comunidad",
  "Armado y desarmado del evento",
];

export function VolunteerCallout({ eventInfo }: VolunteerCalloutProps) {
  const {
    contactEmail,
    volunteerRegistrationStatus,
    volunteerRegistrationUrl,
    year,
  } = eventInfo;
  const effectiveStatus =
    volunteerRegistrationStatus === "open" && !volunteerRegistrationUrl
      ? "upcoming"
      : volunteerRegistrationStatus;

  return (
    <div
      data-tone="inverse"
      className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-inverse)] p-6 text-[var(--color-text-on-inverse)] sm:p-10"
    >
      <DecorativePattern
        density="low"
        opacity={0.06}
        seed={`volunteers-callout-${year}`}
      />

      <div className="relative flex flex-col gap-6">
        <Badge
          variant={effectiveStatus === "open" ? "info" : "neutral"}
          className="self-start"
        >
          {STATUS_COPY[effectiveStatus]}
        </Badge>

        {effectiveStatus === "open" ? (
          <p className="max-w-2xl text-lg opacity-90">
            Estamos sumando personas con ganas de colaborar antes y durante el
            evento. Completá el formulario y contanos cómo te gustaría ayudar.
          </p>
        ) : effectiveStatus === "upcoming" ? (
          <p className="max-w-2xl text-lg opacity-90">
            Pronto vamos a abrir la convocatoria de voluntariado. Si querés que
            te avisemos, escribinos.
          </p>
        ) : (
          <p className="max-w-2xl text-lg opacity-90">
            La convocatoria de voluntariado para esta edición ya está cerrada.
            Gracias a todas las personas que se sumaron.
          </p>
        )}

        {effectiveStatus !== "closed" ? (
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-national-red-on-dark)]">
              En qué podés ayudar
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {TASKS.map((task) => (
                <li key={task} className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="glass-panel mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[var(--radius-pill)] text-[var(--color-national-red-on-dark)]"
                  >
                    <GlyphIcon name="bolt" size={13} />
                  </span>
                  <span className="text-sm opacity-90">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {effectiveStatus === "open" && volunteerRegistrationUrl ? (
          <Button
            as="a"
            href={volunteerRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            size="lg"
            shape="pill"
            className="self-start"
          >
            Completar formulario de voluntariado
          </Button>
        ) : effectiveStatus === "upcoming" ? (
          <Button
            as="a"
            href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20voluntariado`}
            variant="secondary"
            shape="pill"
            className="self-start"
          >
            Avisame por mail
          </Button>
        ) : null}
      </div>
    </div>
  );
}
