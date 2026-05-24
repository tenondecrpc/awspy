// Sessionize CFP callout. Displays the CFP description, the deadline (when
// known), and a primary CTA that points at the public Sessionize submission
// URL. Adapts to the three CFP states: open / upcoming / closed.

import { Badge } from "@/components/atoms/Badge";
import { Button } from "@/components/atoms/Button";
import { formatDate } from "@/lib/utils/datetime";
import type { EventInfo } from "@/lib/content/event-info";

type SessionizeCFPCalloutProps = {
  eventInfo: EventInfo;
};

const STATUS_COPY: Record<EventInfo["cfpStatus"], string> = {
  open: "CFP abierto",
  upcoming: "CFP próximamente",
  closed: "CFP cerrado",
};

export function SessionizeCFPCallout({ eventInfo }: SessionizeCFPCalloutProps) {
  const { cfpStatus, cfpDeadline, cfpSubmissionUrl, contactEmail } = eventInfo;
  const isOpen = cfpStatus === "open" && Boolean(cfpSubmissionUrl);

  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] p-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge
          variant={
            cfpStatus === "open"
              ? "info"
              : cfpStatus === "closed"
                ? "neutral"
                : "warning"
          }
        >
          {STATUS_COPY[cfpStatus]}
        </Badge>
        {cfpDeadline ? (
          <p className="text-sm text-[var(--color-text-secondary)]">
            {cfpStatus === "closed" ? "Cerró el " : "Hasta "}
            {formatDate(cfpDeadline)}
          </p>
        ) : null}
      </div>

      {cfpStatus === "open" ? (
        <p className="text-[var(--color-text-primary)]">
          Estamos recibiendo propuestas de charlas, talleres y lightning talks.
          Las charlas son en español. Animate a presentar la tuya.
        </p>
      ) : cfpStatus === "upcoming" ? (
        <p className="text-[var(--color-text-primary)]">
          Pronto vamos a abrir el call for papers. Si querés que te avisemos
          cuando podés enviar tu propuesta, escribinos.
        </p>
      ) : (
        <p className="text-[var(--color-text-primary)]">
          El call for papers para esta edición ya está cerrado. Pronto vamos a
          publicar a los oradores seleccionados.
        </p>
      )}

      <div>
        {isOpen && cfpSubmissionUrl ? (
          <Button
            as="a"
            href={cfpSubmissionUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
          >
            Enviar propuesta en Sessionize
          </Button>
        ) : cfpStatus === "upcoming" ? (
          <Button
            as="a"
            href={`mailto:${contactEmail}?subject=Avisame%20cuando%20abra%20el%20CFP`}
            variant="secondary"
            size="md"
          >
            Avisame del CFP
          </Button>
        ) : (
          <Button
            as="a"
            href="/speakers"
            variant="secondary"
            size="md"
          >
            Ver speakers confirmados
          </Button>
        )}
      </div>
    </div>
  );
}
