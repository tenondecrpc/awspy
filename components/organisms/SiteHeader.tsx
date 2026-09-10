"use client";

// Site-wide header. Includes a skip link, the brand mark, the desktop nav,
// and a mobile drawer with focus-trapped open state, Escape-to-close, and
// click-outside-to-close.

import { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import { Container } from "@/components/atoms/Container";
import { ThemeToggle } from "@/components/atoms/ThemeToggle";
import { NavLink } from "@/components/molecules/NavLink";
import { EditionPill } from "@/components/molecules/EditionPill";
import { PRIMARY_NAV } from "@/lib/nav";
import { cn } from "@/lib/utils/cn";

type SiteHeaderProps = {
  editionYear: string;
};

export function SiteHeader({ editionYear }: SiteHeaderProps) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  // Close on Escape; restore focus to the trigger.
  useEffect(() => {
    if (!isDrawerOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        setDrawerOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isDrawerOpen]);

  // Move focus into the drawer when it opens; restore to the trigger on close.
  useEffect(() => {
    if (isDrawerOpen) {
      closeBtnRef.current?.focus();
    } else {
      triggerRef.current?.focus({ preventScroll: true });
    }
  }, [isDrawerOpen]);

  return (
    <header
      className="sticky top-0 z-40 border-b border-[var(--color-surface-muted)] bg-[var(--color-surface)]"
      role="banner"
    >
      <a href="#contenido-principal" className="skip-link">
        Saltar al contenido
      </a>
      <Container>
        <div className="flex h-16 items-center justify-between gap-4">
          <NextLink
            href="/"
            className="flex items-center gap-2 whitespace-nowrap font-bold tracking-tight"
          >
            <span aria-hidden="true">AWS</span>
            <span className="hidden sm:inline">Community Day</span>
            <span>Paraguay</span>
            <EditionPill year={editionYear} className="hidden sm:inline-flex" />
          </NextLink>

          <nav aria-label="Navegación principal" className="hidden xl:block">
            <ul className="flex items-center gap-1">
              {PRIMARY_NAV.map((entry) => (
                <li key={entry.href}>
                  <NavLink href={entry.href}>{entry.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              ref={triggerRef}
              type="button"
              className={cn(
                "xl:hidden inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] px-3 py-2 text-sm font-semibold",
                "border border-[var(--color-border-strong)]"
              )}
              aria-label="Abrir menú"
              aria-expanded={isDrawerOpen}
              aria-controls="mobile-nav-drawer"
              onClick={() => setDrawerOpen(true)}
            >
              Menú
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile drawer */}
      {isDrawerOpen ? (
        <div
          className="fixed inset-0 z-50 bg-[var(--color-overlay)]"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDrawerOpen(false);
          }}
          role="presentation"
        >
          <div
            ref={drawerRef}
            id="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Navegación principal"
            className="ml-auto h-full w-[min(20rem,80vw)] bg-[var(--color-surface)] p-6 shadow-xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-bold">AWS Community Day Paraguay</span>
              <button
                ref={closeBtnRef}
                type="button"
                aria-label="Cerrar menú"
                className="inline-flex min-h-11 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] px-3 py-2 text-sm font-semibold"
                onClick={() => setDrawerOpen(false)}
              >
                Cerrar
              </button>
            </div>
            <nav aria-label="Navegación principal">
              <ul className="flex flex-col gap-2">
                {PRIMARY_NAV.map((entry) => (
                  <li key={entry.href}>
                    <NavLink
                      href={entry.href}
                      onNavigate={() => setDrawerOpen(false)}
                      className="w-full"
                    >
                      {entry.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
