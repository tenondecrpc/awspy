// CFP page: the deadline as the hero fact with the submission button, what the
// committee is looking for, the formats, the key dates as a small timeline,
// and a note for first-time speakers.
//
// The CFP status, deadline, and the Sessionize submission link are delegated
// to `SessionizeCFPCallout` (open / upcoming / closed behavior preserved). The
// `archived` route renders only the finished-edition notice per FR-035.

import NextLink from "next/link";
import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import {
  BTN_OUTLINE,
  H2,
  SECTION_Y,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import { SessionizeCFPCallout } from "@/components/organisms/SessionizeCFPCallout";
import { startOfDayKey } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";

type CFPTemplateProps = {
  eventInfo: EventInfo;
  /** When true, renders only the archived notice (FR-035). */
  archived?: boolean;
};

const CONTACT_EMAIL = "awscommunitydayparaguay@gmail.com";

const FORMATS: { icon: GlyphName; name: string; body: string }[] = [
  {
    icon: "mic",
    name: "Charla técnica",
    body: "Un tema, un caso, una arquitectura. El formato principal del día.",
  },
  {
    icon: "flask",
    name: "Taller hands-on",
    body: "Práctico, con cupo limitado. La gente trae su notebook.",
  },
  {
    icon: "bolt",
    name: "Lightning talk",
    body: "Una idea, sin rodeos. Ideal si nunca presentaste.",
  },
  {
    icon: "users",
    name: "Panel",
    body: "Propuesta de tema y personas; el comité arma la mesa.",
  },
];

const LOOKING = [
  "Casos reales de producción, con los errores incluidos",
  "Servicios y prácticas de AWS aplicados a problemas concretos",
  "Seguridad, costos, datos, IA generativa y plataforma",
  "Contenido en español, sin pitch comercial",
  "Voces nuevas de la comunidad paraguaya y de la región",
];

type KeyDate = { when: string; title: string };

/** Formats a configured date for the Asunción calendar. */
function dotDate(input: string): string {
  return startOfDayKey(input).split("-").reverse().join(".");
}

// Only configured dates are shown, so changes to the CFP deadline or event
// date cannot leave stale committee milestones on the page.
function keyDates(eventInfo: EventInfo): KeyDate[] {
  const dates: KeyDate[] = [
    { when: dotDate(eventInfo.dates.start), title: "Community Day" },
  ];
  if (!eventInfo.cfpDeadline) return dates;
  return [
    {
      when: dotDate(eventInfo.cfpDeadline),
      title: "Cierre de la convocatoria",
    },
    ...dates,
  ];
}

const TEXT_LINK =
  "inline-flex min-h-[var(--size-touch)] items-center font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]";

export function CFPTemplate({ eventInfo, archived = false }: CFPTemplateProps) {
  if (archived) {
    return (
      <section id="contenido-principal" className={SECTION_Y}>
        <div className={WRAP}>
          <div className="max-w-2xl">
            <p className="m-0 text-base font-semibold text-[var(--color-text-primary)]">
              Edición finalizada
            </p>
            <h1 className="m-0 mb-4 mt-3 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
              Proponé una charla
            </h1>
            <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
              Esta edición ya finalizó. La convocatoria de charlas no está
              disponible.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const dates = keyDates(eventInfo);

  return (
    <>
      <section
        id="contenido-principal"
        className="pb-[var(--space-section-y)] pt-[clamp(1.5rem,4svh,3rem)]"
      >
        <div className={WRAP}>
          <h1 className="m-0 mb-2 font-display text-step-2 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Proponé una charla
          </h1>
          <p className="m-0 mb-8 max-w-[40rem] text-step-0 text-[var(--color-text-secondary)]">
            No hace falta ser speaker profesional: hace falta tener algo para
            contar.
          </p>

          <div className="grid items-stretch gap-6 lg:grid-cols-2">
            <SessionizeCFPCallout eventInfo={eventInfo} />

            <div className="min-w-0 bg-[var(--color-surface-elevated)] p-8">
              <h2 className={`${H2} mb-5`}>Qué buscamos</h2>
              <ul className="m-0 grid list-none gap-4 p-0">
                {LOOKING.map((label) => (
                  <li key={label} className="flex items-start gap-3">
                    <IconBadge name="check" size="sm" />
                    <span className="min-w-0 pt-1.5 text-base text-[var(--color-text-primary)]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`${SECTION_Y} bg-[var(--color-surface-muted)]`}>
        <div className={WRAP}>
          <h2 className={`${H2} mb-8`}>Formatos</h2>
          <ul className="m-0 grid list-none gap-5 p-0 [grid-template-columns:repeat(auto-fit,minmax(min(14rem,100%),1fr))]">
            {FORMATS.map((f) => (
              <li
                key={f.name}
                className="min-w-0 bg-[var(--color-surface-elevated)] p-6"
              >
                <IconBadge name={f.icon} size="lg" tone="solid" className="mb-4" />
                <h3 className="m-0 mb-1 text-step-0 leading-tight text-[var(--color-text-primary)]">
                  {f.name}
                </h3>
                <p className="m-0 text-base text-[var(--color-text-secondary)]">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={SECTION_Y}>
        <div className={WRAP}>
          <h2 className={`${H2} mb-8`}>Fechas clave</h2>
          <ol
            className="relative m-0 grid max-w-[44rem] list-none gap-x-6 p-0"
            style={{ gridTemplateColumns: `repeat(${dates.length}, 1fr)` }}
          >
            {/* The line runs behind the dots. */}
            <span
              aria-hidden="true"
              className="absolute left-2 right-2 top-2 h-0.5 bg-[var(--color-text-muted)]"
            />
            {dates.map((d) => (
              <li key={d.title} className="relative min-w-0">
                <span
                  aria-hidden="true"
                  className="relative block size-4 rounded-full bg-[var(--color-text-primary)]"
                />
                <p className="m-0 mt-4 flex items-center gap-2 font-display text-step-1 sm:text-step-2 leading-none text-[var(--color-text-primary)]">
                  <GlyphIcon name="calendar" size={24} />
                  {d.when}
                </p>
                <p className="m-0 mt-2 text-base font-semibold text-[var(--color-text-secondary)]">
                  {d.title}
                </p>
              </li>
            ))}
          </ol>
          <p className="m-0 mt-8 max-w-[38rem] text-base text-[var(--color-text-secondary)]">
            Después de enviar, el comité revisa cada propuesta y responde por
            Sessionize. Si tu charla queda seleccionada, te pedimos confirmación
            y datos para el perfil público.
          </p>
          <NextLink href="/speakers" className={TEXT_LINK}>
            Ver speakers confirmados
          </NextLink>
        </div>
      </section>

      <section className="pb-[var(--space-section-y)]">
        <div className={WRAP}>
          <div className="flex flex-col gap-6 bg-[var(--color-surface-muted)] p-8 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 gap-4">
              <IconBadge name="heart" size="lg" tone="solid" />
              <div className="min-w-0">
                <h2 className={`${H2} mb-2`}>¿Es tu primera charla?</h2>
                <p className="m-0 max-w-[36rem] text-base text-[var(--color-text-secondary)]">
                  Reservamos espacios de lightning talk para quienes nunca
                  presentaron. Si querés, te acompañamos a armar la propuesta y
                  ensayar antes del evento. Escribinos y te ponemos en contacto
                  con alguien del equipo.
                </p>
              </div>
            </div>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Primera%20charla%20-%20CFP%20AWS%20Community%20Day%20Paraguay`}
              className={`${BTN_OUTLINE} flex-none`}
            >
              <GlyphIcon name="mail" size={20} />
              Pedir mentoría
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
