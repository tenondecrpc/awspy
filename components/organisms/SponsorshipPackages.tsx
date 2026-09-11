// Sponsorship packages organism. The prospectus comparison table: one column
// per package, one row per benefit.
//
// It is a real `<table>` because the content is tabular - a benefit read
// against a package - and a screen reader needs the row and column headers to
// say which cell it is on. The check mark is decorative; every cell also
// carries a visually hidden "Incluido" / "No incluido", so inclusion never
// rests on an icon or a color alone (constitution Principle VI).
//
// Ten rows of prose never fit a phone, so the table scrolls horizontally
// inside its own container and is focusable, which is what lets a keyboard
// user scroll it.

import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { Badge } from "@/components/atoms/Badge";
import type { Sponsorship } from "@/lib/content/sponsorship";
import type { SponsorTier } from "@/lib/content/sponsors";

type SponsorshipPackagesProps = {
  packages: Sponsorship["packages"];
  benefits: Sponsorship["benefits"];
};

const TIER_VARIANT: Record<
  SponsorTier,
  Parameters<typeof Badge>[0]["variant"]
> = {
  Diamante: "tier-diamante",
  Platinum: "tier-platinum",
  Gold: "tier-gold",
  Silver: "tier-silver",
  Bronze: "tier-bronze",
  Community: "tier-community",
};

export function SponsorshipPackages({
  packages,
  benefits,
}: SponsorshipPackagesProps) {
  if (packages.length === 0 || benefits.length === 0) return null;

  return (
    <>
      {/* Only the narrow viewports actually clip the table. */}
      <p className="mb-3 text-sm text-[var(--color-text-secondary)] lg:hidden">
        Deslizá la tabla para ver todos los paquetes.
      </p>

      <div
        className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)]"
        tabIndex={0}
        role="group"
        aria-label="Tabla de paquetes de patrocinio"
      >
        <table className="w-full min-w-[44rem] border-collapse text-left">
          <caption className="sr-only">
            Beneficios incluidos en cada paquete de patrocinio
          </caption>
          <thead>
            <tr className="border-b border-[var(--color-border-subtle)]">
              <th
                scope="col"
                className="w-[38%] p-4 align-bottom text-sm font-bold"
              >
                Beneficio
              </th>
              {packages.map((pkg) => (
                <th
                  key={pkg.tier}
                  scope="col"
                  className="p-4 text-center align-bottom"
                >
                  <span className="flex flex-col items-center gap-2">
                    <Badge variant={TIER_VARIANT[pkg.tier]}>{pkg.tier}</Badge>
                    <span className="text-lg font-bold">{pkg.price}</span>
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {benefits.map((benefit) => (
              <tr
                key={benefit.label}
                className="border-b border-[var(--color-border-subtle)] last:border-b-0"
              >
                <th
                  scope="row"
                  className="p-4 text-sm font-normal text-[var(--color-text-secondary)]"
                >
                  {benefit.label}
                </th>
                {packages.map((pkg) => {
                  const included = benefit.tiers.includes(pkg.tier);
                  return (
                    <td key={pkg.tier} className="p-4 text-center">
                      {included ? (
                        <span className="inline-flex size-7 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-success-soft)] text-[var(--color-success)]">
                          <GlyphIcon name="check" size={18} />
                          <span className="sr-only">Incluido</span>
                        </span>
                      ) : (
                        <>
                          <span
                            aria-hidden="true"
                            className="text-[var(--color-text-muted)]"
                          >
                            &ndash;
                          </span>
                          <span className="sr-only">No incluido</span>
                        </>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
