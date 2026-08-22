// IconTile atom. Renders a square inline `<img>` for an SVG asset under
// `public/assets/icons/aws-architecture/`. The icon is decorative
// (`aria-hidden="true"`) and inherits `currentColor` so the consumer chooses
// the tint via CSS.

import { cn } from "@/lib/utils/cn";

type IconTileProps = {
  /**
   * Path under `public/assets/icons/aws-architecture/`, e.g.
   * `compute-lambda.svg`.
   */
  iconHref: string;
  /** Square size in pixels. Defaults to 32. */
  size?: number;
  className?: string;
};

const ICON_BASE_PATH = "/assets/icons/aws-architecture";

export function IconTile({ iconHref, size = 32, className }: IconTileProps) {
  // Use a plain <img> instead of next/image because the SVG is decorative,
  // small, already optimized, and we rely on currentColor for the tint
  // (which next/image does not preserve).
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${ICON_BASE_PATH}/${iconHref}`}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={cn("inline-block", className)}
      style={{ color: "currentColor" }}
    />
  );
}
