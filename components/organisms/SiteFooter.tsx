// Site-wide footer, styled after the "colored" mockup: a navy panel with
// Amazon-Orange accents and columns for the event, participation, and contact.
// It carries the full navigation (including the destinations the condensed
// header omits), the contact email, social links (or a fallback), the privacy
// notice (FR-036), and the community-organized disclaimer.
//
// Links here are plain Next/anchor elements with explicit token colors rather
// than the blue Link atom, because `cn` is a plain join (no tailwind-merge)
// and the atom's color could not be overridden deterministically on the dark
// surface.

import NextLink from "next/link";
import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { PrivacyFooterNote } from "@/components/organisms/PrivacyFooterNote";
import { FOOTER_NAV } from "@/lib/nav";
import type { EventInfo } from "@/lib/content/event-info";

type SiteFooterProps = {
  eventInfo: EventInfo;
};

const SOCIAL_LABELS: Record<keyof NonNullable<EventInfo["social"]>, string> = {
  twitter: "Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  meetup: "Meetup",
};

const LINK_CLASS =
  "text-sm text-[var(--color-link-on-inverse)] transition-colors hover:text-[var(--color-action)]";
const HEADING_CLASS =
  "mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-on-inverse-muted)]";

// The mockup splits the destinations into two columns; the split is presentational.
const EVENT_NAV = FOOTER_NAV.slice(0, 6);
const PARTICIPATE_NAV = FOOTER_NAV.slice(6);

export function SiteFooter({ eventInfo }: SiteFooterProps) {
  const socialEntries = (
    Object.entries(eventInfo.social ?? {}) as Array<
      [keyof typeof SOCIAL_LABELS, string | undefined]
    >
  ).filter(([, url]) => Boolean(url));

  return (
    <footer
      className="mt-16 bg-[var(--color-surface-inverse)] text-[var(--color-text-on-inverse)]"
      role="contentinfo"
    >
      <Container>
        <div className="grid gap-9 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0 space-y-4">
            <Image
              src="/assets/logo.png"
              alt="AWS Community Day Paraguay"
              width={501}
              height={139}
              className="h-[34px] w-auto"
            />
            <p className="max-w-xs text-sm text-[var(--color-text-on-inverse-secondary)]">
              {eventInfo.tagline}
            </p>
            <p className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--color-action)]">
              <span
                aria-hidden="true"
                className="h-px w-4 bg-[var(--color-action)]"
              />
              Entrada gratuita
            </p>
          </div>

          <nav aria-label="Navegación del evento">
            <p className={HEADING_CLASS}>Evento</p>
            <ul className="flex flex-col gap-2">
              {EVENT_NAV.map((entry) => (
                <li key={entry.href}>
                  <NextLink href={entry.href} className={LINK_CLASS}>
                    {entry.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Participar">
            <p className={HEADING_CLASS}>Participar</p>
            <ul className="flex flex-col gap-2">
              {PARTICIPATE_NAV.map((entry) => (
                <li key={entry.href}>
                  <NextLink href={entry.href} className={LINK_CLASS}>
                    {entry.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">
            <p className={HEADING_CLASS}>Contacto</p>
            <a
              href={`mailto:${eventInfo.contactEmail}`}
              className="break-words text-sm font-semibold text-[var(--color-action)] transition hover:brightness-95"
            >
              {eventInfo.contactEmail}
            </a>
            {socialEntries.length === 0 ? (
              <p className="mt-3 text-sm text-[var(--color-text-on-inverse-muted)]">
                Próximamente en redes
              </p>
            ) : (
              <ul className="mt-3 flex flex-col gap-2">
                {socialEntries.map(([key, url]) => (
                  <li key={key}>
                    <a
                      href={url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLASS}
                    >
                      {SOCIAL_LABELS[key]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--color-border-on-inverse)] py-6">
          <PrivacyFooterNote tone="inverse" />
          <p className="mt-3 text-xs text-[var(--color-text-on-inverse-muted)]">
            AWS Community Day Paraguay es un evento organizado por la comunidad
            local. No es un evento oficial de Amazon Web Services.
          </p>
        </div>
      </Container>
    </footer>
  );
}
