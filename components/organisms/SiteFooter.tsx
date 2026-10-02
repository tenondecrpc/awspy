// Site-wide footer: a light band on the same paper as the page, one row for the
// mark and the full navigation (including the destinations the condensed header
// omits), one row for the contact and social links, and the small print: the
// privacy notice (FR-036) and the community-organized disclaimer.
//
// It is deliberately quiet. The page content is what the person came for, so
// the footer is a few lines of links, not a second poster at the bottom of
// every page.

import { FlagRule } from "@/components/atoms/FlagRule";
import NextLink from "next/link";
import Image from "next/image";
import { Container } from "@/components/atoms/Container";
import { PrivacyFooterNote } from "@/components/organisms/PrivacyFooterNote";
import { FOOTER_NAV } from "@/lib/nav";
import type { EventInfo } from "@/lib/content/event-info";

type SiteFooterProps = {
  eventInfo: EventInfo;
  /** Whether Google Analytics loads on this build; selects the privacy copy. */
  analyticsEnabled?: boolean;
};

const SOCIAL_LABELS: Record<keyof NonNullable<EventInfo["social"]>, string> = {
  twitter: "Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  youtube: "YouTube",
  meetup: "Meetup",
};

const LINK_CLASS =
  "inline-flex min-h-10 items-center text-sm text-[var(--color-text-secondary)] underline-offset-4 transition-colors hover:text-[var(--color-text-primary)] hover:underline";

// The destinations split into two lists, each its own landmark; the split is
// presentational.
const EVENT_NAV = FOOTER_NAV.slice(0, 6);
const PARTICIPATE_NAV = FOOTER_NAV.slice(6);

/** Renders an address with a soft break opportunity after the "@". */
function emailParts(email: string) {
  const at = email.indexOf("@");
  if (at === -1) return email;
  return (
    <>
      {email.slice(0, at + 1)}
      <wbr />
      {email.slice(at + 1)}
    </>
  );
}

export function SiteFooter({
  eventInfo,
  analyticsEnabled = false,
}: SiteFooterProps) {
  const socialEntries = (
    Object.entries(eventInfo.social ?? {}) as Array<
      [keyof typeof SOCIAL_LABELS, string | undefined]
    >
  ).filter(([, url]) => Boolean(url));

  return (
    <footer
      className=" bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]"
      role="contentinfo"
    >
      <FlagRule />
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-10 gap-y-4 py-7">
          {/* Same two inks as the header: whichever is hidden by
              `display: none` is out of the accessibility tree too. */}
          <span className="shrink-0">
            <Image
              src="/assets/logo-dark.png"
              alt="AWS Community Day Paraguay"
              width={501}
              height={139}
              className="brand-logo--light h-8 w-auto"
            />
            <Image
              src="/assets/logo.png"
              alt="AWS Community Day Paraguay"
              width={501}
              height={139}
              className="brand-logo--dark h-8 w-auto"
            />
          </span>

          <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
            <nav aria-label="Navegación del evento">
              <ul className="m-0 flex list-none flex-wrap gap-x-5 p-0">
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
              <ul className="m-0 flex list-none flex-wrap gap-x-5 p-0">
                {PARTICIPATE_NAV.map((entry) => (
                  <li key={entry.href}>
                    <NextLink href={entry.href} className={LINK_CLASS}>
                      {entry.label}
                    </NextLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 py-3">
          <a
            href={`mailto:${eventInfo.contactEmail}`}
            className="inline-block break-words py-2 text-sm font-semibold text-[var(--color-text-primary)] underline decoration-[var(--color-border-strong)] underline-offset-4 hover:decoration-[var(--color-text-primary)]"
          >
            {/* The address is one long token, so a narrow footer broke it
                mid-word ("…gmail.co / m"). `<wbr>` offers the break after the
                "@" instead; it adds no characters, so the link text and its
                accessible name are unchanged. The link stays inline-block
                (padding gives the touch height): as a flex container it would
                turn the `<wbr>` into a separate item and split the name into
                "…@ gmail.com". */}
            {emailParts(eventInfo.contactEmail)}
          </a>
          {socialEntries.length === 0 ? (
            <span className="text-sm text-[var(--color-text-muted)]">
              Próximamente en redes
            </span>
          ) : (
            <ul className="m-0 flex list-none flex-wrap gap-x-5 p-0">
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

        <div className=" py-4 text-xs text-[var(--color-text-muted)]">
          <PrivacyFooterNote analytics={analyticsEnabled} />
          <p className="m-0 mt-2">
            AWS Community Day Paraguay es un evento organizado por la comunidad
            local. No es un evento oficial de Amazon Web Services.
          </p>
        </div>
      </Container>
    </footer>
  );
}
