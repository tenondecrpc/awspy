// Shared presentational primitives for the redesigned pages: the 1240px
// content wrap, the numbered section heading, an inner-page header, and the
// image frame used where a page shows a photo slot. Every template composes
// these so the sections stay consistent instead of restating the same classes.
//
// Colors come exclusively from the design tokens in `app/globals.css`
// (the `local/no-color-literals` rule forbids hex/rgb here).

import type { ReactNode } from "react";
import NextLink from "next/link";

/** The mockup content column: centered, 1240px max, 28px gutters. */
export const WRAP = "mx-auto max-w-[1240px] px-7";

/** Orange monospace section index ("01".."08"). */
/** Orange monospace section index on a light surface. `--color-action` is the
 *  fill orange and only reaches ~1.9:1 as text on white, so the darkened
 *  `--color-action-label` carries it here. */
export const NUM =
  "font-mono text-xs font-medium text-[var(--color-action-label)]";

/** The same index on the navy band, where the darkened orange is instead too
 *  dark (3.1:1) and the bright fill orange is the readable one. */
export const NUM_ON_DARK =
  "font-mono text-xs font-medium text-[var(--color-action)]";

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
export function NumberHeading({
  n,
  title,
  action,
  onDark,
}: NumberHeadingProps) {
  return (
    <div className="mb-9 flex flex-wrap items-baseline gap-4">
      <span className={onDark ? NUM_ON_DARK : NUM}>{n}</span>
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
  /** Overrides the default centered background position, e.g. "right". */
  position?: string;
};

/** Bordered image frame. Shows the photo when provided, otherwise a labelled
 *  placeholder box. */
export function Frame({ label, className, photo, position }: FrameProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={
        "flex items-center justify-center border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] bg-cover bg-center p-4 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--color-text-muted)] " +
        (className ?? "")
      }
      style={
        photo
          ? {
              backgroundImage: `url(${photo})`,
              ...(position ? { backgroundPosition: position } : {}),
            }
          : undefined
      }
    >
      {photo ? "" : label}
    </div>
  );
}
