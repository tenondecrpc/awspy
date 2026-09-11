// Hero block on the home page, styled after the light "Home Light" mockup.
// Server component; consumes the validated EventInfo.
//
// Layout: a light panel with two columns from `lg` up — the pitch, the
// practical details, the CTAs and the live countdown on the left; an image
// panel with a navy date badge on the right. Below `lg` it stacks.
//
// The countdown is kept live (it is the AWS Community Day family's signature)
// and the CTAs preserve the register/CFP/contact fallbacks from the previous
// hero, so no functionality is lost in the restyle. The decorative skyline and
// dot-grid from the old dark hero are intentionally dropped: the mockup's
// light hero is clean, and both were purely decorative.

import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Button } from "@/components/atoms/Button";
import { Placeholder } from "@/components/atoms/Placeholder";
import { Countdown } from "@/components/organisms/Countdown";
import { cn } from "@/lib/utils/cn";
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-[var(--color-border-subtle)] px-0 py-3.5 sm:px-4 sm:[&:not(:first-child)]:border-l">
      <dt className="mb-1 font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
        {label}
      </dt>
      <dd className="m-0 text-[15px] font-semibold text-[var(--color-text-primary)] first-letter:uppercase">
        {value}
      </dd>
    </div>
  );
}

export function Hero({
  eventInfo,
  registerHref = "/register",
  cfpHref = "/cfp",
}: HeroProps) {
  const dateLabel = formatDate(eventInfo.dates.start);
  const timeLabel = formatTimeRange(eventInfo.dates.start, eventInfo.dates.end);
  const isOpen = eventInfo.registrationStatus === "open";
  const showRegistrationCta = eventInfo.registrationStatus !== "closed";
  const showCfpCta = eventInfo.cfpStatus === "open";

  return (
    <Section
      spacing="lg"
      tone="muted"
      id="contenido-principal"
      className="border-b border-[var(--color-text-primary)]"
    >
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="flex min-w-0 flex-col items-start">
            {/* Eyebrow row: edition marker + live registration status. */}
            <div className="mb-6 flex w-full items-center gap-3">
              <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
                Primera edición
              </span>
              <span
                aria-hidden="true"
                className="h-px flex-1 bg-[var(--color-border-subtle)]"
              />
              <span
                className={cn(
                  "inline-flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.1em]",
                  isOpen
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-text-secondary)]"
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    isOpen
                      ? "bg-[var(--color-success)]"
                      : "bg-[var(--color-text-muted)]"
                  )}
                />
                {STATUS_COPY[eventInfo.registrationStatus]}
              </span>
            </div>

            <Heading
              level={1}
              className="leading-[0.94] tracking-[-0.045em] text-[var(--color-text-primary)]"
            >
              AWS
              <br />
              Community&nbsp;Day
              <br />
              <span className="text-[var(--color-action)]">Paraguay</span>
            </Heading>

            <p className="mt-6 max-w-[34rem] text-lg text-[var(--color-text-secondary)]">
              {eventInfo.heroSubtitle}
            </p>

            <dl className="mt-8 grid w-full grid-cols-2 border-t border-[var(--color-text-primary)] sm:grid-cols-4">
              <Detail label="Fecha" value={dateLabel} />
              <Detail label="Horario" value={timeLabel} />
              <Detail label="Sede" value={eventInfo.location.summary} />
              <Detail label="Entrada" value="Gratuita" />
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              {showRegistrationCta ? (
                <Button as="a" href={registerHref} variant="primary" size="lg">
                  {isOpen ? "Registrarme gratis" : "Avisame del registro"}
                </Button>
              ) : null}
              {showCfpCta ? (
                <Button
                  as="a"
                  href={cfpHref}
                  variant="ghost"
                  size="lg"
                  className="border-2 border-[var(--color-text-primary)]"
                >
                  Proponer una charla
                </Button>
              ) : null}
              {!showRegistrationCta && !showCfpCta ? (
                <Button
                  as="a"
                  href={`mailto:${eventInfo.contactEmail}`}
                  variant="ghost"
                  size="lg"
                  className="border-2 border-[var(--color-text-primary)]"
                >
                  Escribirnos
                </Button>
              ) : null}
              <Countdown
                targetDate={eventInfo.dates.start}
                variant="inline"
              />
            </div>
          </div>

          {/* Image panel with a navy date badge (decorative until a real photo
              is dropped in; see public-assets contract). */}
          <div className="relative min-w-0">
            <Placeholder
              kind="cover"
              aspectRatio={4 / 5}
              label="Foto de la comunidad"
              className="h-full"
            />
            <span className="absolute bottom-0 left-0 bg-[var(--color-surface-inverse)] px-5 py-3 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-text-on-inverse)]">
              {dateLabel} — {eventInfo.location.summary}
            </span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
