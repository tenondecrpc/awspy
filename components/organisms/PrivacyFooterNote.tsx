// Spanish privacy notice for the external attendee and volunteer flows.
// Renders inside SiteFooter; can also be reused on conversion pages.
//
// `analytics` switches the first sentence: with Google Analytics loaded
// (ADR 0010) the site can no longer say it collects no personal data, so the
// notice discloses the analytics cookies instead and names Google Analytics
// next to Google Forms under Google's privacy policy.
//
// `tone="inverse"` is used on the navy footer: because `cn` is a plain join
// (no tailwind-merge), overriding the Link atom's color via className is not
// deterministic, so on the dark surface the two external links are rendered as
// plain anchors that inherit the surrounding light text color and stay
// underlined. On light surfaces (`tone="default"`) the Link atom's blue is
// used as before.

import NextLink from "next/link";
import { Link } from "@/components/atoms/Link";

type PrivacyFooterNoteProps = {
  tone?: "default" | "inverse";
  analytics?: boolean;
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

function PrivacyPageLink({ tone }: { tone: "default" | "inverse" }) {
  return (
    <NextLink
      href="/privacy"
      className={
        tone === "inverse"
          ? INVERSE_LINK_CLASS
          : "font-semibold text-[var(--color-accent)] underline underline-offset-2"
      }
    >
      Cómo tratamos la privacidad
    </NextLink>
  );
}

export function PrivacyFooterNote({
  tone = "default",
  analytics = false,
}: PrivacyFooterNoteProps) {
  const textClass =
    tone === "inverse"
      ? "text-sm text-[var(--color-text-on-inverse-muted)]"
      : "text-sm text-[var(--color-text-secondary)]";

  if (analytics) {
    return (
      <p className={textClass}>
        Este sitio no solicita datos personales y usa Google Analytics, que
        guarda cookies en el navegador, para medir las visitas. El registro y la
        compra de entradas se hacen a través de <EventbriteLink tone={tone} />{" "}
        según su política de privacidad. Las postulaciones de voluntariado se
        realizan mediante Google Forms. Google Analytics y Google Forms están
        sujetos a la <GoogleLink tone={tone} />. <PrivacyPageLink tone={tone} />.
      </p>
    );
  }

  return (
    <p className={textClass}>
      Este sitio no recopila datos personales. El registro y la compra de
      entradas se hacen a través de <EventbriteLink tone={tone} /> según su
      política de privacidad. Las postulaciones de voluntariado se realizan
      mediante Google Forms y están sujetas a la <GoogleLink tone={tone} />. <PrivacyPageLink tone={tone} />.
    </p>
  );
}
