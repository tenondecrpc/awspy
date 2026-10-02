// Speakers list page. Real Sessionize data drives an editorial lineup: a
// heading row with the count and the two actions, then a uniform grid of
// portraits where each card says who the person is and what they will talk
// about (see SpeakersGrid / SpeakerCard). When the schedule is passed in, each
// talk also shows its time and room. Empty-state and CFP status logic kept.

import NextLink from "next/link";
import { SpeakersGrid } from "@/components/organisms/SpeakersGrid";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { IconBadge } from "@/components/atoms/IconBadge";
import { BTN_OUTLINE, WRAP } from "@/components/molecules/SectionPrimitives";
import type { ScheduleGrid, Speaker } from "@/lib/api/sessionize";
import type { EventInfo } from "@/lib/content/event-info";

type SpeakersTemplateProps = {
  speakers: Speaker[];
  eventInfo: EventInfo;
  basePath?: string;
  /** Published schedule, to show each talk's time and room. Optional. */
  grid?: ScheduleGrid;
};

const TEXT_LINK =
  "inline-flex min-h-[var(--size-touch)] items-center text-step-0 font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-national-red)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]";

export function SpeakersTemplate({
  speakers,
  eventInfo,
  basePath = "/speakers",
  grid,
}: SpeakersTemplateProps) {
  const cfpOpen = eventInfo.cfpStatus === "open";
  const cfpHref = cfpOpen ? "/cfp" : `mailto:${eventInfo.contactEmail}`;

  return (
    <>
      <section id="contenido-principal">
        <div
          className={`${WRAP} flex flex-wrap items-end justify-between gap-x-10 gap-y-4 py-[clamp(1rem,3.5svh,2rem)]`}
        >
          <div className="min-w-0">
            <h1 className="m-0 font-display text-step-2 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
              Speakers
            </h1>
            {speakers.length > 0 ? (
              <p className="m-0 mt-2 flex items-center gap-2 text-step-0 text-[var(--color-text-secondary)]">
                <GlyphIcon name="mic" size={20} />
                {speakers.length}{" "}
                {speakers.length === 1
                  ? "persona confirmada"
                  : "personas confirmadas"}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <NextLink href="/schedule" className={BTN_OUTLINE}>
              <GlyphIcon name="calendar" size={18} />
              Ver la agenda
            </NextLink>
            <NextLink href="/cfp" className={BTN_OUTLINE}>
              <GlyphIcon name="send" size={18} />
              Proponer una charla
            </NextLink>
          </div>
        </div>
      </section>

      <section className="">
        <div className={`${WRAP} pb-16 pt-4`}>
          {speakers.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
              <div className="flex min-w-0 max-w-[36rem] items-start gap-4">
                <IconBadge name="mic" size="lg" />
                <div>
                  <h2 className="m-0 mb-2 font-display text-step-2 leading-[1.1]">
                    Pronto anunciamos a los speakers
                  </h2>
                  <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
                    Estamos definiendo la lista de oradores. Si querés
                    participar, enviá tu propuesta desde la convocatoria de
                    charlas.
                  </p>
                </div>
              </div>
              <a href={cfpHref} className={TEXT_LINK}>
                {cfpOpen ? "Enviar mi charla" : "Escribirnos"}
              </a>
            </div>
          ) : (
            <>
              <SpeakersGrid
                speakers={speakers}
                eventInfo={eventInfo}
                basePath={basePath}
                grid={grid}
              />
              <div className="mt-16 flex flex-wrap items-center justify-between gap-6 rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-6 sm:p-8">
                <div className="flex min-w-0 max-w-[36rem] items-start gap-4">
                  <IconBadge name="bulb" tone="solid" />
                  <div>
                    <h2 className="m-0 mb-2 font-display text-step-2 leading-[1.1]">
                      ¿Querés estar en esta lista?
                    </h2>
                    <p className="m-0 text-step-0 text-[var(--color-text-secondary)]">
                      {cfpOpen
                        ? "La convocatoria de charlas sigue abierta. Enviá tu propuesta y sumate."
                        : "La convocatoria de charlas está cerrada por ahora. Escribinos si querés participar en próximas ediciones."}
                    </p>
                  </div>
                </div>
                <a href={cfpHref} className={TEXT_LINK}>
                  {cfpOpen ? "Enviar mi propuesta" : "Escribirnos"}
                </a>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
