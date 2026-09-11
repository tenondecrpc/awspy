// Shared presentational primitives for the mockup rebuild
// (`AWS Community Day Paraguay (colored)/*.dc.html`). These reproduce the
// mockup's building blocks so every rebuilt page stays 1:1 and consistent:
// the 1240px content wrap, the numbered section heading, an inner-page header,
// and the grayscale image frame used where the mockups show an `image-slot`.
//
// Colors come exclusively from the design tokens in `app/globals.css`
// (the `local/no-color-literals` rule forbids hex/rgb here).

import type { ReactNode } from "react";
import NextLink from "next/link";

/** The mockup content column: centered, 1240px max, 28px gutters. */
export const WRAP = "mx-auto max-w-[1240px] px-7";

/** Orange monospace section index ("01".."08"). */
export const NUM = "font-mono text-xs font-medium text-[var(--color-action)]";

/** Section title scale used across the mockups. */
export const H2 =
  "m-0 text-[clamp(26px,3.2vw,38px)] font-extrabold leading-[1.05] tracking-[-0.035em]";

/** The thin flag-rule divider that fills the heading row. */
export const RULE = "h-px flex-1 bg-[var(--color-border-subtle)]";

/** The heavy navy hairline the mockup puts between full-bleed sections. */
export const SECTION_BORDER = "border-b border-[var(--color-text-primary)]";

type NumberHeadingProps = {
  n: string;
  title: ReactNode;
  action?: { href: string; label: string };
  onDark?: boolean;
};

/** "01 · Title ————— action →" heading row. */
export function NumberHeading({ n, title, action, onDark }: NumberHeadingProps) {
  return (
    <div className="mb-9 flex flex-wrap items-baseline gap-4">
      <span className={NUM}>{n}</span>
      <h2 className={H2}>{title}</h2>
      <span className={RULE} aria-hidden="true" />
      {action ? (
        <NextLink
          href={action.href}
          className={
            onDark
              ? "text-sm font-semibold text-[var(--color-text-on-inverse)] hover:text-[var(--color-action)]"
              : "text-sm font-semibold text-[var(--color-accent)]"
          }
        >
          {action.label} →
        </NextLink>
      ) : null}
    </div>
  );
}

type PageHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

/**
 * Inner-page hero header: a light band with a mono eyebrow, a large title
 * (with an orange trailing word via `<span className="text-[var(--color-action)]">`),
 * an optional lead paragraph, and optional CTAs.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section
      id="contenido-principal"
      className={`${SECTION_BORDER} bg-[var(--color-surface-muted)]`}
    >
      <div className={`${WRAP} py-16`}>
        <p className="mb-4 font-mono text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
          {eyebrow}
        </p>
        <h1 className="m-0 text-[clamp(34px,5vw,58px)] font-extrabold leading-[0.98] tracking-[-0.04em] text-[var(--color-text-primary)]">
          {title}
        </h1>
        {description ? (
          <p className="m-0 mt-5 max-w-[42rem] text-[18px] leading-[1.55] text-[var(--color-text-secondary)]">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-7">{children}</div> : null}
      </div>
    </section>
  );
}

type FrameProps = {
  label: string;
  className?: string;
  photo?: string;
};

/** Grayscale bordered image frame (mockup `image-slot`). Shows the photo when
 *  provided, otherwise a labelled placeholder box. */
export function Frame({ label, className, photo }: FrameProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={
        "flex items-center justify-center border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] bg-cover bg-center p-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)] grayscale transition-[filter] duration-300 hover:grayscale-0 " +
        (className ?? "")
      }
      style={photo ? { backgroundImage: `url(${photo})` } : undefined}
    >
      {photo ? "" : label}
    </div>
  );
}
