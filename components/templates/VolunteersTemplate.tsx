// Volunteers template. A navy band with the one promise (no experience needed),
// the status and the form link; below, the six roles as icon cards and a
// closing action while the application is open.
//
// The external Google Form owns data collection: the CTA is link-only and no
// third-party script is embedded. Status logic mirrors the rest of the family
// (an "open" status without a URL degrades to "upcoming"), and past-edition
// routes render the archived notice instead of an active application.

import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  BTN_INK,
  BTN_OUTLINE,
  Frame,
  H2,
  SECTION_Y,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import type { EventInfo } from "@/lib/content/event-info";

type VolunteersTemplateProps = {
  eventInfo: EventInfo;
  /** Past-edition routes never expose an active application form. */
  archived?: boolean;
};

const STATUS_COPY: Record<EventInfo["volunteerRegistrationStatus"], string> = {
  open: "Convocatoria abierta",
  upcoming: "Convocatoria próximamente",
  closed: "Convocatoria cerrada",
};

// Examples of what the volunteer shifts usually cover.
const TASKS: { icon: GlyphName; title: string; body: string }[] = [
  {
    icon: "door",
    title: "Acreditación y bienvenida",
    body: "Recibir a los asistentes, entregar credenciales y orientar en el ingreso.",
  },
  {
    icon: "mic",
    title: "Apoyo a speakers",
    body: "Acompañar antes y durante la charla: sala, proyector, tiempos.",
  },
  {
    icon: "clipboard",
    title: "Control de horarios y salas",
    body: "Cuidar que cada bloque empiece y termine cuando corresponde.",
  },
  {
    icon: "camera",
    title: "Fotos y contenido",
    body: "Registrar el día para las redes del user group.",
  },
  {
    icon: "users",
    title: "Espacio de comunidad",
    body: "Orientar en la zona de sponsors, networking y actividades.",
  },
  {
    icon: "box",
    title: "Armado y desarmado",
    body: "Antes de que abra y después de que cierre. El trabajo invisible.",
  },
];

// What a volunteer takes home: soft, verifiable-by-nature claims only.
const GAINS: { icon: GlyphName; title: string; body: string }[] = [
  {
    icon: "users",
    title: "Conocés a la comunidad",
    body: "Trabajás codo a codo con quienes organizan, hablan y asisten.",
  },
  {
    icon: "door",
    title: "Vivís el evento desde adentro",
    body: "Ves cómo se arma un Community Day, de la puerta al escenario.",
  },
  {
    icon: "bulb",
    title: "Aprendés haciendo",
    body: "Logística, atención y trabajo en equipo en un evento real.",
  },
  {
    icon: "heart",
    title: "Ayudás a que suceda",
    body: "Sin voluntarios no hay Community Day. Se nota en cada detalle.",
  },
];

// The day in three beats, so the commitment is easy to picture.
const PHASES: { label: string; body: string }[] = [
  {
    label: "Antes",
    body: "Armado de la sala y preparación de credenciales.",
  },
  {
    label: "Durante",
    body: "Turnos en acreditación, salas y espacios de comunidad.",
  },
  {
    label: "Después",
    body: "Desarmado y cierre del evento.",
  },
];

const EXPECTATIONS = [
  { label: "Compromiso", value: "Un turno durante el evento" },
  { label: "Incluye", value: "Remera oficial y almuerzo" },
  { label: "Requisitos", value: "Ninguno, solo ganas" },
];

export function VolunteersTemplate({
  eventInfo,
  archived = false,
}: VolunteersTemplateProps) {
  const {
    contactEmail,
    volunteerRegistrationStatus,
    volunteerRegistrationUrl,
  } = eventInfo;

  const effectiveStatus =
    volunteerRegistrationStatus === "open" && !volunteerRegistrationUrl
      ? "upcoming"
      : volunteerRegistrationStatus;
  const isOpen =
    effectiveStatus === "open" && Boolean(volunteerRegistrationUrl);
  const showRoles = !archived && effectiveStatus !== "closed";

  return (
    <>
      <section
        id="contenido-principal"
        className="bg-[var(--color-surface-muted)] py-[clamp(2rem,6svh,4rem)] text-[var(--color-text-primary)]"
      >
        <div
          className={`${WRAP} grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-12`}
        >
          <div className="min-w-0 max-w-[40rem]">
            {archived ? null : (
              <p className="m-0 mb-3 flex items-center gap-2.5 text-base font-semibold">
                <span
                  aria-hidden="true"
                  className={
                    "size-2.5 flex-none " +
                    (isOpen
                      ? "bg-[var(--color-success)]"
                      : "border-2 border-[var(--color-text-primary)]")
                  }
                />
                {STATUS_COPY[effectiveStatus]}
              </p>
            )}
            <h1 className="m-0 mb-3 font-display text-step-3 leading-[1.05] tracking-[-0.01em]">
              Voluntariado
            </h1>
            <p className="m-0 mb-3 font-display text-step-2 leading-[1.15] text-[var(--color-text-primary)]">
              El Community Day lo hacemos entre todos. Sumate al equipo.
            </p>
            <p className="m-0 mb-7 text-step-0 text-[var(--color-text-secondary)]">
              No necesitás experiencia previa, solo ganas de ayudar a que
              speakers y asistentes tengan una buena experiencia en el AWS
              Community Day Paraguay.
            </p>

            {!archived && (
              <dl className="m-0 mb-7 grid gap-3 border-t border-[var(--color-border-subtle)] pt-5 sm:grid-cols-3">
                {EXPECTATIONS.map(({ label, value }) => (
                  <div key={label} className="min-w-0">
                    <dt className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {label}
                    </dt>
                    <dd className="m-0 text-sm text-[var(--color-text-secondary)]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {archived ? (
              <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
                Esta edición ya finalizó. La convocatoria de voluntariado no
                está disponible.
              </p>
            ) : isOpen && volunteerRegistrationUrl ? (
              <a
                href={volunteerRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={BTN_INK}
              >
                Completar formulario de voluntariado
                <GlyphIcon name="external" size={20} />
              </a>
            ) : effectiveStatus === "upcoming" ? (
              <a
                href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20voluntariado`}
                className={BTN_INK}
              >
                <GlyphIcon name="mail" size={20} />
                Avisame por mail
              </a>
            ) : (
              <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
                La convocatoria de voluntariado para esta edición ya está
                cerrada. Gracias a todas las personas que se sumaron.
              </p>
            )}
          </div>

          <Frame
            label="Integrantes de la comunidad conversando en un encuentro anterior"
            photo="/assets/networking.jpg"
            className="aspect-[4/3] w-full"
            sizes="(min-width: 1024px) 480px, 100vw"
          />
        </div>
      </section>

      {showRoles ? (
        <section className={`${SECTION_Y} pb-0`}>
          <div className={WRAP}>
            <h2 className={`${H2} mb-8`}>Qué te llevás</h2>
            <ul className="m-0 grid list-none gap-6 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(14rem,100%),1fr))]">
              {GAINS.map((g) => (
                <li key={g.title} className="min-w-0">
                  <IconBadge
                    name={g.icon}
                    size="lg"
                    tone="solid"
                    className="mb-4"
                  />
                  <h3 className="m-0 mb-1 text-step-0 leading-tight text-[var(--color-text-primary)]">
                    {g.title}
                  </h3>
                  <p className="m-0 text-base text-[var(--color-text-secondary)]">
                    {g.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {showRoles ? (
        <section className={SECTION_Y}>
          <div className={WRAP}>
            <h2 className={`${H2} mb-6`}>Cómo es el día</h2>
            <ol className="m-0 mb-14 grid list-none gap-3 p-0 md:grid-cols-3">
              {PHASES.map((ph, i) => (
                <li
                  key={ph.label}
                  className="flex min-w-0 items-start gap-4 border-t-2 border-[var(--color-text-primary)] pt-4"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-step-3 leading-none text-[var(--color-text-primary)]"
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="m-0 mb-1 text-step-0 leading-tight">
                      {ph.label}
                    </h3>
                    <p className="m-0 text-base text-[var(--color-text-secondary)]">
                      {ph.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <h2 className={`${H2} mb-8`}>En qué podés ayudar</h2>
            <ul className="m-0 grid list-none gap-5 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(20rem,100%),1fr))]">
              {TASKS.map((task) => (
                <li
                  key={task.title}
                  className="min-w-0 bg-[var(--color-surface-elevated)] p-6"
                >
                  <IconBadge name={task.icon} size="lg" className="mb-4" />
                  <h3 className="m-0 mb-1 text-step-0 leading-tight text-[var(--color-text-primary)]">
                    {task.title}
                  </h3>
                  <p className="m-0 text-base text-[var(--color-text-secondary)]">
                    {task.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {isOpen && volunteerRegistrationUrl ? (
        <section className="pb-[var(--space-section-y)]">
          <div className={WRAP}>
            <div className="flex flex-col gap-6 bg-[var(--color-surface-muted)] p-8 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <h2 className={`${H2} mb-2`}>¿Listo para sumarte?</h2>
                <p className="m-0 max-w-[34rem] text-base text-[var(--color-text-secondary)]">
                  Completá el formulario y contanos cómo te gustaría ayudar. Te
                  escribimos antes del evento.
                </p>
              </div>
              <a
                href={volunteerRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${BTN_OUTLINE} flex-none`}
              >
                Quiero ser voluntario/a
                <GlyphIcon name="external" size={20} />
              </a>
            </div>
            <p className="m-0 mt-4 max-w-[38rem] text-sm text-[var(--color-text-secondary)]">
              El formulario lo gestiona Google Forms. Este sitio no embebe
              scripts de terceros para eso ni guarda tus datos.
            </p>
          </div>
        </section>
      ) : showRoles ? (
        <section className="pb-[var(--space-section-y)]">
          <div className={WRAP}>
            <p className="m-0 max-w-[38rem] text-sm text-[var(--color-text-secondary)]">
              El formulario lo gestiona Google Forms. Este sitio no embebe
              scripts de terceros para eso ni guarda tus datos.
            </p>
          </div>
        </section>
      ) : null}
    </>
  );
}
