// Site-wide navigation entries. The Spanish copy lives here because every
// header and footer renders the same list. Routes stay in English per
// constitution Principle VII.

export type NavEntry = {
  href: string;
  label: string;
  /** When true, this entry is hidden from the primary header nav and only
   *  appears in the footer or in-context CTAs (e.g. Code of Conduct). */
  footerOnly?: boolean;
};

// The primary header navigation follows the "colored" mockup: a condensed set
// of six destinations. Entries the mockup drops from the top bar (Proponer
// charla, Voluntarios) are NOT removed from the site — they remain in
// `FOOTER_NAV` below (and on their own pages), so no navigation is lost.
export const PRIMARY_NAV: readonly NavEntry[] = [
  { href: "/schedule", label: "Agenda" },
  { href: "/speakers", label: "Speakers" },
  { href: "/venue", label: "Sede" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/team", label: "Equipo" },
  { href: "/faq", label: "Preguntas" },
] as const;

// The registration call to action, rendered as the header's primary button
// (orange fill) rather than a plain nav link, matching the mockup.
export const REGISTER_CTA: NavEntry = {
  href: "/register",
  label: "Registrarme",
};

// The footer carries the complete set so every destination stays reachable,
// including the ones the condensed header omits.
export const FOOTER_NAV: readonly NavEntry[] = [
  { href: "/schedule", label: "Agenda" },
  { href: "/speakers", label: "Speakers" },
  { href: "/venue", label: "Sede" },
  { href: "/sponsors", label: "Sponsors" },
  { href: "/team", label: "Equipo" },
  { href: "/faq", label: "Preguntas" },
  { href: "/register", label: "Registro" },
  { href: "/cfp", label: "Proponer charla" },
  { href: "/volunteers", label: "Voluntarios" },
  { href: "/code-of-conduct", label: "Código de Conducta", footerOnly: true },
  { href: "/editions", label: "Ediciones anteriores", footerOnly: true },
] as const;
