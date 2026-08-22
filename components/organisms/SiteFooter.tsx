// Site-wide footer. Lists the secondary navigation, contact email, and
// social links read from `EventInfo.social`. Includes the privacy notice
// required by FR-036.

import { Container } from "@/components/atoms/Container";
import { Link } from "@/components/atoms/Link";
import { EditionPill } from "@/components/molecules/EditionPill";
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

export function SiteFooter({ eventInfo }: SiteFooterProps) {
  const socialEntries = (
    Object.entries(eventInfo.social ?? {}) as Array<
      [keyof typeof SOCIAL_LABELS, string | undefined]
    >
  ).filter(([, url]) => Boolean(url));

  return (
    <footer
      className="mt-16 border-t border-[var(--color-surface-muted)] bg-[var(--color-surface-muted)]"
      role="contentinfo"
    >
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className="font-bold">AWS Community Day Paraguay</p>
            <EditionPill year={eventInfo.year} />
            <p className="text-sm text-[var(--color-text-secondary)]">
              {eventInfo.tagline}
            </p>
          </div>

          <nav aria-label="Navegación del pie">
            <p className="mb-2 text-sm font-semibold">Navegación</p>
            <ul className="flex flex-col gap-1">
              {FOOTER_NAV.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    className="text-sm text-[var(--color-text-secondary)]"
                  >
                    {entry.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-2 text-sm font-semibold">Contacto</p>
            <Link href={`mailto:${eventInfo.contactEmail}`} className="text-sm">
              {eventInfo.contactEmail}
            </Link>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Comunidad</p>
            {socialEntries.length === 0 ? (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Próximamente en redes
              </p>
            ) : (
              <ul className="flex flex-col gap-1">
                {socialEntries.map(([key, url]) => (
                  <li key={key}>
                    <Link href={url as string} external className="text-sm">
                      {SOCIAL_LABELS[key]}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--color-text-muted)]/20 py-6">
          <PrivacyFooterNote />
          <p className="mt-3 text-xs text-[var(--color-text-muted)]">
            AWS Community Day Paraguay es un evento organizado por la comunidad
            local. No es un evento oficial de Amazon Web Services.
          </p>
        </div>
      </Container>
    </footer>
  );
}
