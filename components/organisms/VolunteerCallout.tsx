// Volunteer registration callout. Keeps the application link-only: the
// external form owns data collection and no Google Forms script is embedded.
//
// A dark panel: the state as a plain label, what helping involves as a ruled
// list, and one link at the end.

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

const LINK_CLASS =
  "inline-flex min-h-[var(--size-touch)] items-center self-start text-base font-semibold text-[var(--color-text-on-inverse)] underline decoration-[var(--color-national-red-on-dark)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-on-inverse)]";

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
    <div
      data-tone="inverse"
      className="bg-[var(--color-surface-inverse)] p-6 text-[var(--color-text-on-inverse)] sm:p-10"
    >
      <div className="flex flex-col gap-6">
        <p className="m-0 text-sm font-semibold text-[var(--color-national-red-on-dark)]">
          {STATUS_COPY[effectiveStatus]}
        </p>

        {effectiveStatus === "open" ? (
          <p className="m-0 max-w-2xl text-step-1 text-[var(--color-text-on-inverse-secondary)]">
            Estamos sumando personas con ganas de colaborar antes y durante el
            evento. Completá el formulario y contanos cómo te gustaría ayudar.
          </p>
        ) : effectiveStatus === "upcoming" ? (
          <p className="m-0 max-w-2xl text-step-1 text-[var(--color-text-on-inverse-secondary)]">
            Pronto vamos a abrir la convocatoria de voluntariado. Si querés que
            te avisemos, escribinos.
          </p>
        ) : (
          <p className="m-0 max-w-2xl text-step-1 text-[var(--color-text-on-inverse-secondary)]">
            La convocatoria de voluntariado para esta edición ya está cerrada.
            Gracias a todas las personas que se sumaron.
          </p>
        )}

        {effectiveStatus !== "closed" ? (
          <div>
            <h3 className="m-0 mb-3 font-semibold text-step-1 text-[var(--color-text-on-inverse)]">
              En qué podés ayudar
            </h3>
            <ul className="m-0 grid list-none gap-x-10 border-t border-[var(--color-border-on-inverse)] p-0 [grid-template-columns:repeat(auto-fit,minmax(min(280px,100%),1fr))]">
              {TASKS.map((task) => (
                <li
                  key={task}
                  className="border-b border-[var(--color-border-on-inverse)] py-3 text-base text-[var(--color-text-on-inverse-secondary)]"
                >
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {effectiveStatus === "open" && volunteerRegistrationUrl ? (
          <a
            href={volunteerRegistrationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            Completar formulario de voluntariado
          </a>
        ) : effectiveStatus === "upcoming" ? (
          <a
            href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20voluntariado`}
            className={LINK_CLASS}
          >
            Avisame por mail
          </a>
        ) : null}
      </div>
    </div>
  );
}
