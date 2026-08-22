// DecorativePattern atom. Renders a low-opacity grid of AWS Architecture
// Icons behind hero-style sections and CTA banners. The wrapper is
// `aria-hidden="true"` and the icons never carry information.
//
// The icon list is taken from the curated drop under
// `public/assets/icons/aws-architecture/`. The default list is kept here as a
// single source so any future icon refresh updates one location.
//
// When `public/assets/hero/pattern.svg` exists in the repo, consumers may
// pass a `customPatternHref` to use it as a CSS background instead of the
// icon grid. That is a deliberate choice: the icon grid is the default, the
// custom pattern is opt-in.

import { IconTile } from "@/components/atoms/IconTile";
import { cn } from "@/lib/utils/cn";

type Density = "low" | "medium" | "high";

type DecorativePatternProps = {
  /** Number of icons across the wider axis. */
  density?: Density;
  /** 0..1. Higher values are more visible against the parent surface. */
  opacity?: number;
  /**
   * Stable seed for icon arrangement. Same seed = same sequence. Helps with
   * snapshot testing.
   */
  seed?: string;
  /**
   * Optional `/assets/hero/<file>.svg`. When set, used as a CSS background
   * instead of the icon grid.
   */
  customPatternHref?: string;
  className?: string;
};

// Curated subset committed under public/assets/icons/aws-architecture/.
// If the drop changes, refresh this list and the README in that directory.
export const AWS_ARCH_ICONS = [
  "compute-ec2.svg",
  "compute-lambda.svg",
  "compute-fargate.svg",
  "storage-s3.svg",
  "database-rds.svg",
  "database-dynamodb.svg",
  "network-cloudfront.svg",
  "network-route53.svg",
  "ai-bedrock.svg",
  "ai-sagemaker.svg",
  "security-iam.svg",
  "security-cognito.svg",
] as const;

const DENSITY_CONFIG: Record<
  Density,
  { columns: number; rows: number; gap: string; size: number }
> = {
  low: { columns: 6, rows: 3, gap: "3rem", size: 32 },
  medium: { columns: 8, rows: 4, gap: "2.25rem", size: 28 },
  high: { columns: 10, rows: 5, gap: "1.75rem", size: 24 },
};

function pseudoRandom(seedStr: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function DecorativePattern({
  density = "medium",
  opacity = 0.08,
  seed = "default",
  customPatternHref,
  className,
}: DecorativePatternProps) {
  const config = DENSITY_CONFIG[density];
  const totalCells = config.columns * config.rows;
  const rng = pseudoRandom(seed);

  const cells = Array.from({ length: totalCells }, (_, i) => {
    const idx = Math.floor(rng() * AWS_ARCH_ICONS.length);
    return { key: i, icon: AWS_ARCH_ICONS[idx] };
  });

  const wrapperStyle = {
    "--pattern-opacity": String(opacity),
    opacity,
  } as React.CSSProperties;

  if (customPatternHref) {
    return (
      <div
        aria-hidden="true"
        data-testid="decorative-pattern"
        data-variant="custom"
        className={cn(
          "decorative-pattern-fade pointer-events-none absolute inset-0 bg-cover bg-center",
          className
        )}
        style={{
          ...wrapperStyle,
          backgroundImage: `url(${customPatternHref})`,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      data-testid="decorative-pattern"
      data-variant="grid"
      data-density={density}
      data-seed={seed}
      className={cn(
        "decorative-pattern-fade pointer-events-none absolute inset-0 grid place-items-center text-[var(--color-text-on-hero)]",
        className
      )}
      style={{
        ...wrapperStyle,
        gridTemplateColumns: `repeat(${config.columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${config.rows}, minmax(0, 1fr))`,
        gap: config.gap,
        padding: config.gap,
      }}
    >
      {cells.map((cell) => (
        <IconTile key={cell.key} iconHref={cell.icon} size={config.size} />
      ))}
    </div>
  );
}
