// Volunteers template, restyled to the new site look using the "Voluntarios"
// mockup (`AWS Community Day Paraguay (colored)/Voluntarios.dc.html`): a light
// inner-page header with the convocatoria status and the orange form CTA, the
// "en qué podés ayudar" grid, a "qué esperar" warm panel, and a closing CTA.
//
// The external Google Form owns data collection: the CTA is link-only and no
// third-party script is embedded. Status logic mirrors the rest of the family
// (an "open" status without a URL degrades to "upcoming"), and past-edition
// routes render the archived notice instead of an active application.
//
// Colors come exclusively from the design tokens in `app/globals.css`.

import { NumberHeading, PageHeader, SECTION_BORDER, WRAP } from "@/components/site/primitives";
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

// Examples of what the volunteer shifts usually cover. Illustrative, so the
// section has substance before the team confirms the final roles.
const TASKS = [
  {
    title: "Acreditación y bienvenida",
    body: "Recibir a los asistentes, entregar badges y orientar en el ingreso.",
  },
  {
    title: "Apoyo a speakers",
    body: "Acompañar antes y durante la charla: sala, proyector, tiempos.",
  },
  {
    title: "Control de horarios y salas",
    body: "Cuidar que cada bloque empiece y termine cuando corresponde.",
  },
  {
    title: "Fotos y contenido",
    body: "Registrar el día para las redes del user group.",
  },
  {
    title: "Espacio de comunidad",
    body: "Orientar en la zona de sponsors, networking y actividades.",
  },
  {
    title: "Armado y desarmado",
    body: "Antes de que abra y después de que cierre. El trabajo invisible.",
  },
];

const EXPECTATIONS = [
  { k: "Compromiso", v: "Un turno de 3 a 4 horas" },
  { k: "Cuándo", v: "El día del evento" },
  { k: "Incluye", v: "Remera oficial y almuerzo" },
  { k: "Requisitos", v: "Ninguno, solo ganas" },
];

export function VolunteersTemplate({
  eventInfo,
  archived = false,
}: VolunteersTemplateProps) {
  const { contactEmail, volunteerRegistrationStatus, volunteerRegistrationUrl } =
    eventInfo;

  const effectiveStatus =
    volunteerRegistrationStatus === "open" && !volunteerRegistrationUrl
      ? "upcoming"
      : volunteerRegistrationStatus;
  const isOpen = effectiveStatus === "open" && Boolean(volunteerRegistrationUrl);
  const showRoles = !archived && effectiveStatus !== "closed";

  return (
    <>
      <PageHeader
        eyebrow="Sumate al equipo"
        title="Voluntariado"
        description="Sumate al equipo que hace posible el AWS Community Day Paraguay y ayudanos a crear una buena experiencia para speakers y asistentes. No necesitás experiencia previa, solo ganas de ayudar."
      >
        {archived ? null : (
          <div className="flex flex-col gap-6">
            <span
              className={
                "inline-flex items-center gap-[9px] self-start rounded-[3px] border px-3 py-[5px] " +
                (isOpen
                  ? "border-[var(--color-success)]"
                  : "border-[var(--color-border-subtle)]")
              }
            >
              <span
                aria-hidden="true"
                className={
                  "h-[7px] w-[7px] rounded-full " +
                  (isOpen
                    ? "bg-[var(--color-success)]"
                    : "bg-[var(--color-text-muted)]")
                }
              />
              <span
                className={
                  "font-mono text-[11px] uppercase tracking-[0.12em] " +
                  (isOpen
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-text-muted)]")
                }
              >
                {STATUS_COPY[effectiveStatus]}
              </span>
            </span>

            {isOpen && volunteerRegistrationUrl ? (
              <a
                href={volunteerRegistrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 self-start rounded-[4px] bg-[var(--color-action)] px-[30px] py-[15px] text-[16px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
              >
                Completar formulario de voluntariado
                <span aria-hidden="true">↗</span>
              </a>
            ) : effectiveStatus === "upcoming" ? (
              <a
                href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20voluntariado`}
                className="inline-flex items-center self-start rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-7 py-[13px] text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
              >
                Avisame por mail
              </a>
            ) : null}
          </div>
        )}
      </PageHeader>

      {archived ? (
        <section className={SECTION_BORDER}>
          <div className={`${WRAP} py-[72px]`}>
            <p className="max-w-[38rem] text-[16px] text-[var(--color-text-secondary)]">
              Esta edición ya finalizó. La convocatoria de voluntariado no está
              disponible.
            </p>
          </div>
        </section>
      ) : (
        <>
          {effectiveStatus === "closed" ? (
            <section className={SECTION_BORDER}>
              <div className={`${WRAP} py-[72px]`}>
                <p className="max-w-[38rem] text-[16px] text-[var(--color-text-secondary)]">
                  La convocatoria de voluntariado para esta edición ya está
                  cerrada. Gracias a todas las personas que se sumaron.
                </p>
              </div>
            </section>
          ) : null}

          {showRoles ? (
            <>
              {/* 01 · En qué podés ayudar */}
              <section className={`${SECTION_BORDER} bg-[var(--color-surface)]`}>
                <div className={`${WRAP} py-[52px]`}>
                  <NumberHeading n="01" title="En qué podés ayudar" />
                  <div className="grid border-l border-t border-[var(--color-border-subtle)] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                    {TASKS.map((task, i) => (
                      <div
                        key={task.title}
                        className="min-w-0 border-b border-r border-[var(--color-border-subtle)] p-[22px]"
                      >
                        <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mb-[5px] mt-2 text-[16px] font-bold">
                          {task.title}
                        </h3>
                        <p className="m-0 text-[14px] text-[var(--color-text-muted)]">
                          {task.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 02 · Qué esperar */}
              <section
                className={`${SECTION_BORDER} bg-[var(--color-surface-warm)]`}
              >
                <div className={`${WRAP} py-[52px]`}>
                  <NumberHeading n="02" title="Qué esperar" />
                  <div className="grid max-w-[32rem] border-t border-[var(--color-text-primary)]">
                    {EXPECTATIONS.map((e) => (
                      <div
                        key={e.k}
                        className="flex justify-between gap-[18px] border-b border-[var(--color-border-subtle)] py-3.5"
                      >
                        <span className="text-[14.5px] text-[var(--color-text-muted)]">
                          {e.k}
                        </span>
                        <span className="text-right text-[14.5px] font-semibold">
                          {e.v}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-[22px] max-w-[32rem] text-[14px] text-[var(--color-text-secondary)]">
                    El formulario lo gestiona Google Forms. Este sitio no embebe
                    scripts de terceros ni guarda tus datos.
                  </p>
                </div>
              </section>
            </>
          ) : null}

          {/* Closing CTA — only while the application is actually open. */}
          {isOpen && volunteerRegistrationUrl ? (
            <section className={`${SECTION_BORDER} bg-[var(--color-surface)]`}>
              <div className={`${WRAP} py-[56px]`}>
                <div className="flex flex-wrap items-center justify-between gap-6 border border-[var(--color-text-primary)] p-8">
                  <div className="min-w-0">
                    <h2 className="m-0 mb-1.5 text-[21px] font-extrabold tracking-[-0.025em]">
                      ¿Listo para sumarte?
                    </h2>
                    <p className="m-0 text-[15px] text-[var(--color-text-secondary)]">
                      Completá el formulario y contanos cómo te gustaría ayudar.
                      Te escribimos antes del evento.
                    </p>
                  </div>
                  <a
                    href={volunteerRegistrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-none items-center whitespace-nowrap rounded-[4px] bg-[var(--color-action)] px-[26px] py-[13px] text-[15px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
                  >
                    Quiero ser voluntario/a
                  </a>
                </div>
              </div>
            </section>
          ) : null}
        </>
      )}
    </>
  );
}
