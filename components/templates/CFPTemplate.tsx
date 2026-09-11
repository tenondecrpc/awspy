// CFP page, rebuilt from scratch to reproduce the "CFP" mockup
// (`AWS Community Day Paraguay (colored)/CFP.dc.html`) 1:1 — the light header
// band, the "Formatos" / "Qué buscamos" two-column block, the cream "Fechas
// clave" grid, and the "¿Es tu primera charla?" closing block. Colors come
// only from design tokens and spacing matches the mockup.
//
// The CFP status, deadline, and the Sessionize submission link are delegated
// to `SessionizeCFPCallout` (open / upcoming / closed behavior preserved). The
// `archived` route renders only the finished-edition notice per FR-035.

import NextLink from "next/link";
import { WRAP, SECTION_BORDER } from "@/components/site/primitives";
import { SessionizeCFPCallout } from "@/components/organisms/SessionizeCFPCallout";
import type { EventInfo } from "@/lib/content/event-info";

type CFPTemplateProps = {
  eventInfo: EventInfo;
  /** When true, renders only the archived notice (FR-035). */
  archived?: boolean;
};

const CONTACT_EMAIL = "awscommunitydayparaguay@gmail.com";

const FORMATS = [
  {
    name: "Charla técnica",
    body: "Un tema, un caso, una arquitectura. El formato principal del día.",
    length: "45 min",
  },
  {
    name: "Taller hands-on",
    body: "Práctico, con cupo limitado. La gente trae su notebook.",
    length: "90 min",
  },
  {
    name: "Lightning talk",
    body: "Una idea, sin rodeos. Ideal si nunca presentaste.",
    length: "10 min",
  },
  {
    name: "Panel",
    body: "Propuesta de tema y personas; el comité arma la mesa.",
    length: "45 min",
  },
];

const LOOKING = [
  "Casos reales de producción, con los errores incluidos",
  "Servicios y prácticas de AWS aplicados a problemas concretos",
  "Seguridad, costos, datos, IA generativa y plataforma",
  "Contenido en español, sin pitch comercial",
  "Voces nuevas de la comunidad paraguaya y de la región",
];

const DATES: { when: string; title: string; body: string; color: string }[] = [
  {
    when: "30.09.2026",
    title: "Cierre del CFP",
    body: "Última fecha para enviar propuestas en Sessionize.",
    color: "var(--color-national-red-label)",
  },
  {
    when: "07.10.2026",
    title: "Notificación",
    body: "El comité responde a todas las propuestas recibidas.",
    color: "var(--color-accent)",
  },
  {
    when: "12.10.2026",
    title: "Confirmación",
    body: "Speakers seleccionados confirman y envían su perfil.",
    color: "var(--color-accent)",
  },
  {
    when: "17.10.2026",
    title: "Community Day",
    body: "Charlas y talleres en UniNorte, Asunción.",
    color: "var(--color-category-green)",
  },
];

const H1 =
  "m-0 text-[clamp(34px,5vw,58px)] font-extrabold leading-[0.98] tracking-[-0.04em] text-[var(--color-text-primary)]";

export function CFPTemplate({ eventInfo, archived = false }: CFPTemplateProps) {
  if (archived) {
    return (
      <section
        id="contenido-principal"
        className={`${SECTION_BORDER} bg-[var(--color-surface-muted)]`}
      >
        <div className={`${WRAP} py-16`}>
          <h1 className={H1}>Proponé una charla</h1>
          <p className="m-0 mt-4 max-w-[38rem] text-[17px] leading-[1.55] text-[var(--color-text-secondary)]">
            Esta edición ya finalizó. La convocatoria de charlas no está
            disponible.
          </p>
        </div>
      </section>
    );
  }

  return (
    <>
      {/* ── Header band + Sessionize callout ─────────────────── */}
      <section
        id="contenido-principal"
        className={`${SECTION_BORDER} bg-[var(--color-surface-muted)]`}
      >
        <div className={`${WRAP} py-16`}>
          <h1 className={H1}>Proponé una charla</h1>
          <p className="m-0 mt-4 max-w-[38rem] text-[17px] leading-[1.55] text-[var(--color-text-secondary)]">
            Compartí tu experiencia con la comunidad. Buscamos charlas técnicas,
            casos reales, talleres y lightning talks en español. No hace falta
            ser speaker profesional: hace falta tener algo para contar.
          </p>
          <div className="mt-7 max-w-[42rem]">
            <SessionizeCFPCallout eventInfo={eventInfo} />
          </div>
        </div>
      </section>

      {/* ── Formatos + Qué buscamos ──────────────────────────── */}
      <section className={SECTION_BORDER}>
        <div className={WRAP}>
          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="min-w-0 py-[52px] pr-0 lg:pr-12">
              <h2 className="m-0 mb-5 text-[24px] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                Formatos
              </h2>
              <div className="border-t border-[var(--color-text-primary)]">
                {FORMATS.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-baseline justify-between gap-[18px] border-b border-[var(--color-border-subtle)] py-4"
                  >
                    <div className="min-w-0">
                      <h3 className="m-0 mb-[3px] text-[16px] font-bold text-[var(--color-text-primary)]">
                        {f.name}
                      </h3>
                      <p className="m-0 text-[14px] text-[var(--color-text-muted)]">
                        {f.body}
                      </p>
                    </div>
                    <span className="flex-none font-mono text-[12.5px] text-[var(--color-text-primary)]">
                      {f.length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="min-w-0 border-t border-[var(--color-border-subtle)] py-[52px] lg:border-l lg:border-t-0 lg:pl-12">
              <h2 className="m-0 mb-5 text-[24px] font-extrabold tracking-[-0.03em] text-[var(--color-text-primary)]">
                Qué buscamos
              </h2>
              <ul className="m-0 list-none border-t border-[var(--color-text-primary)] p-0">
                {LOOKING.map((label) => (
                  <li
                    key={label}
                    className="flex items-baseline gap-3 border-b border-[var(--color-border-subtle)] py-[14px]"
                  >
                    <span
                      aria-hidden="true"
                      className="flex-none font-mono text-[11px] text-[var(--color-category-green)]"
                    >
                      ✓
                    </span>
                    <span className="text-[15px] text-[var(--color-text-primary)]">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Fechas clave ─────────────────────────────────────── */}
      <section className={`${SECTION_BORDER} bg-[var(--color-surface-warm)]`}>
        <div className={`${WRAP} py-14`}>
          <h2 className="m-0 mb-[26px] text-[clamp(22px,2.6vw,30px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[var(--color-text-primary)]">
            Fechas clave
          </h2>
          <div className="grid border-l border-t border-[var(--color-text-primary)] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]">
            {DATES.map((d) => (
              <div
                key={d.title}
                className="min-w-0 border-b border-r border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-[22px]"
              >
                <p
                  className="m-0 mb-2 font-mono text-[13px]"
                  style={{ color: d.color }}
                >
                  {d.when}
                </p>
                <h3 className="m-0 mb-1 text-[16px] font-bold text-[var(--color-text-primary)]">
                  {d.title}
                </h3>
                <p className="m-0 text-[14px] text-[var(--color-text-muted)]">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ¿Es tu primera charla? ───────────────────────────── */}
      <section>
        <div className={`${WRAP} pb-[72px] pt-14`}>
          <div className="grid items-center gap-10 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="min-w-0">
              <h2 className="m-0 mb-3.5 text-[clamp(24px,3vw,34px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[var(--color-text-primary)]">
                ¿Es tu primera charla?
              </h2>
              <p className="m-0 mb-5 max-w-[32rem] text-[16px] text-[var(--color-text-secondary)]">
                Reservamos espacios de lightning talk para quienes nunca
                presentaron. Si querés, te acompañamos a armar la propuesta y
                ensayar antes del evento. Escribinos y te ponemos en contacto
                con alguien del equipo.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Primera%20charla%20-%20CFP%20AWS%20Community%20Day%20Paraguay`}
                className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-[26px] py-[13px] text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
              >
                Pedir mentoría
              </a>
            </div>
            <div className="min-w-0 border border-[var(--color-text-primary)] p-7">
              <p className="m-0 mb-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Después de enviar
              </p>
              <p className="m-0 mb-4 text-[15px] text-[var(--color-text-secondary)]">
                El comité revisa cada propuesta y responde por Sessionize. Si tu
                charla queda seleccionada, te pedimos confirmación y datos para
                el perfil público.
              </p>
              <NextLink
                href="/speakers"
                className="text-[15px] font-semibold text-[var(--color-accent)]"
              >
                Ver speakers confirmados →
              </NextLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
