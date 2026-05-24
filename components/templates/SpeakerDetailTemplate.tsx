// Speaker detail template. Bio, links, sessions, JSON-LD Person.

import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Button } from "@/components/atoms/Button";
import { buildBreadcrumbJsonLd, buildPersonJsonLd } from "@/lib/utils/seo";
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

  // Filter to the sessions that include this speaker (Sessionize's `Sessions`
  // view returns all sessions; we join client-side by speaker id).
  const ownSessions = sessions.filter((s) =>
    s.speakers?.some((sp) => sp.id === speaker.id)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Section spacing="lg">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[200px_1fr]">
            <div className="flex justify-center lg:block">
              {speaker.profilePicture ? (
                <Image
                  src={speaker.profilePicture}
                  alt=""
                  width={200}
                  height={200}
                  sizes="(min-width: 1024px) 200px, 160px"
                  className="h-[200px] w-[200px] rounded-full object-cover"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-[200px] w-[200px] items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-5xl font-bold text-[var(--color-accent-strong)]"
                >
                  {speaker.fullName
                    .split(" ")
                    .map((p) => p[0])
                    .filter(Boolean)
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <Heading level={1}>{speaker.fullName}</Heading>
              {speaker.tagLine ? (
                <p className="text-lg text-[var(--color-text-secondary)]">
                  {speaker.tagLine}
                </p>
              ) : null}
              {speaker.bio ? (
                <p className="text-[var(--color-text-primary)]">
                  {speaker.bio}
                </p>
              ) : null}
              {speaker.links && speaker.links.length > 0 ? (
                <ul className="flex flex-wrap gap-3">
                  {speaker.links.map((l) => (
                    <li key={l.url}>
                      <Link href={l.url} external className="text-sm">
                        {l.title || l.linkType}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {ownSessions.length > 0 ? (
            <div className="mt-10 space-y-4">
              <Heading level={2} visualLevel={3}>
                Sus charlas
              </Heading>
              <ul className="space-y-3">
                {ownSessions.map((s) => (
                  <li
                    key={s.id}
                    className="rounded-[var(--radius-lg)] bg-[var(--color-surface-muted)] p-4"
                  >
                    <p className="font-semibold">{s.title}</p>
                    {s.startsAt && s.endsAt ? (
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {formatTimeRange(s.startsAt, s.endsAt)}
                      </p>
                    ) : null}
                    {s.description ? (
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        {s.description}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-10">
            <Button as="a" href={backPath} variant="ghost" size="md">
              Volver a speakers
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
