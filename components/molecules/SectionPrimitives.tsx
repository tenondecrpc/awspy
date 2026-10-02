// Shared presentational primitives for the pages: the content wrap, the
// section title, the inner-page header and the image frame used where a page
// shows a photo slot. Every template composes these so sections stay
// consistent instead of restating the same classes.
//
// Colors come exclusively from the design tokens in `app/globals.css`
// (the `local/no-color-literals` rule forbids hex/rgb here).

import { FlagRule } from "@/components/atoms/FlagRule";
import type { ReactNode } from "react";
import Image, { type StaticImageData } from "next/image";
import NextLink from "next/link";
import { tieLast } from "@/lib/utils/typography";

/** The content column: centered, 1240px max, fluid gutters. */
export const WRAP = "mx-auto w-full max-w-[1240px] px-5 sm:px-7";

/* Layout note, because it recurs across every template: the responsive grids
 * are written `repeat(auto-fit, minmax(min(<N>px, 100%), 1fr))`, never
 * `minmax(<N>px, 1fr)`. A bare px minimum is a floor the track cannot go under,
 * so on a 320px phone the gutters leave ~280px of column and any grid asking
 * for more pushes the whole page sideways. Wrapping the minimum in
 * `min(..., 100%)` caps it at the container, which changes nothing wherever
 * there is room and collapses cleanly where there is not. */

/** Section title in the display serif, sized on the fluid scale. Modest by
 *  default: on inner pages the section names are self-explanatory and the
 *  content below is what matters. */
export const H2 =
  "m-0 font-display text-step-2 leading-[1.08] tracking-[-0.01em] text-[var(--color-text-primary)]";

/** The poster-size title the home page uses, one screen per section. */
export const H2_LG =
  "m-0 font-display text-step-3 leading-[1.04] tracking-[-0.01em] text-[var(--color-text-primary)]";

/** The thin hairline the layout puts between full-bleed sections. */
export const SECTION_BORDER = "";

/** Vertical rhythm of a section. */
export const SECTION_Y = "py-[var(--space-section-y)]";

/** A section that fills the visible screen below the header on wide, tall
 *  viewports (see `.fit-screen` in globals.css) and flows naturally elsewhere.
 *  Its padding follows the viewport height so the content has room to fit a
 *  laptop screen and breathes on a large one. */
export const SECTION_FIT = "fit-screen py-[clamp(2.5rem,6svh,5rem)]";

/** Small lead-in label: body face, sentence case, no box, no tracking. */
export const KICKER =
  "m-0 text-sm font-semibold text-[var(--color-national-red-label)]";

/* Actions are buttons, not underlined text: a thing you are meant to DO must
 * carry visual weight. Three levels, all 44px tall, all bold, all square-cornered:
 *   BTN_PRIMARY  the one orange fill on a view (registration)
 *   BTN_OUTLINE  a ruled ink button for every other action on paper
 *   BTN_OUTLINE_ON_DARK  the same on a navy band
 * Underlined text stays only for links that sit inside a sentence. */
const BTN_BASE =
  "inline-flex min-h-[var(--size-touch)] items-center justify-center gap-2 rounded-[var(--radius-sm)] border-2 px-5 text-base font-bold transition-colors duration-150 active:translate-y-px";

export const BTN_PRIMARY = `${BTN_BASE} min-h-[3.25rem] border-transparent bg-[var(--color-action)] px-8 text-lg text-[var(--color-text-on-action)] hover:bg-[var(--color-action-strong)]`;

export const BTN_OUTLINE = `${BTN_BASE} border-[var(--color-text-primary)] text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface)]`;

export const BTN_INK = `${BTN_BASE} min-h-[3.25rem] border-[var(--color-text-primary)] bg-[var(--color-text-primary)] px-7 text-[var(--color-surface)] hover:border-[var(--color-accent-strong)] hover:bg-[var(--color-accent-strong)]`;

export const BTN_OUTLINE_ON_DARK = `${BTN_BASE} border-[var(--color-text-on-hero)] text-[var(--color-text-on-hero)] hover:bg-[var(--color-text-on-hero)] hover:text-[var(--color-surface-hero)]`;

type SectionTitleProps = {
  title: ReactNode;
  /** A link shown at the end of the title row, e.g. "Ver la agenda". */
  action?: { href: string; label: string };
  /** Set on the navy band, where the ink flips to the light tokens. */
  onDark?: boolean;
  /** `md` (default) is the modest inner-page title; `lg` is the poster-size
   *  title of the home page, where each section fills a screen. */
  size?: "md" | "lg";
};

/** The title and an optional action, aligned to the start. */
export function SectionTitle({
  title,
  action,
  onDark,
  size = "md",
}: SectionTitleProps) {
  const large = size === "lg";
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-x-8 gap-y-3 ${
        large ? "mb-[clamp(1.25rem,4svh,2.5rem)]" : "mb-[clamp(0.75rem,2.5svh,1.5rem)]"
      }`}
    >
      <FlagRule weight="bold" className="mb-1" />
      <div>
        <h2
          className={`${large ? H2_LG : H2} ${onDark ? "text-[var(--color-text-on-inverse)]" : ""}`}
        >
          {typeof title === "string" ? tieLast(title) : title}
        </h2>
      </div>
      {action ? (
        <NextLink
          href={action.href}
          className={onDark ? BTN_OUTLINE_ON_DARK : BTN_OUTLINE}
        >
          {action.label}
          <span aria-hidden="true">→</span>
        </NextLink>
      ) : null}
    </div>
  );
}

type PageHeaderProps = {
  /** Optional lead-in. Leave it out when the title already says it. */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
};

/**
 * Inner-page header: just the title and, beside it, a short description, on the
 * same paper as the rest of the page and closed by a hairline. The page names
 * ("Registro", "Agenda") say what the page is, so the title is modest and the
 * header only as tall as it needs to be; the person came for the content below,
 * not for a poster.
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
      className=""
    >
      <div
        className={`${WRAP} flex flex-wrap items-end justify-between gap-x-10 gap-y-3 py-[clamp(1rem,3.5svh,2rem)]`}
      >
        <div className="min-w-0">
          {eyebrow ? <p className={`${KICKER} mb-1`}>{eyebrow}</p> : null}
          <h1 className="m-0 font-display text-step-2 leading-[1.05] tracking-[-0.01em] text-[var(--color-text-primary)]">
            {typeof title === "string" ? tieLast(title) : title}
          </h1>
        </div>
        {description ? (
          <p className="m-0 max-w-[36rem] text-step--1 leading-[1.5] text-[var(--color-text-secondary)] sm:text-step-0 sm:leading-[1.5]">
            {description}
          </p>
        ) : null}
        {children ? <div className="w-full pt-1">{children}</div> : null}
      </div>
    </section>
  );
}

type FrameProps = {
  label: string;
  className?: string;
  /** A static import (hashed URL, blur placeholder, cached as immutable) for a
   *  photo that ships with the repo, or a path/URL for a provider-supplied one. */
  photo?: string | StaticImageData;
  /** Overrides the default centered crop, e.g. "right". */
  position?: string;
  /** How wide the photo is *rendered*, so the browser picks the right entry
   *  from the generated srcset. Defaults to the card slots (190-320px).
   *
   *  Careful, twice over:
   *
   *  1. The frame crops with `object-cover`, so a slot that is taller than the
   *     source's aspect ratio renders the source WIDER than the slot —
   *     `max(slotWidth, slotHeight * sourceAspect)`. A portrait panel holding a
   *     4:3 photo renders it at about twice the slot width, and passing the
   *     slot width there fetches a half-resolution image that visibly softens
   *     faces. The tall panels therefore pass the cover-rendered width.
   *  2. A `vw` unit in this string does not just describe the slot, it *prunes*
   *     the srcset: `next/image` keeps only the widths at or above
   *     `smallestVw% * 640`. `190vw` left the hero with nothing under 1920px in
   *     its srcset, so every phone downloaded the largest entry. The
   *     cover-rendered width of these panels is driven by their fixed
   *     `min-h-*`, not by the viewport, so they state it in `px` and keep the
   *     whole ladder available. */
  sizes?: string;
  /** Set on the one above-the-fold photo that is the LCP element, so it is
   *  preloaded from the head instead of being discovered late. */
  preload?: boolean;
};

/** The box shared by the photo and the placeholder, so both reserve the same
 *  space and no layout shift happens while the photo decodes. */
const FRAME_BOX = "bg-[var(--color-surface-muted)] ";

/** Image frame. A provided photo goes through `next/image` (resized per
 *  breakpoint, re-encoded to AVIF/WebP, lazy below the fold); without one the
 *  frame falls back to a labelled placeholder box. */
export function Frame({
  label,
  className,
  photo,
  position,
  sizes,
  preload,
}: FrameProps) {
  if (!photo) {
    return (
      <div
        role="img"
        aria-label={label}
        className={
          FRAME_BOX +
          "flex items-center justify-center p-4 text-center text-sm text-[var(--color-text-muted)] " +
          (className ?? "")
        }
      >
        {label}
      </div>
    );
  }

  return (
    <div
      className={FRAME_BOX + "relative overflow-hidden " + (className ?? "")}
    >
      <Image
        src={photo}
        alt={label}
        fill
        sizes={sizes ?? "(min-width: 640px) 320px, 100vw"}
        preload={preload}
        // A static import carries a generated `blurDataURL`, so the frame can
        // show the photo's colours while the real bytes arrive instead of an
        // empty box. A provider URL has none and stays empty.
        placeholder={typeof photo === "string" ? "empty" : "blur"}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </div>
  );
}
