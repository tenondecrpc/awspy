// GlyphIcon atom. Small decorative line icons drawn inline so they inherit
// `currentColor` and stay crisp at any size.
//
// These are concept glyphs (date, place, time, community) and are distinct
// from `IconTile`, which renders the AWS Architecture Icons used by the
// decorative hero pattern. Every glyph is `aria-hidden`: it always sits next
// to a visible text label, so it never carries meaning on its own
// (constitution Principle VI).

import { cn } from "@/lib/utils/cn";

export type GlyphName =
  "calendar" | "pin" | "clock" | "users" | "mic" | "target" | "book" | "bolt";

// 24x24 viewBox, 1.75 stroke, round caps. Kept as `d` attributes so the
// component ships no runtime dependency.
const PATHS: Record<GlyphName, string> = {
  calendar:
    "M7 3v3M17 3v3M4 9h16M5 6h14a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z",
  pin: "M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  clock: "M12 7v5l3.5 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z",
  users:
    "M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19M10 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm10 8v-1.5a3.5 3.5 0 0 0-2.6-3.4M15.5 4.2a3.5 3.5 0 0 1 0 6.6",
  mic: "M12 15a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 1 0-7 0v5.5A3.5 3.5 0 0 0 12 15Zm-6-3.5a6 6 0 0 0 12 0M12 18v3",
  target:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0-3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  book: "M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5.5A1.5 1.5 0 0 1 4 16.5v-11Zm16 0A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h4.5a1.5 1.5 0 0 0 1.5-1.5v-11Z",
  bolt: "M13.5 3 5 13.5h5L9.5 21 18 10.5h-5L13.5 3Z",
};

type GlyphIconProps = {
  name: GlyphName;
  /** Square size in pixels. Defaults to 20. */
  size?: number;
  className?: string;
};

export function GlyphIcon({ name, size = 20, className }: GlyphIconProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
    >
      <path d={PATHS[name]} />
    </svg>
  );
}
