// Speaker detail template. Bio, links, sessions, JSON-LD Person.

import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Button } from "@/components/atoms/Button";
import { EyebrowPill } from "@/components/atoms/EyebrowPill";
import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { DecorativePattern } from "@/components/atoms/DecorativePattern";
import {
  buildBreadcrumbJsonLd,
  buildPersonJsonLd,
  serializeJsonLd,
} from "@/lib/utils/seo";
import { formatTimeRange } from "@/lib/utils/datetime";
import type { Speaker, SessionizeSession } from "@/lib/api/sessionize";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

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

  // Filter to the sessions that include this speaker (Sessionize's `Sessions`
  // view returns all sessions; we join client-side by speaker id).
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
      {/* Identity band. The portrait sits on the midnight-blue surface the
          same way the family sites present a keynote, and the practical
          content (bio, talks) follows on the light surface below. */}
      <Section spacing="lg" tone="inverse">
        <DecorativePattern
          density="low"
          opacity={0.06}
          seed={`speaker-${speaker.slug}`}
        />
        <Container className="relative">
          <div className="grid items-center gap-10 lg:grid-cols-[260px_1fr] lg:gap-14">
            <div className="mx-auto w-full max-w-[260px] lg:mx-0">
              <div className="relative aspect-square w-full overflow-hidden rounded-[var(--radius-lg)] border-4 border-[var(--color-national-red)] bg-[var(--color-accent-soft)]">
                {speaker.profilePicture ? (
                  <Image
                    src={speaker.profilePicture}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 260px, 260px"
                    className="object-cover"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-full w-full items-center justify-center text-6xl font-bold text-[var(--color-accent-strong)]"
                  >
                    {initials(speaker.fullName)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-5">
              <EyebrowPill tone="inverse" glyph="mic">
                Speaker
              </EyebrowPill>
              <Heading level={1} className="text-balance">
                {speaker.fullName}
              </Heading>
              {speaker.tagLine ? (
                <p className="text-lg text-[var(--color-text-on-inverse)] opacity-90 sm:text-xl">
                  {speaker.tagLine}
                </p>
              ) : null}
              {speaker.links && speaker.links.length > 0 ? (
                <ul className="flex flex-wrap gap-3">
                  {speaker.links.map((l) => (
                    <li key={l.url}>
                      <Link
                        href={l.url}
                        external
                        className="glass-panel inline-flex items-center gap-2 rounded-[var(--radius-pill)] px-4 py-2 text-sm font-semibold text-[var(--color-text-on-inverse)]"
                      >
                        {l.title || l.linkType}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          {speaker.bio ? (
            <div className="max-w-3xl space-y-4">
              <Heading level={2} visualLevel={4}>
                Sobre {speaker.firstName}
              </Heading>
              <p className="text-lg text-[var(--color-text-secondary)]">
                {speaker.bio}
              </p>
            </div>
          ) : null}

          {ownSessions.length > 0 ? (
            <div className={speaker.bio ? "mt-14 space-y-6" : "space-y-6"}>
              <Heading level={2} visualLevel={3}>
                Sus charlas
              </Heading>
              <ul className="grid gap-6 lg:grid-cols-2">
                {ownSessions.map((s) => (
                  <li
                    key={s.id}
                    className="media-card flex h-full flex-col gap-3 rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    {s.startsAt && s.endsAt ? (
                      <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-text-secondary)]">
                        <GlyphIcon name="clock" size={15} />
                        {formatTimeRange(s.startsAt, s.endsAt)}
                      </p>
                    ) : null}
                    {s.description ? (
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {s.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-14">
            <Button
              as="a"
              href={backPath}
              variant="ghost"
              size="md"
              shape="pill"
            >
              Volver a speakers
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
