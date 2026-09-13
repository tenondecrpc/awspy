// Speakers list page, rebuilt from scratch to reproduce the "Speakers" mockup
// (`AWS Community Day Paraguay (colored)/Speakers.dc.html`) 1:1 — same header
// band, same confirmed-count row, same portrait grid, and the same closing CFP
// banner. Real Sessionize data drives the grid; the empty-state branch and the
// CFP status logic are preserved.

import NextLink from "next/link";
import {
  PageHeader,
  Frame,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import type { Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type SpeakersTemplateProps = {
  speakers: Speaker[];
  eventInfo: EventInfo;
  basePath?: string;
};

export function SpeakersTemplate({
  speakers,
  eventInfo,
  basePath = "/speakers",
}: SpeakersTemplateProps) {
  const cfpOpen = eventInfo.cfpStatus === "open";
  const cfpHref = cfpOpen ? "/cfp" : `mailto:${eventInfo.contactEmail}`;

  return (
    <>
      <PageHeader
        eyebrow="Comunidad"
        title="Speakers"
        description={`Las personas que van a compartir charlas y talleres en ${eventInfo.name}. La grilla se completa a medida que se confirman las propuestas de la convocatoria.`}
      >
        <div className="flex flex-wrap items-center gap-2.5">
          <NextLink
            href="/schedule"
            className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
          >
            Ver la agenda
          </NextLink>
          <NextLink
            href="/cfp"
            className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-border-subtle)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
          >
            Proponer una charla
          </NextLink>
        </div>
      </PageHeader>

      <section className="bg-[var(--color-surface)]">
        <div className={`${WRAP} pb-[72px] pt-12`}>
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-4">
            <p className="m-0 font-mono text-[12px] text-[var(--color-text-muted)]">
              {speakers.length}{" "}
              {speakers.length === 1
                ? "persona confirmada"
                : "personas confirmadas"}
            </p>
          </div>

          {speakers.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-5 border border-[var(--color-border-subtle)] p-7">
              <div className="min-w-0">
                <h2 className="m-0 mb-1.5 text-[19px] font-bold tracking-[-0.02em]">
                  Pronto anunciamos a los speakers
                </h2>
                <p className="m-0 text-[14.5px] text-[var(--color-text-secondary)]">
                  Estamos definiendo la grilla de oradores. Si querés
                  participar, enviá tu propuesta desde la convocatoria de
                  charlas.
                </p>
              </div>
              <a
                href={cfpHref}
                className="inline-flex flex-none items-center whitespace-nowrap rounded-[4px] bg-[var(--color-action)] px-[26px] py-[13px] text-[15px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
              >
                {cfpOpen ? "Enviar mi charla" : "Escribirnos"}
              </a>
            </div>
          ) : (
            <div className="grid gap-7 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              {speakers.map((sp, i) => {
                const talk = sp.sessions?.find((s) => s.name)?.name;
                return (
                  <article key={sp.id} className="min-w-0">
                    <NextLink
                      href={`${basePath}/${sp.slug}`}
                      className="block text-[var(--color-text-primary)]"
                    >
                      <Frame
                        label={sp.fullName}
                        photo={sp.profilePicture ?? undefined}
                        className="mb-3.5 aspect-[3/4] w-full"
                      />
                    </NextLink>
                    <div className="flex items-baseline gap-2.5">
                      <span className="flex-none font-mono text-[11px] text-[var(--color-text-muted)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="m-0 text-[17px] font-bold tracking-[-0.02em]">
                            <NextLink
                              href={`${basePath}/${sp.slug}`}
                              className="text-[var(--color-text-primary)] hover:text-[var(--color-accent)]"
                            >
                              {sp.fullName}
                            </NextLink>
                          </h2>
                          {sp.isTopSpeaker ? (
                            <span className="rounded-[3px] bg-[var(--color-text-primary)] px-[7px] py-[3px] font-mono text-[9.5px] uppercase tracking-[0.12em] text-[var(--color-text-on-inverse)]">
                              Top speaker
                            </span>
                          ) : null}
                        </div>
                        {sp.tagLine ? (
                          <p className="m-0 mb-2 mt-[3px] text-[13px] text-[var(--color-text-muted)]">
                            {sp.tagLine}
                          </p>
                        ) : null}
                        {talk ? (
                          <p className="m-0 text-[13.5px] font-semibold leading-[1.4] text-[var(--color-accent)]">
                            {talk}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {speakers.length > 0 ? (
            <div className="mt-14 flex flex-wrap items-center justify-between gap-5 border border-[var(--color-border-subtle)] p-7">
              <div className="min-w-0">
                <h2 className="m-0 mb-1.5 text-[19px] font-bold tracking-[-0.02em]">
                  ¿Querés estar en esta lista?
                </h2>
                <p className="m-0 text-[14.5px] text-[var(--color-text-secondary)]">
                  {cfpOpen
                    ? "La convocatoria de charlas sigue abierta. Enviá tu propuesta y sumate a la grilla."
                    : "La convocatoria de charlas está cerrada por ahora. Escribinos si querés participar en próximas ediciones."}
                </p>
              </div>
              <a
                href={cfpHref}
                className="inline-flex flex-none items-center whitespace-nowrap rounded-[4px] bg-[var(--color-action)] px-[26px] py-[13px] text-[15px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
              >
                {cfpOpen ? "Enviar mi propuesta" : "Escribirnos"}
              </a>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
