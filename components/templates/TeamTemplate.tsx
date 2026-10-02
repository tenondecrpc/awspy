// Team page: who is behind the event. A responsive grid of person cards, an
// empty state when there are none yet, and one compact strip inviting
// visitors to volunteer.

import NextLink from "next/link";
import { OrganizersGrid } from "@/components/organisms/OrganizersGrid";
import {
  BTN_OUTLINE,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import type { Organizer } from "@/lib/content/organizers";
import type { EventInfo } from "@/lib/content/event-info";

type TeamTemplateProps = {
  organizers: Organizer[];
  eventInfo: EventInfo;
  volunteersHref?: string;
};

export function TeamTemplate({
  organizers,
  eventInfo,
  volunteersHref = "/volunteers",
}: TeamTemplateProps) {
  return (
    <>
      <section id="contenido-principal">
        <div className={`${WRAP} pb-8 pt-[clamp(1.5rem,5svh,3.5rem)]`}>
          <h1 className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
            Equipo organizador
          </h1>
          <p className="m-0 mt-3 max-w-[36rem] text-step-0 leading-[1.5] text-[var(--color-text-secondary)]">
            Las personas que arman cada edición del Community Day en Paraguay.
          </p>
        </div>
      </section>

      <section>
        <div className={`${WRAP} pb-[var(--space-section-y)]`}>
          <OrganizersGrid
            organizers={organizers}
            eventInfo={eventInfo}
            volunteersHref={volunteersHref}
          />
        </div>
      </section>

      <section className="bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]">
        <div
          className={`${WRAP} flex flex-wrap items-center justify-between gap-x-10 gap-y-5 py-10`}
        >
          <div className="min-w-0 max-w-[36rem]">
            <h2 className="m-0 mb-2 font-display text-step-2 leading-[1.1] text-[var(--color-text-primary)]">
              Sumate al equipo
            </h2>
            <p className="m-0 text-step-0 leading-[1.5] text-[var(--color-text-secondary)]">
              Acreditación, apoyo a speakers, armado de salas, contenido para
              redes. No hace falta experiencia previa, solo ganas de dar una
              mano.
            </p>
          </div>
          <NextLink href={volunteersHref} className={BTN_OUTLINE}>
            Quiero ser voluntario/a
          </NextLink>
        </div>
      </section>
    </>
  );
}
