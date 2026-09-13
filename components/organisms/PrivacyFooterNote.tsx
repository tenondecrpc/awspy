// Spanish privacy notice for the external attendee and volunteer flows.
// Renders inside SiteFooter; can also be reused on conversion pages.
//
// `tone="inverse"` is used on the navy footer: because `cn` is a plain join
// (no tailwind-merge), overriding the Link atom's color via className is not
// deterministic, so on the dark surface the two external links are rendered as
// plain anchors that inherit the surrounding light text color and stay
// underlined. On light surfaces (`tone="default"`) the Link atom's blue is
// used as before.

import { Link } from "@/components/atoms/Link";

type PrivacyFooterNoteProps = {
  tone?: "default" | "inverse";
};

const INVERSE_LINK_CLASS =
  "font-semibold text-[var(--color-link-on-inverse)] underline underline-offset-2 hover:text-[var(--color-action)]";

function EventbriteLink({ tone }: { tone: "default" | "inverse" }) {
  const href =
    "https://www.eventbrite.com/help/en-us/articles/460838/eventbrite-privacy-policy/";
  if (tone === "inverse") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={INVERSE_LINK_CLASS}
      >
        Eventbrite
      </a>
    );
  }
  return (
    <Link href={href} external>
      Eventbrite
    </Link>
  );
}

function GoogleLink({ tone }: { tone: "default" | "inverse" }) {
  const href = "https://policies.google.com/privacy?hl=es-419";
  if (tone === "inverse") {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={INVERSE_LINK_CLASS}
      >
        Política de Privacidad de Google
      </a>
    );
  }
  return (
    <Link href={href} external>
      Política de Privacidad de Google
    </Link>
  );
}

export function PrivacyFooterNote({
  tone = "default",
}: PrivacyFooterNoteProps) {
  const textClass =
    tone === "inverse"
      ? "text-sm text-[var(--color-text-on-inverse-muted)]"
      : "text-sm text-[var(--color-text-secondary)]";

  return (
    <p className={textClass}>
      Este sitio no recopila datos personales. El registro y la compra de
      entradas se hacen a través de <EventbriteLink tone={tone} /> según su
      política de privacidad. Las postulaciones de voluntariado se realizan
      mediante Google Forms y están sujetas a la <GoogleLink tone={tone} />.
    </p>
  );
}
