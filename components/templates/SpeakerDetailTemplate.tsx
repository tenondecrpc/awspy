// Speaker detail page: who this person is (square portrait, name, tagline,
// social links) and when to see them ("Sus charlas" as cards linking to the
// agenda), closed by the registration button. Real Sessionize data drives it;
// the Person + Breadcrumb JSON-LD and every empty-state branch are preserved.
// The session list carries no room name (only a room id), so the cards show
// date, time and duration.

import Image from "next/image";
import NextLink from "next/link";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import {
  BTN_PRIMARY,
  H2,
  WRAP,
} from "@/components/molecules/SectionPrimitives";
import {
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  serializeJsonLd,
} from "@/lib/utils/seo";
import { formatDate, formatTime } from "@/lib/utils/datetime";
import type { Speaker, SessionizeSession } from "@/lib/api/sessionize";

type SpeakerDetailTemplateProps = {
  speaker: Speaker;
  sessions: SessionizeSession[];
  /** Path that the "Volver" CTA points at. */
  backPath?: string;
  /** Used as the canonical URL for JSON-LD. */
  detailPath: string;
};

export function SpeakerDetailTemplate({
  speaker,
  sessions,
  backPath = "/speakers",
  detailPath,
}: SpeakerDetailTemplateProps) {
  const personLd = buildPersonJsonLd({
    name: speaker.fullName,
    path: detailPath,
    jobTitle: speaker.tagLine ?? undefined,
    description: speaker.bio ?? undefined,
    image: speaker.profilePicture ?? undefined,
    sameAs: speaker.links?.map((l) => l.url),
  });

  const breadcrumbLd = buildBreadcrumbJsonLd([
    { name: "Inicio", path: "/" },
    { name: "Speakers", path: backPath },
    { name: speaker.fullName, path: detailPath },
  ]);

  // Sessionize's `Sessions` view returns every session; join client-side by
  // speaker id to keep only the ones this person is presenting.
  const ownSessions = sessions.filter((s) =>
    s.speakers?.some((sp) => sp.id === speaker.id)
  );
  const hasTimes = ownSessions.some((s) => s.startsAt && s.endsAt);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
      />

      <div id="contenido-principal" className={`${WRAP} pb-16`}>
        <nav
          aria-label="Ruta de navegación"
          className="mb-3 flex flex-wrap items-center gap-2 text-step--1 text-[var(--color-text-secondary)]"
        >
          <NextLink href="/" className="underline underline-offset-4">
            Inicio
          </NextLink>
          <span aria-hidden="true">/</span>
          <NextLink href={backPath} className="underline underline-offset-4">
            Speakers
          </NextLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{speaker.fullName}</span>
        </nav>
        <NextLink
          href={backPath}
          className="inline-flex min-h-[var(--size-touch)] items-center gap-2 text-step--1 font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-border-subtle)] decoration-2 underline-offset-4 hover:decoration-[var(--color-text-primary)]"
        >
          <span className="rotate-180">
            <GlyphIcon name="arrow-right" size={18} />
          </span>
          Volver a todos los speakers
        </NextLink>

        <div className="mt-4 grid gap-x-12 gap-y-8 lg:[grid-template-columns:minmax(0,22rem)_minmax(0,1fr)]">
          <div className="min-w-0">
            <div className="relative aspect-square w-full max-w-[22rem] overflow-hidden bg-[var(--color-surface-muted)]">
              {speaker.profilePicture ? (
                <Image
                  src={speaker.profilePicture}
                  alt={`Retrato de ${speaker.fullName}`}
                  fill
                  preload
                  sizes="(min-width: 1024px) 352px, 90vw"
                  className="object-cover object-[50%_20%]"
                />
              ) : (
                <div
                  role="img"
                  aria-label={`Retrato de ${speaker.fullName}`}
                  className="flex h-full w-full items-center justify-center font-display text-step-4 text-[var(--color-text-secondary)]"
                >
                  {speaker.fullName.slice(0, 1)}
                </div>
              )}
            </div>

            <div className="mt-5">
              {speaker.isTopSpeaker ? (
                <p className="m-0 mb-2 text-step--1 font-semibold text-[var(--color-national-red-label)]">
                  Top speaker
                </p>
              ) : null}
              <h1 className="m-0 font-display text-step-3 leading-[1.05] tracking-[-0.015em] text-[var(--color-text-primary)]">
                {speaker.fullName}
              </h1>
              {speaker.tagLine ? (
                <p className="m-0 mt-2 text-step-0 leading-[1.4] text-[var(--color-text-secondary)]">
                  {speaker.tagLine}
                </p>
              ) : null}
              {speaker.links && speaker.links.length > 0 ? (
                <ul className="m-0 mt-3 flex list-none flex-col p-0">
                  {speaker.links.map((l) => (
                    <li key={l.url}>
                      <a
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[var(--size-touch)] items-center gap-2 text-step--1 font-semibold text-[var(--color-text-primary)] hover:underline"
                      >
                        <GlyphIcon name="external" size={18} />
                        {l.title || l.linkType}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="min-w-0 lg:pt-1">
            {speaker.bio ? (
              <p className="m-0 max-w-[40rem] whitespace-pre-line text-step-0 leading-[1.65] text-[var(--color-text-secondary)]">
                {speaker.bio}
              </p>
            ) : null}

            <h2 className={`${H2} mb-4 mt-10 flex items-center gap-3`}>
              <GlyphIcon name="mic" size={26} />
              Sus charlas
            </h2>
            {ownSessions.length === 0 ? (
              <p className="m-0 max-w-[40rem] text-step-0 text-[var(--color-text-secondary)]">
                Todavía no hay sesiones publicadas para este speaker. Volvé
                pronto: la grilla se completa a medida que se confirma la
                agenda.
              </p>
            ) : (
              <ul className="m-0 grid list-none gap-3 p-0">
                {ownSessions.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-4 sm:p-5"
                  >
                    <p className="m-0 flex flex-wrap gap-x-4 gap-y-1 text-step--1 font-semibold text-[var(--color-text-primary)]">
                      {s.startsAt && s.endsAt ? (
                        <>
                          <span className="inline-flex items-center gap-1.5">
                            <GlyphIcon name="calendar" size={16} />
                            <span className="first-letter:uppercase">
                              {formatDate(s.startsAt)}
                            </span>
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <GlyphIcon name="clock" size={16} />
                            {formatTime(s.startsAt)} - {formatTime(s.endsAt)}
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <GlyphIcon name="clock" size={16} />
                          Horario por confirmar
                        </span>
                      )}
                    </p>
                    <h3 className="m-0 text-step-1 leading-[1.25]">
                      {s.title}
                    </h3>
                    {s.description ? (
                      <details>
                        <summary className="inline-flex min-h-[var(--size-touch)] cursor-pointer items-center text-step--1 font-semibold underline decoration-[var(--color-border-subtle)] decoration-2 underline-offset-4">
                          Ver descripción
                        </summary>
                        <p className="m-0 whitespace-pre-line break-words text-step--1 leading-[1.55] text-[var(--color-text-secondary)]">
                          {s.description}
                        </p>
                      </details>
                    ) : null}
                    <NextLink
                      href="/schedule"
                      className="inline-flex min-h-[var(--size-touch)] items-center gap-2 self-start text-step--1 font-semibold text-[var(--color-text-primary)] hover:underline"
                    >
                      Ver en la agenda
                      <GlyphIcon name="arrow-right" size={18} />
                    </NextLink>
                  </li>
                ))}
              </ul>
            )}
            {hasTimes ? (
              <p className="m-0 mt-4 flex items-center gap-2 text-step--1 text-[var(--color-text-secondary)]">
                <GlyphIcon name="info" size={18} />
                Los horarios están sujetos a cambios.
              </p>
            ) : null}

            <div className="mt-10">
              <NextLink href="/register" className={BTN_PRIMARY}>
                Registrarme gratis
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
