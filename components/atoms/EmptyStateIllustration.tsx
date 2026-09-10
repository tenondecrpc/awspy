// EmptyStateIllustration atom. Token-only inline SVG used as the default
// illustration inside the EmptyState organism. The illustration is decorative
// and `aria-hidden="true"`. No textual content lives inside the SVG.
//
// One vocabulary across the site: the variants share a common composition
// (a soft accent backdrop with a small high-contrast highlight) so the empty
// states feel like a coherent set, not a grab-bag of unrelated images.

import { cn } from "@/lib/utils/cn";

type Variant =
  "default" | "speakers" | "schedule" | "sponsors" | "team" | "venue" | "faq";

type Props = {
  variant?: Variant;
  className?: string;
};

export function EmptyStateIllustration({
  variant = "default",
  className,
}: Props) {
  return (
    <svg
      role="img"
      data-testid="empty-state-illustration"
      data-variant={variant}
      aria-hidden="true"
      viewBox="0 0 200 140"
      className={cn("h-24 w-auto", className)}
    >
      {/* Soft accent backdrop */}
      <rect
        x="10"
        y="20"
        width="180"
        height="100"
        rx="14"
        fill="var(--color-accent-soft)"
      />

      {variant === "speakers" ? (
        <g>
          <circle cx="80" cy="62" r="14" fill="var(--color-accent)" />
          <circle cx="120" cy="62" r="14" fill="var(--color-accent-strong)" />
          <rect
            x="64"
            y="84"
            width="72"
            height="10"
            rx="5"
            fill="var(--color-accent)"
            opacity="0.45"
          />
        </g>
      ) : null}

      {variant === "schedule" ? (
        <g>
          <rect
            x="40"
            y="48"
            width="120"
            height="14"
            rx="4"
            fill="var(--color-accent)"
          />
          <rect
            x="40"
            y="68"
            width="80"
            height="14"
            rx="4"
            fill="var(--color-accent-strong)"
            opacity="0.7"
          />
          <rect
            x="40"
            y="88"
            width="100"
            height="14"
            rx="4"
            fill="var(--color-accent)"
            opacity="0.45"
          />
        </g>
      ) : null}

      {variant === "sponsors" ? (
        <g>
          <rect
            x="36"
            y="56"
            width="40"
            height="28"
            rx="4"
            fill="var(--color-accent-strong)"
            opacity="0.7"
          />
          <rect
            x="80"
            y="56"
            width="40"
            height="28"
            rx="4"
            fill="var(--color-accent)"
          />
          <rect
            x="124"
            y="56"
            width="40"
            height="28"
            rx="4"
            fill="var(--color-accent-strong)"
            opacity="0.45"
          />
        </g>
      ) : null}

      {variant === "team" ? (
        <g>
          <circle cx="70" cy="62" r="12" fill="var(--color-accent-strong)" />
          <circle cx="100" cy="62" r="12" fill="var(--color-accent)" />
          <circle
            cx="130"
            cy="62"
            r="12"
            fill="var(--color-accent-strong)"
            opacity="0.6"
          />
          <rect
            x="58"
            y="84"
            width="84"
            height="10"
            rx="5"
            fill="var(--color-accent)"
            opacity="0.4"
          />
        </g>
      ) : null}

      {variant === "venue" ? (
        <g>
          <path
            d="M60 90 L100 50 L140 90 Z"
            fill="var(--color-accent-strong)"
            opacity="0.85"
          />
          <rect
            x="86"
            y="74"
            width="28"
            height="18"
            fill="var(--color-accent)"
          />
        </g>
      ) : null}

      {variant === "faq" ? (
        <g>
          <circle
            cx="100"
            cy="68"
            r="22"
            fill="none"
            stroke="var(--color-accent-strong)"
            strokeWidth="3"
          />
          <rect
            x="98"
            y="86"
            width="6"
            height="6"
            rx="1"
            fill="var(--color-accent-strong)"
          />
          <path
            d="M92 60c0-5 4-9 9-9s9 4 9 9c0 5-9 6-9 12"
            fill="none"
            stroke="var(--color-accent-strong)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>
      ) : null}

      {variant === "default" ? (
        <g>
          <circle cx="100" cy="70" r="16" fill="var(--color-accent)" />
          <rect
            x="60"
            y="92"
            width="80"
            height="10"
            rx="5"
            fill="var(--color-accent-strong)"
            opacity="0.55"
          />
        </g>
      ) : null}

      {/* Action highlight (always present, in any variant) */}
      <circle cx="170" cy="36" r="8" fill="var(--color-action)" />
    </svg>
  );
}
