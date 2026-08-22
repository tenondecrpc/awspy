// Hero block on the home page. Server component; consumes the validated
// EventInfo. Provides primary and secondary CTAs over a Squid Ink surface
// with a low-opacity AWS Architecture Icons pattern in the background.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { DecorativePattern } from "@/components/atoms/DecorativePattern";
import type { EventInfo } from "@/lib/content/event-info";
import { formatDate } from "@/lib/utils/datetime";

type HeroProps = {
  eventInfo: EventInfo;
  /** Optional override for the path of the register CTA (used by past
   *  editions to point at the archived /editions/{year}/register). */
  registerHref?: string;
  cfpHref?: string;
};

const STATUS_COPY: Record<EventInfo["registrationStatus"], string> = {
  open: "Registro abierto",
  upcoming: "Registro próximamente",
  closed: "Registro cerrado",
};

export function Hero({
  eventInfo,
  registerHref = "/register",
  cfpHref = "/cfp",
}: HeroProps) {
  const dateLabel = formatDate(eventInfo.dates.start);
  const showRegistrationCta = eventInfo.registrationStatus !== "closed";
  const showCfpCta = eventInfo.cfpStatus === "open";

  return (
    <Section spacing="lg" tone="hero" id="contenido-principal">
      <DecorativePattern
        density="medium"
        opacity={0.08}
        seed={`hero-${eventInfo.year}`}
      />
      <Container className="relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
          <Badge
            variant={
              eventInfo.registrationStatus === "open" ? "info" : "neutral"
            }
          >
            {STATUS_COPY[eventInfo.registrationStatus]}
          </Badge>
          <Heading level={1} className="text-balance">
            {eventInfo.heroTitle}
          </Heading>
          <p className="text-lg text-[var(--color-text-on-hero)] opacity-90">
            {eventInfo.heroSubtitle}
          </p>
          <p className="text-sm font-semibold text-[var(--color-text-on-hero)]">
            {dateLabel}
            {" - "}
            {eventInfo.location.summary}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {showRegistrationCta ? (
              <Button as="a" href={registerHref} variant="primary" size="lg">
                {eventInfo.registrationStatus === "open"
                  ? "Registrarme"
                  : "Avisame del registro"}
              </Button>
            ) : null}
            {showCfpCta ? (
              <Button as="a" href={cfpHref} variant="outline-on-dark" size="lg">
                Enviar mi charla
              </Button>
            ) : null}
            {!showRegistrationCta && !showCfpCta ? (
              <Button
                as="a"
                href={`mailto:${eventInfo.contactEmail}`}
                variant="outline-on-dark"
                size="lg"
              >
                Escribirnos
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
