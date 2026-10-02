// Sponsorship packages organism. The prospectus comparison table: one column
// per package, one row per benefit.
//
// It is a real `<table>` because the content is tabular - a benefit read
// against a package - and a screen reader needs the row and column headers to
// say which cell it is on. The mark is decorative; every cell also carries a
// visually hidden "Incluido" / "No incluido", so inclusion never rests on an
// icon or a color alone (constitution Principle VI).
//
// The tier color heads each column and tints its included marks, so the eye
// can run down a package. Ten rows of prose never fit a phone, so the table
// scrolls horizontally inside its own container and is focusable, which is
// what lets a keyboard user scroll it.

import { GlyphIcon } from "@/components/atoms/GlyphIcon";
import { TIER_COLOR, TIER_LABEL } from "@/lib/utils/sponsor-tiers";
import type { Sponsorship } from "@/lib/content/sponsorship";

type SponsorshipPackagesProps = {
  packages: Sponsorship["packages"];
  benefits: Sponsorship["benefits"];
  /** When given, a "Consultar" link closes each column. */
  actionHref?: (tier: Sponsorship["packages"][number]["tier"]) => string;
};

const tint = (tier: string, pct: number) =>
  `color-mix(in srgb, ${TIER_COLOR[tier as keyof typeof TIER_COLOR]} ${pct}%, transparent)`;

export function SponsorshipPackages({
  packages,
  benefits,
  actionHref,
}: SponsorshipPackagesProps) {
  if (packages.length === 0 || benefits.length === 0) return null;

  return (
    <>
      {/* Only the narrow viewports actually clip the table. */}
      <p className="mb-3 text-sm text-[var(--color-text-secondary)] lg:hidden">
        Deslizá la tabla para ver todos los paquetes.
      </p>

      <div
        className="relative overflow-x-auto bg-[var(--color-surface-elevated)]"
        tabIndex={0}
        role="group"
        aria-label="Tabla de paquetes de patrocinio"
      >
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <caption className="sr-only">
            Beneficios incluidos en cada paquete de patrocinio
          </caption>
          <thead>
            <tr>
              <th
                scope="col"
                className="w-[36%] p-4 align-bottom text-sm font-semibold text-[var(--color-text-secondary)]"
              >
                Beneficio
              </th>
              {packages.map((pkg, i) => {
                const total = benefits.filter((b) =>
                  b.tiers.includes(pkg.tier)
                ).length;
                return (
                  <th
                    key={pkg.tier}
                    scope="col"
                    style={{
                      borderTop: `0.375rem solid ${TIER_COLOR[pkg.tier]}`,
                      background: tint(pkg.tier, 16),
                    }}
                    className="p-4 text-center align-bottom"
                  >
                    <span className="flex flex-col items-center gap-1">
                      <span className="flex items-center text-[var(--color-text-primary)]">
                        {Array.from({ length: packages.length - i }).map(
                          (_, g) => (
                            <GlyphIcon
                              key={g}
                              name="gem"
                              size={16}
                              className={g > 0 ? "-ml-1" : ""}
                            />
                          )
                        )}
                      </span>
                      <span className="font-display text-step-1 font-normal leading-tight text-[var(--color-text-primary)]">
                        {TIER_LABEL[pkg.tier]}
                      </span>
                      <span className="text-xs font-normal text-[var(--color-text-secondary)]">
                        {total} de {benefits.length} beneficios
                      </span>
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {benefits.map((benefit) => (
              <tr
                key={benefit.label}
                className="border-t border-[var(--color-border-subtle)]"
              >
                <th
                  scope="row"
                  className="p-4 text-sm font-normal leading-[1.45] text-[var(--color-text-primary)]"
                >
                  {benefit.label}
                </th>
                {packages.map((pkg) => {
                  const included = benefit.tiers.includes(pkg.tier);
                  return (
                    <td
                      key={pkg.tier}
                      style={{ background: tint(pkg.tier, 6) }}
                      className="p-4 text-center"
                    >
                      {included ? (
                        <span
                          style={{ background: tint(pkg.tier, 35) }}
                          className="inline-grid h-7 w-7 place-items-center rounded-full text-[var(--color-text-primary)]"
                        >
                          <GlyphIcon name="check" size={16} />
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
          {actionHref ? (
            <tfoot>
              <tr className="border-t border-[var(--color-border-subtle)]">
                <td className="p-4" />
                {packages.map((pkg) => (
                  <td
                    key={pkg.tier}
                    style={{ background: tint(pkg.tier, 6) }}
                    className="p-4 text-center"
                  >
                    <a
                      href={actionHref(pkg.tier)}
                      className="inline-flex min-h-11 items-center justify-center border border-[var(--color-text-primary)] px-4 text-sm font-semibold text-[var(--color-text-primary)] hover:bg-[var(--color-text-primary)] hover:text-[var(--color-surface-elevated)]"
                    >
                      Consultar
                      <span className="sr-only">
                        {" "}
                        nivel {TIER_LABEL[pkg.tier]}
                      </span>
                    </a>
                  </td>
                ))}
              </tr>
            </tfoot>
          ) : null}
        </table>
      </div>
    </>
  );
}
