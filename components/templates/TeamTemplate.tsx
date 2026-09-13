// Team page, rebuilt from scratch to reproduce the "Equipo" mockup
// (`AWS Community Day Paraguay (colored)/Equipo.dc.html`) 1:1 — same sections,
// same order, same colors (via exact design tokens), same spacing.
//
// The organizer roster is wired to the real `organizers` prop (rendered in the
// mockup's single-column list layout), the empty state is preserved, and the
// closing "Sumate" band keeps the volunteer and contact links live.

import NextLink from "next/link";
import {
  Frame,
  PageHeader,
  SECTION_BORDER,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import type { Organizer } from "@/lib/content/organizers";
import type { EventInfo } from "@/lib/content/event-info";

type TeamTemplateProps = {
  organizers: Organizer[];
  eventInfo: EventInfo;
  volunteersHref?: string;
};

const LINK_LABELS: Array<[keyof NonNullable<Organizer["links"]>, string]> = [
  ["linkedin", "LinkedIn"],
  ["twitter", "Twitter"],
  ["github", "GitHub"],
  ["website", "Sitio web"],
];

export function TeamTemplate({
  organizers,
  eventInfo,
  volunteersHref = "/volunteers",
}: TeamTemplateProps) {
  const hasVolunteerForm = Boolean(eventInfo.volunteerRegistrationUrl);
  const emptyActionHref = hasVolunteerForm
    ? volunteersHref
    : `mailto:${eventInfo.contactEmail}?subject=Voluntariado%20AWS%20Community%20Day%20Paraguay`;

  return (
    <>
      <PageHeader
        eyebrow="Quiénes somos"
        title="Equipo organizador"
        description="Voluntarios y voluntarias que arman cada edición del Community Day en Paraguay. Nadie cobra por organizar este evento."
      />

      {/* ── Roster ───────────────────────────────────────────── */}
      <section className={SECTION_BORDER}>
        <div className={`${WRAP} pb-16 pt-12`}>
          {organizers.length === 0 ? (
            <div className="border-t border-[var(--color-text-primary)] py-16 text-center">
              <h2 className="m-0 mb-3 text-[22px] font-extrabold tracking-[-0.025em] text-[var(--color-text-primary)]">
                Equipo en formación
              </h2>
              <p className="mx-auto mb-6 max-w-[34rem] text-[15px] leading-[1.6] text-[var(--color-text-secondary)]">
                {hasVolunteerForm
                  ? "Estamos sumando voluntarios al equipo organizador. Si querés colaborar, completá el formulario."
                  : "Estamos sumando voluntarios al equipo organizador. Si querés colaborar, escribinos."}
              </p>
              {hasVolunteerForm ? (
                <NextLink
                  href={emptyActionHref}
                  className="inline-flex items-center rounded-[4px] bg-[var(--color-action)] px-[28px] py-[14px] text-[15.5px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
                >
                  Quiero colaborar
                </NextLink>
              ) : (
                <a
                  href={emptyActionHref}
                  className="inline-flex items-center rounded-[4px] bg-[var(--color-action)] px-[28px] py-[14px] text-[15.5px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
                >
                  Quiero colaborar
                </a>
              )}
            </div>
          ) : (
            <div className="grid border-t border-[var(--color-text-primary)]">
              {organizers.map((o, i) => {
                const links = o.links ?? {};
                const linkEntries = LINK_LABELS.filter(([key]) => links[key]);
                return (
                  <article
                    key={o.id}
                    className="grid items-start gap-7 border-b border-[var(--color-border-subtle)] py-7 [grid-template-columns:minmax(140px,180px)_minmax(0,1fr)]"
                  >
                    <Frame
                      label={o.name}
                      photo={o.photo}
                      className="aspect-square w-full"
                    />
                    <div className="min-w-0">
                      <div className="mb-1 flex flex-wrap items-baseline gap-3">
                        <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.025em] text-[var(--color-text-primary)]">
                          {o.name}
                        </h2>
                      </div>
                      <p className="m-0 mb-3 text-[14.5px] font-semibold text-[var(--color-accent)]">
                        {o.role}
                      </p>
                      {o.bio ? (
                        <p className="m-0 max-w-[48rem] text-[15px] leading-[1.6] text-[var(--color-text-secondary)]">
                          {o.bio}
                        </p>
                      ) : null}
                      {linkEntries.length > 0 ? (
                        <ul className="m-0 mt-4 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
                          {linkEntries.map(([key, label]) => (
                            <li key={key}>
                              <a
                                href={links[key]!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[13px] font-semibold text-[var(--color-accent)]"
                              >
                                {label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Sumate (volunteer CTA) ───────────────────────────── */}
      <section
        className={`${SECTION_BORDER} bg-[var(--color-surface-inverse)] text-[var(--color-text-on-inverse)]`}
      >
        <div className={`${WRAP} py-16`}>
          <div className="grid items-center gap-10 [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="min-w-0">
              <p className="m-0 mb-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-action)]">
                Sumate
              </p>
              <h2 className="m-0 mb-3.5 text-[clamp(24px,3vw,36px)] font-extrabold leading-[1.06] tracking-[-0.035em]">
                El equipo crece con voluntarios
              </h2>
              <p className="m-0 max-w-[32rem] text-[16px] text-[var(--color-text-on-inverse-secondary)]">
                Acreditación, apoyo a speakers, armado de salas, contenido para
                redes. No hace falta experiencia previa, solo ganas de dar una
                mano.
              </p>
            </div>
            <div className="flex min-w-0 flex-wrap gap-3">
              <NextLink
                href={volunteersHref}
                className="inline-flex items-center whitespace-nowrap rounded-[4px] bg-[var(--color-action)] px-7 py-[14px] text-[15.5px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
              >
                Quiero ser voluntario/a
              </NextLink>
              <a
                href={`mailto:${eventInfo.contactEmail}`}
                className="inline-flex items-center whitespace-nowrap rounded-[4px] border-[1.5px] border-[var(--color-text-on-inverse)] px-7 py-[14px] text-[15.5px] font-semibold text-[var(--color-text-on-inverse)] transition-colors hover:bg-[var(--color-text-on-inverse)] hover:text-[var(--color-surface-inverse)]"
              >
                Escribirnos
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
