// GlyphIcon atom. Small line icons drawn inline so they inherit `currentColor`
// and stay crisp at any size. They are concept glyphs (date, place, ticket,
// mail, route...) that help a page be understood at a glance.
//
// Every glyph is `aria-hidden`: it always sits next to a visible text label,
// so it never carries meaning on its own (constitution Principle VI).
//
// Drawn by hand on a 24x24 grid, 1.75 stroke, round caps and joins, one visual
// language. Add new ones here, not as ad-hoc SVGs in a template.

import { cn } from "@/lib/utils/cn";

export type GlyphName =
  | "calendar"
  | "pin"
  | "clock"
  | "users"
  | "mic"
  | "target"
  | "book"
  | "bolt"
  | "check"
  | "ticket"
  | "mail"
  | "map"
  | "route"
  | "arrow-right"
  | "external"
  | "info"
  | "heart"
  | "shield"
  | "send"
  | "bulb"
  | "flask"
  | "coffee"
  | "camera"
  | "door"
  | "clipboard"
  | "box"
  | "globe"
  | "list"
  | "chat"
  | "laptop"
  | "phone"
  | "gem"
  | "user";

// Kept as `d` attributes so the component ships no runtime dependency.
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
  check: "m5 12.5 4.5 4.5L19 7.5",
  ticket:
    "M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3a3 3 0 0 0 0 6v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a3 3 0 0 0 0-6ZM14 5v14",
  mail: "M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1ZM3.5 7.5 12 13.5l8.5-6",
  map: "M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4ZM9 4v14M15 6v14",
  route: "M3 11 21 3l-8 18-2-8-8-2Z",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  external:
    "M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5",
  info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5.5M12 7.8h.01",
  heart:
    "M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7.5 3c0 5.4-7.5 10-7.5 10Z",
  shield: "M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3ZM9 12l2 2 4-4",
  send: "M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z",
  bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z",
  flask:
    "M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3M8 15h8",
  coffee:
    "M5 8h12v6a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V8ZM17 10h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M12 3v2",
  camera:
    "M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM12 17a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  door: "M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16M14 12h.01",
  clipboard:
    "M9 4h6v3H9V4ZM7 5H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-1M9 12h6M9 16h4",
  box: "M12 3 4 7v10l8 4 8-4V7l-8-4ZM4 7l8 4 8-4M12 11v10",
  globe:
    "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.5 8.5 12s1 6.5 3.5 9",
  list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
  chat: "M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z",
  laptop: "M5 6h14a1 1 0 0 1 1 1v9H4V7a1 1 0 0 1 1-1ZM2 19h20",
  gem: "M6 3h12l4 6-10 12L2 9l4-6ZM2 9h20M9 3l3 6 3-6M12 21 9 9M12 21l3-12",
  phone:
    "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A15 15 0 0 1 4 5a1 1 0 0 1 1-1Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM5 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1",
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
