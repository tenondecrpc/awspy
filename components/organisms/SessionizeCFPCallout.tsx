// Sessionize CFP callout. The deadline is the hero fact: the days left as one
// huge number on a navy panel, the full date, the status, and the single
// submission button. Adapts to the three CFP states: open / upcoming / closed.

import NextLink from "next/link";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import {
  BTN_OUTLINE,
  BTN_PRIMARY,
} from "@/components/molecules/SectionPrimitives";
import { Countdown } from "@/components/organisms/Countdown";
import { formatDate } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";

type SessionizeCFPCalloutProps = {
  eventInfo: EventInfo;
};

const STATUS_COPY: Record<EventInfo["cfpStatus"], string> = {
  open: "Convocatoria abierta",
  upcoming: "Convocatoria próximamente",
  closed: "Convocatoria cerrada",
};

export function SessionizeCFPCallout({ eventInfo }: SessionizeCFPCalloutProps) {
  const { cfpStatus, cfpDeadline, cfpSubmissionUrl, contactEmail } = eventInfo;
  const isOpen = cfpStatus === "open" && Boolean(cfpSubmissionUrl);
  const showCountdown = cfpStatus !== "closed" && Boolean(cfpDeadline);

  return (
    <div
      data-tone="inverse"
      className="flex h-full flex-col gap-6 bg-[var(--color-surface-elevated)] p-8 text-[var(--color-text-primary)]"
    >
      <p className="m-0 flex items-center gap-2.5 text-base font-semibold">
        <span
          aria-hidden="true"
          className={
            "size-2.5 flex-none " +
            (cfpStatus === "open"
              ? "bg-[var(--color-success)]"
              : "border-2 border-[var(--color-text-primary)]")
          }
        />
        {STATUS_COPY[cfpStatus]}
      </p>

      {cfpStatus === "open" ? (
        <p className="m-0 text-base text-[var(--color-text-secondary)]">
          Estamos recibiendo propuestas de charlas, talleres y lightning talks.
          Las charlas son en español. Animate a presentar la tuya.
        </p>
      ) : null}

      {cfpDeadline ? (
        <div>
          {showCountdown ? (
            <>
              <Countdown
                targetDate={cfpDeadline}
                variant="display"
                className="text-[var(--color-text-primary)]"
              />
              <p className="m-0 mt-3 text-step-0">
                para que cierre la convocatoria
              </p>
            </>
          ) : null}
          <p className="m-0 mt-3 flex items-center gap-2 text-base text-[var(--color-text-secondary)]">
            <GlyphIcon name="calendar" size={20} />
            <span>
              {cfpStatus === "closed" ? "Cerró el " : "Cierra el "}
              {formatDate(cfpDeadline)}
            </span>
          </p>
        </div>
      ) : null}

      {cfpStatus === "upcoming" ? (
        <p className="m-0 text-base text-[var(--color-text-secondary)]">
          Pronto vamos a abrir la convocatoria de charlas. Si querés que te
          avisemos cuando podés enviar tu propuesta, escribinos.
        </p>
      ) : cfpStatus === "closed" ? (
        <p className="m-0 text-base text-[var(--color-text-secondary)]">
          La convocatoria de charlas para esta edición ya está cerrada. Pronto
          vamos a publicar a los oradores seleccionados.
        </p>
      ) : null}

      <div className="mt-auto">
        {isOpen && cfpSubmissionUrl ? (
          <a
            href={cfpSubmissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_PRIMARY} w-full sm:w-auto`}
          >
            Enviar propuesta en Sessionize
            <GlyphIcon name="external" size={20} />
          </a>
        ) : cfpStatus === "upcoming" ? (
          <a
            href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20la%20convocatoria%20de%20charlas`}
            className={BTN_OUTLINE}
          >
            <GlyphIcon name="mail" size={20} />
            Avisame de la convocatoria
          </a>
        ) : (
          <NextLink href="/speakers" className={BTN_OUTLINE}>
            Ver speakers confirmados
          </NextLink>
        )}
      </div>
    </div>
  );
}
