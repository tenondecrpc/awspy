// Home page template. Composes Hero, Countdown, About, and placeholder
// preview slots for speakers and sponsors. The page-level component is
// responsible for fetching Sessionize/EventInfo and passing it down.

import NextLink from "next/link";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Hero } from "@/components/organisms/Hero";
import { Countdown } from "@/components/organisms/Countdown";
import { EmptyState } from "@/components/organisms/EmptyState";
import { SpeakerCard } from "@/components/molecules/SpeakerCard";
import { SponsorsBoard } from "@/components/organisms/SponsorsBoard";
import type { EventInfo } from "@/lib/content/event-info";
import type { Sponsor } from "@/lib/content/sponsors";
import type { Speaker } from "@/lib/api/sessionize";

type HomeTemplateProps = {
  eventInfo: EventInfo;
  /** Speakers preview slot. Empty array renders the empty state. */
  speakersPreview: Speaker[];
  /** Sponsors preview slot. Empty array renders the empty state. */
  sponsorsPreview: Sponsor[];
  /** When true (past editions), CTAs point at the archived register/cfp. */
  registerHref?: string;
  cfpHref?: string;
};

export function HomeTemplate({
  eventInfo,
  speakersPreview,
  sponsorsPreview,
  registerHref,
  cfpHref,
}: HomeTemplateProps) {
  return (
    <>
      <Hero
        eventInfo={eventInfo}
        registerHref={registerHref}
        cfpHref={cfpHref}
      />

      <Section spacing="md" tone="default">
        <Container>
          <div className="flex flex-col items-center gap-6">
            <Heading level={2} visualLevel={3} accent>
              Cuenta regresiva
            </Heading>
            <Countdown targetDate={eventInfo.dates.start} />
          </div>
        </Container>
      </Section>

      <Section
        spacing="md"
        tone="muted"
        aria-labelledby="about-title"
        eyebrow="Sobre el evento"
      >
        <Container>
          <div className="mx-auto max-w-3xl space-y-4 text-center">
            <Heading id="about-title" level={2} className="text-balance">
              ¿Qué es el Community Day?
            </Heading>
            <p className="text-[var(--color-text-secondary)]">
              El AWS Community Day Paraguay es una jornada gratuita organizada
              por la comunidad local. Reunimos charlas técnicas, talleres y
              espacios de networking enfocados en servicios y prácticas de
              Amazon Web Services. Es un evento de la comunidad, para la
              comunidad.
            </p>
            <p className="text-[var(--color-text-secondary)]">
              Esta es la primera edición en Paraguay. Si querés colaborar como
              sponsor o presentar una charla, escribinos a{" "}
              <a
                href={`mailto:${eventInfo.contactEmail}`}
                className="text-[var(--color-accent)] underline-offset-2 hover:underline"
              >
                {eventInfo.contactEmail}
              </a>
              .
            </p>
          </div>
        </Container>
      </Section>

      <Section
        spacing="md"
        tone="default"
        aria-labelledby="speakers-preview-title"
        eyebrow="Speakers"
      >
        <Container>
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <Heading id="speakers-preview-title" level={2} accent>
              Conocé a los speakers
            </Heading>
            <NextLink
              href="/speakers"
              className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
            >
              Ver todos
            </NextLink>
          </div>
          {speakersPreview.length === 0 ? (
            <EmptyState
              title="Pronto anunciamos a los speakers"
              description="Estamos definiendo la grilla de oradores. Volvé pronto para conocer al elenco."
              headingLevel={3}
              variant="speakers"
            />
          ) : (
            <ul
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              aria-label="Vista previa de speakers"
            >
              {speakersPreview.slice(0, 6).map((s) => (
                <li key={s.id}>
                  <SpeakerCard speaker={s} />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section
        spacing="md"
        tone="muted"
        aria-labelledby="sponsors-preview-title"
        eyebrow="Sponsors"
      >
        <Container>
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <Heading id="sponsors-preview-title" level={2} accent>
              Quienes hacen posible el evento
            </Heading>
            <NextLink
              href="/sponsors"
              className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
            >
              Ver todos
            </NextLink>
          </div>
          {sponsorsPreview.length === 0 ? (
            <EmptyState
              title="Sumate como sponsor"
              description="Aún no hay sponsors confirmados. Escribinos para auspiciar el primer Community Day en Paraguay."
              actionHref={`mailto:${eventInfo.contactEmail}?subject=Sponsor%20AWS%20Community%20Day%20Paraguay`}
              actionLabel="Quiero ser sponsor"
              headingLevel={3}
              variant="sponsors"
            />
          ) : (
            <SponsorsBoard
              sponsors={sponsorsPreview}
              eventInfo={eventInfo}
              variant="compact"
            />
          )}
        </Container>
      </Section>
    </>
  );
}
