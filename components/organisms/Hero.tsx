// Hero block on the home page. Server component; consumes the validated
// EventInfo.
//
// Layout: two columns from `lg` up - the pitch, the practical details, the
// countdown and the CTAs on the left; a decorative edition mark on the right.
// Below `lg` it collapses to a single column and the decorative mark is
// dropped so the primary CTA stays close to the fold.
//
// The countdown lives here rather than in its own band so a visitor gets the
// date, the place and the time remaining in one glance, the way the rest of
// the AWS Community Day family presents it.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { DecorativePattern } from "@/components/atoms/DecorativePattern";
import { Countdown } from "@/components/organisms/Countdown";
import type { EventInfo } from "@/lib/content/event-info";
import { formatDate, formatTimeRange } from "@/lib/utils/datetime";

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

function EventDetail({
  glyph,
  children,
}: {
  glyph: GlyphName;
  children: string;
}) {
  return (
    <li className="flex items-center gap-3 text-[var(--color-text-on-hero)]">
      <GlyphIcon
        name={glyph}
        size={22}
        className="text-[var(--color-national-red-on-dark)]"
      />
      <span className="text-sm font-medium first-letter:uppercase sm:text-base">
        {children}
      </span>
    </li>
  );
}

export function Hero({
  eventInfo,
  registerHref = "/register",
  cfpHref = "/cfp",
}: HeroProps) {
  const dateLabel = formatDate(eventInfo.dates.start);
  const timeLabel = formatTimeRange(eventInfo.dates.start, eventInfo.dates.end);
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
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="flex flex-col items-start gap-6">
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

            <p className="max-w-[40rem] text-lg text-[var(--color-text-on-hero)] opacity-90">
              {eventInfo.heroSubtitle}
            </p>

            <ul className="flex flex-col gap-2">
              <EventDetail glyph="calendar">{dateLabel}</EventDetail>
              <EventDetail glyph="clock">{timeLabel}</EventDetail>
              <EventDetail glyph="pin">
                {eventInfo.location.summary}
              </EventDetail>
            </ul>

            <div className="flex w-full flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-text-on-hero)] opacity-70">
                Faltan
              </p>
              <Countdown targetDate={eventInfo.dates.start} tone="hero" />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {showRegistrationCta ? (
                <Button
                  as="a"
                  href={registerHref}
                  variant="primary"
                  size="lg"
                  shape="pill"
                >
                  {eventInfo.registrationStatus === "open"
                    ? "Registrarme"
                    : "Avisame del registro"}
                </Button>
              ) : null}
              {showCfpCta ? (
                <Button
                  as="a"
                  href={cfpHref}
                  variant="outline-on-dark"
                  size="lg"
                  shape="pill"
                >
                  Enviar mi charla
                </Button>
              ) : null}
              {!showRegistrationCta && !showCfpCta ? (
                <Button
                  as="a"
                  href={`mailto:${eventInfo.contactEmail}`}
                  variant="outline-on-dark"
                  size="lg"
                  shape="pill"
                >
                  Escribirnos
                </Button>
              ) : null}
            </div>
          </div>

          {/* Decorative edition mark. It restates the h1, so it is hidden from
              assistive technology and from small screens. */}
          <div aria-hidden="true" className="hidden lg:flex lg:justify-center">
            <div className="glass-panel flex aspect-square w-full max-w-[21rem] flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] p-8 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.28em] text-[var(--color-text-on-hero)] opacity-70">
                AWS Community Day
              </span>
              <span className="text-7xl font-bold leading-none text-[var(--color-text-on-hero)]">
                {eventInfo.year}
              </span>
              <span className="h-1 w-16 rounded-[var(--radius-pill)] bg-[var(--color-national-red)]" />
              <span className="text-2xl font-semibold text-[var(--color-text-on-hero)]">
                {eventInfo.location.country}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
