"use client";

import { useSyncExternalStore } from "react";
import { isColorTheme, THEME_STORAGE_KEY, type ColorTheme } from "@/lib/theme";

const THEME_CHANGE_EVENT = "awscdpy:theme-change";

function getActiveTheme(): ColorTheme {
  const current = document.documentElement.dataset.theme;
  if (isColorTheme(current)) return current;
  return typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
      return () =>
        window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    },
    getActiveTheme,
    () => undefined
  );

  function toggleTheme() {
    const current = theme ?? getActiveTheme();
    const next = current === "dark" ? "light" : "dark";
    const root = document.documentElement;

    root.dataset.theme = next;
    root.style.colorScheme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // The in-page choice still works when storage is blocked by the browser.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      type="button"
      aria-label="Cambiar entre modo claro y oscuro"
      aria-pressed={theme === undefined ? undefined : theme === "dark"}
      title="Cambiar tema de color"
      onClick={toggleTheme}
      className="inline-flex size-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent-strong)]"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="theme-toggle__sun size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="theme-toggle__moon size-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.2 15.1A8.4 8.4 0 0 1 8.9 3.8 8.5 8.5 0 1 0 20.2 15.1Z" />
      </svg>
    </button>
  );
}
