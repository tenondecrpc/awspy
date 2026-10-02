// An original radial lace motif, drawn procedurally. It echoes the concentric,
// petal-and-thread geometry of Paraguayan ñandutí without reproducing any
// artisan's pattern: rings of petals and dots generated from simple maths.
//
// It is thread-thin line work in `currentColor`, so a caller sets its ink with
// a token class (e.g. `text-[var(--color-accent)]`). Decorative only:
// `aria-hidden`, no semantics. Colors never appear as literals here.

import { cn } from "@/lib/utils/cn";

type LaceProps = {
  /** CSS size of the square motif, e.g. "40rem" or "100%". */
  size?: string;
  /** Number of concentric rings, 3 to 7. More rings, denser lace. */
  rings?: number;
  className?: string;
};

type Ring = { radius: number; petals: number; length: number; width: number };

const BASE: Ring[] = [
  { radius: 9, petals: 8, length: 7, width: 3 },
  { radius: 21, petals: 12, length: 10, width: 4 },
  { radius: 36, petals: 16, length: 13, width: 5 },
  { radius: 53, petals: 20, length: 15, width: 6 },
  { radius: 71, petals: 24, length: 16, width: 7 },
  { radius: 88, petals: 32, length: 12, width: 5 },
  { radius: 97, petals: 48, length: 4, width: 2 },
];

/** Points of a regular ring, as [x, y] pairs. */
function ringPoints(radius: number, count: number, offset = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + offset;
    return [Math.cos(a) * radius, Math.sin(a) * radius] as const;
  });
}

export function Lace({ size = "32rem", rings = 6, className }: LaceProps) {
  const used = BASE.slice(0, Math.min(Math.max(rings, 3), BASE.length));
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="-100 -100 200 200"
      style={{ width: size, height: size }}
      className={cn("pointer-events-none select-none", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.55"
      strokeLinecap="round"
    >
      {used.map((ring, k) => {
        const tilt = k % 2 === 0 ? 0 : Math.PI / ring.petals;
        const centers = ringPoints(ring.radius, ring.petals, tilt);
        return (
          <g key={ring.radius}>
            <circle r={ring.radius} vectorEffect="non-scaling-stroke" />
            {centers.map(([x, y], i) => {
              const angle = ((i / ring.petals) * 360 + (tilt * 180) / Math.PI);
              return (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx={ring.width / 2}
                  ry={ring.length / 2}
                  transform={`rotate(${angle + 90} ${x} ${y})`}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
            {ringPoints(ring.radius + ring.length * 0.9, ring.petals, tilt).map(
              ([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="0.9" fill="currentColor" stroke="none" />
              ),
            )}
          </g>
        );
      })}
      <circle r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
