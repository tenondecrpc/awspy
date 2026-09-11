// Home page template. Composes the hero, the expected-figures band, the
// "about" band with its feature cards, the speakers preview, the volunteering
// call to action, and the sponsors preview. The page-level component is
// responsible for fetching Sessionize/EventInfo and passing it down.
//
// Section order follows the AWS Community Day family: pitch -> what to expect
// -> what it is -> who speaks -> how to take part -> who makes it possible.
// Backgrounds alternate `surface` / `surface-muted` with one inverse band so
// the page reads as distinct blocks rather than one continuous column.
//
// The countdown is part of the hero, not a band of its own.

import NextLink from "next/link";
import { cn } from "@/lib/utils/cn";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { GlyphIcon, type GlyphName } from "@/components/atoms/GlyphIcon";
import { Button } from "@/components/atoms/Button";
import { DecorativePattern } from "@/components/atoms/DecorativePattern";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { StatTile } from "@/components/molecules/StatTile";
import { Hero } from "@/components/organisms/Hero";
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
  speakersHref?: string;
  sponsorsHref?: string;
  volunteersHref?: string;
};

/** Two full rows of the four-column grid. */
const SPEAKERS_PREVIEW_LIMIT = 8;

// One hue from the decorative ramp per card, assigned in fixed order. The
// hue only tells the cards apart; each one carries its own title, so nothing
// is lost if a reader cannot distinguish them.
type FeatureTone = "blue" | "violet" | "teal" | "amber";

// Written out rather than interpolated: Tailwind scans for literal class
// strings, so a template literal would produce no CSS.
const TILE_CLASS: Record<FeatureTone, string> = {
  blue: "bg-[var(--color-category-blue)]",
  violet: "bg-[var(--color-category-violet)]",
  teal: "bg-[var(--color-category-teal)]",
  amber: "bg-[var(--color-category-amber)]",
};

const FEATURES: {
  glyph: GlyphName;
  tone: FeatureTone;
  title: string;
  description: string;
}[] = [
  {
    glyph: "target",
    tone: "blue",
    title: "Objetivo",
    description:
      "Acercar la nube a más personas en Paraguay con contenido técnico gratuito y en español.",
  },
  {
    glyph: "users",
    tone: "violet",
    title: "Comunidad",
    description:
      "Un evento organizado por voluntarios y voluntarias del user group local, para la comunidad.",
  },
  {
    glyph: "book",
    tone: "teal",
    title: "Aprendizaje",
    description:
      "Charlas y talleres sobre servicios y buenas prácticas de Amazon Web Services.",
  },
  {
    glyph: "bolt",
    tone: "amber",
    title: "Innovación",
    description:
      "Casos reales, herramientas nuevas y espacios para intercambiar experiencias.",
  },
];

export function HomeTemplate({
  eventInfo,
  speakersPreview,
  sponsorsPreview,
  registerHref,
  cfpHref,
  speakersHref = "/speakers",
  sponsorsHref = "/sponsors",
  volunteersHref = "/volunteers",
}: HomeTemplateProps) {
  return (
    <>
      <Hero
        eventInfo={eventInfo}
        registerHref={registerHref}
        cfpHref={cfpHref}
      />

      {eventInfo.expectedFigures.length > 0 ? (
        <Section spacing="md" tone="default" aria-labelledby="figures-title">
          <Container>
            <h2
              id="figures-title"
              className="text-center text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-national-red-label)]"
            >
              Esperamos contar con
            </h2>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-7">
              {eventInfo.expectedFigures.map((figure) => (
                <li key={figure.label} className="h-full">
                  <StatTile
                    value={figure.value}
                    label={figure.label}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>

            <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
              Cifras proyectadas para esta primera edición, con asistentes de
              Paraguay y varios países.
            </p>
          </Container>
        </Section>
      ) : null}

      <Section spacing="lg" tone="muted" aria-labelledby="about-title">
        <Container>
          <SectionHeading
            id="about-title"
            level={2}
            eyebrow="Sobre el evento"
            title="¿Qué es el"
            highlight="Community Day?"
            tone="muted"
            description={
              <>
                El AWS Community Day Paraguay es una jornada gratuita organizada
                por la comunidad local. Reunimos charlas técnicas, talleres y
                espacios de networking enfocados en servicios y prácticas de
                Amazon Web Services. Es un evento de la comunidad, para la
                comunidad.
              </>
            }
          />

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <li
                key={feature.title}
                className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface)] p-6"
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)]",
                    "text-[var(--color-text-on-category)]",
                    TILE_CLASS[feature.tone]
                  )}
                >
                  <GlyphIcon name={feature.glyph} size={24} />
                </span>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-center text-[var(--color-text-secondary)]">
            Esta es la primera edición en Paraguay. Si querés colaborar como
            sponsor o presentar una charla, escribinos a{" "}
            <a
              href={`mailto:${eventInfo.contactEmail}`}
              className="font-semibold text-[var(--color-accent)] underline-offset-2 hover:underline"
            >
              {eventInfo.contactEmail}
            </a>
            .
          </p>
        </Container>
      </Section>

      <Section
        spacing="lg"
        tone="default"
        aria-labelledby="speakers-preview-title"
      >
        <Container>
          <SectionHeading
            id="speakers-preview-title"
            level={2}
            eyebrow="Speakers"
            eyebrowGlyph="mic"
            title="Conocé a los"
            highlight="speakers"
            description="Las personas que van a compartir su experiencia con la comunidad durante la jornada."
            className="mb-12"
          >
            <NextLink
              href={speakersHref}
              className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--color-accent)] px-5 py-2 text-sm font-bold text-[var(--color-accent)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:text-[var(--color-text-on-accent)]"
            >
              Ver todos
            </NextLink>
          </SectionHeading>

          {speakersPreview.length === 0 ? (
            <EmptyState
              title="Pronto anunciamos a los speakers"
              description="Estamos definiendo la grilla de oradores. Volvé pronto para conocer al elenco."
              headingLevel={3}
              variant="speakers"
            />
          ) : (
            <ul
              className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8"
              aria-label="Vista previa de speakers"
            >
              {speakersPreview.slice(0, SPEAKERS_PREVIEW_LIMIT).map((s, i) => (
                <li key={s.id} className="h-full">
                  <SpeakerCard
                    speaker={s}
                    basePath={speakersHref}
                    accentIndex={i}
                  />
                </li>
              ))}
            </ul>
          )}
        </Container>
      </Section>

      <Section spacing="lg" tone="inverse" aria-labelledby="volunteers-title">
        <DecorativePattern
          density="low"
          opacity={0.06}
          seed={`volunteers-${eventInfo.year}`}
        />
        <Container className="relative">
          <SectionHeading
            id="volunteers-title"
            level={2}
            eyebrow="Voluntariado"
            eyebrowGlyph="users"
            title="Sumate al equipo de"
            highlight="voluntariado"
            tone="inverse"
            description="Colaborá con la experiencia de speakers y asistentes antes y durante la jornada. No necesitás experiencia previa, solo ganas de ayudar."
          >
            <Button
              as="a"
              href={volunteersHref}
              variant="primary"
              size="lg"
              shape="pill"
            >
              Quiero ser voluntario/a
            </Button>
          </SectionHeading>
        </Container>
      </Section>

      <Section
        spacing="lg"
        tone="muted"
        aria-labelledby="sponsors-preview-title"
      >
        <Container>
          <SectionHeading
            id="sponsors-preview-title"
            level={2}
            eyebrow="Sponsors"
            title="Quienes hacen posible"
            highlight="el evento"
            tone="muted"
            description="Gracias a estas organizaciones la entrada al Community Day es gratuita."
            className="mb-12"
          >
            <NextLink
              href={sponsorsHref}
              className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--color-accent)] px-5 py-2 text-sm font-bold text-[var(--color-accent)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)] hover:text-[var(--color-text-on-accent)]"
            >
              Ver todos
            </NextLink>
          </SectionHeading>

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
