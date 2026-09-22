// Speaker detail page, rebuilt from scratch to reproduce the "Speaker" mockup
// (`AWS Community Day Paraguay (colored)/Speaker.dc.html`) 1:1 — breadcrumb
// band, a split portrait/identity hero, a numbered sessions list, and the
// closing "volver / registrarme" bar. Real Sessionize data drives the hero and
// the sessions; the Person + Breadcrumb JSON-LD and every empty-state branch
// are preserved.

import NextLink from "next/link";
import {
  NumberHeading,
  Frame,
  WRAP,
  SECTION_BORDER,
} from "@/components/molecules/SectionPrimitives";
import {
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  serializeJsonLd,
} from "@/lib/utils/seo";
import { formatTimeRange } from "@/lib/utils/datetime";
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

      {/* ── Breadcrumb ───────────────────────────────────────── */}
      <section className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]">
        <div className={`${WRAP} py-3.5`}>
          <nav
            aria-label="Migas"
            className="flex items-center gap-2 font-mono text-[11.5px] text-[var(--color-text-muted)]"
          >
            <NextLink
              href="/"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              Inicio
            </NextLink>
            <span aria-hidden="true">/</span>
            <NextLink
              href={backPath}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
            >
              Speakers
            </NextLink>
            <span aria-hidden="true">/</span>
            <span className="text-[var(--color-text-primary)]">
              {speaker.fullName}
            </span>
          </nav>
        </div>
      </section>

      {/* ── Identity hero ────────────────────────────────────── */}
      <section
        id="contenido-principal"
        className={`${SECTION_BORDER} bg-[var(--color-surface)]`}
      >
        <div className={WRAP}>
          <div className="grid items-stretch [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))]">
            <div className="relative min-h-[460px] min-w-0 border-b border-[var(--color-border-subtle)] lg:border-b-0 lg:border-r">
              <Frame
                label={`Retrato de ${speaker.fullName}`}
                photo={speaker.profilePicture ?? undefined}
                className="h-full w-full"
                // Sessionize serves square portraits, so the 460px min-height
                // sets the cover-rendered width on a phone and the column
                // width sets it above that.
                sizes="(min-width: 700px) 620px, 480px"
                preload
              />
            </div>

            <div className="flex min-w-0 flex-col justify-center py-[52px] lg:pl-12">
              {speaker.isTopSpeaker ? (
                <div className="mb-4 flex flex-wrap gap-2.5">
                  <span className="rounded-[3px] bg-[var(--color-surface-inverse)] px-[9px] py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-text-on-inverse)]">
                    Top speaker
                  </span>
                </div>
              ) : null}

              <h1 className="m-0 mb-2.5 text-[clamp(34px,4.6vw,54px)] font-extrabold leading-none tracking-[-0.04em] text-[var(--color-text-primary)]">
                {speaker.fullName}
              </h1>

              {speaker.tagLine ? (
                <p className="m-0 mb-[26px] text-[18px] font-semibold text-[var(--color-accent)]">
                  {speaker.tagLine}
                </p>
              ) : null}

              {speaker.bio ? (
                <p className="m-0 mb-7 max-w-[34rem] text-[16px] leading-[1.65] text-[var(--color-text-secondary)]">
                  {speaker.bio}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2.5">
                {speaker.links?.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-[4px] border-[1.5px] border-[var(--color-text-primary)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-primary)] transition-colors hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]"
                  >
                    {l.title || l.linkType}
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
                <NextLink
                  href="/schedule"
                  className="inline-flex items-center rounded-[4px] border-[1.5px] border-[var(--color-border-subtle)] px-[22px] py-[11px] text-[14.5px] font-semibold text-[var(--color-text-secondary)] transition-colors hover:border-[var(--color-text-primary)] hover:text-[var(--color-text-primary)]"
                >
                  Ver en la agenda
                </NextLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sessions ─────────────────────────────────────────── */}
      <section className={`${SECTION_BORDER} bg-[var(--color-surface)]`}>
        <div className={`${WRAP} py-[52px]`}>
          <NumberHeading n="01" title="Sesiones" />
          {ownSessions.length === 0 ? (
            <p className="m-0 text-[15px] text-[var(--color-text-secondary)]">
              Todavía no hay sesiones publicadas para este speaker. Volvé
              pronto: la grilla se completa a medida que se confirma la agenda.
            </p>
          ) : (
            <div className="border-t border-[var(--color-text-primary)]">
              {ownSessions.map((s) => (
                <div
                  key={s.id}
                  className="grid items-baseline gap-[18px] border-b border-[var(--color-border-subtle)] px-1 py-[18px] [grid-template-columns:minmax(110px,130px)_minmax(0,1fr)]"
                >
                  <span className="font-mono text-[14px] text-[var(--color-text-primary)]">
                    {s.startsAt && s.endsAt
                      ? formatTimeRange(s.startsAt, s.endsAt)
                      : "Por confirmar"}
                  </span>
                  <div className="min-w-0">
                    <h3 className="m-0 mb-1 text-[17px] font-bold tracking-[-0.018em]">
                      {s.title}
                    </h3>
                    {s.description ? (
                      <p className="m-0 text-[14px] text-[var(--color-text-muted)]">
                        {s.description}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Volver / registrarme ─────────────────────────────── */}
      <section className="bg-[var(--color-surface)]">
        <div className={`${WRAP} pb-[72px] pt-[52px]`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <NextLink
              href={backPath}
              className="text-[15px] font-semibold text-[var(--color-accent)]"
            >
              ← Volver a todos los speakers
            </NextLink>
            <NextLink
              href="/register"
              className="inline-flex flex-none items-center whitespace-nowrap rounded-[4px] bg-[var(--color-action)] px-[26px] py-[13px] text-[15px] font-bold text-[var(--color-text-on-action)] transition hover:brightness-95"
            >
              Registrarme gratis
            </NextLink>
          </div>
        </div>
      </section>
    </>
  );
}
