// Mascot atom. The event character, parked in the bottom corner the way the
// Community Day family does it.
//
// It is purely decorative: `aria-hidden`, no link, no label. A screen reader
// never hears it and a keyboard never lands on it, so it costs nothing to
// anyone who is not looking at it.
//
// The artwork lives at `public/assets/mascot/mascot.jpg`; swapping it is
// dropping a new file at that path, no code change. See the README next to it
// for the provenance of the current placeholder.
//
// It is framed in a circle on purpose. The family mascot is a drawn character
// with transparency, which composites over a page corner; the current file is
// a rectangular photograph, and a circular frame is what makes that read as a
// deliberate emblem instead of a stray image. Transparent artwork can drop the
// frame by passing `rounded-none` and `ring-0`.
//
// Hidden below `lg`: on a phone a fixed corner image sits on top of the
// content and competes with the reading column for the little width there is.

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

/** Repo path of the current artwork. */
export const MASCOT_SRC = "/assets/mascot/mascot.jpg";

type MascotProps = {
  className?: string;
};

export function Mascot({ className }: MascotProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed bottom-5 right-5 z-10 hidden lg:block",
        className
      )}
    >
      <Image
        src={MASCOT_SRC}
        alt=""
        width={236}
        height={295}
        sizes="96px"
        className="size-24 rounded-[var(--radius-pill)] object-cover shadow-lg ring-2 ring-[var(--color-national-red-on-dark)]"
      />
    </div>
  );
}
