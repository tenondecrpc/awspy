"use client";

// Floating Kiro mascot — a WhatsApp-style bubble pinned to the bottom-right
// corner on every page. It hosts the animated mesh-gradient creature (the
// "bichito") and, when clicked, opens a small chat panel.
//
// The chat is deliberately NOT a live agent: there is no backend on this site.
// It is a preselected FAQ dressed as a conversation. The visitor taps one of
// the suggested questions and Kiro "answers" with the matching FAQ entry, so
// it reads like a chat while staying fully static and offline-safe. The FAQ
// entries are the same ones seeded in `content/editions/{year}/faq.json` and
// rendered on the `/faq` page; the layout passes them in so the two stay in
// sync.
//
// Motion is suppressed for users who prefer reduced motion via the global CSS
// rule in `app/globals.css`.

import { useEffect, useId, useRef, useState } from "react";
import { MeshGradientSVG } from "@/components/ui/shader-svg";
import { cn } from "@/lib/utils/cn";
import type { FAQItem } from "@/lib/content/faq";

type ChatMessage = {
  id: string;
  from: "kiro" | "visitor";
  text: string;
};

const GREETING =
  "¡Hola! Soy Kiro 👋 Tocá una pregunta y te cuento lo que sé del Community Day.";

type KiroMascotProps = {
  /** Preselected FAQ used as the conversation script. */
  faq?: FAQItem[];
};

export function KiroMascot({ faq = [] }: KiroMascotProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "greeting", from: "kiro", text: GREETING },
  ]);
  // Questions the visitor has not asked yet, offered as tappable suggestions.
  const [remaining, setRemaining] = useState<FAQItem[]>(faq);

  const reactId = useId();
  const panelId = `kiro-chat-${reactId}`;
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // Keep the transcript scrolled to the latest message.
  useEffect(() => {
    if (open && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages, open]);

  // Escape closes the panel and returns focus to the toggle button. A click
  // outside the widget also closes it, matching the usual popover behaviour.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function handleAsk(item: FAQItem) {
    setMessages((prev) => [
      ...prev,
      { id: `q-${item.id}`, from: "visitor", text: item.question },
      { id: `a-${item.id}`, from: "kiro", text: item.answer },
    ]);
    setRemaining((prev) => prev.filter((f) => f.id !== item.id));
  }

  return (
    <div
      ref={rootRef}
      className="group/kiro fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6"
    >
      {open && (
        <div
          id={panelId}
          role="dialog"
          aria-label="Chat de preguntas frecuentes con Kiro"
          className="flex w-[min(20rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-[var(--radius-lg)] bg-[var(--color-surface-elevated)] shadow-xl ring-1 ring-[var(--color-border-subtle)]"
        >
          {/* Header: small mesh-gradient avatar + name + close control. */}
          <div className="flex items-center gap-3 border-b border-[var(--color-border-subtle)] px-4 py-3">
            <span
              aria-hidden="true"
              className="size-9 shrink-0 rounded-[var(--radius-pill)] p-0.5"
            >
              <MeshGradientSVG className="h-full w-full" speed={1.2} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                Kiro
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Preguntas frecuentes
              </span>
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label="Cerrar chat"
              className="ml-auto rounded-[var(--radius-pill)] p-1 text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              <span aria-hidden="true" className="block text-lg leading-none">
                ×
              </span>
            </button>
          </div>

          {/* Transcript. Announced politely so screen readers hear new
              answers without stealing focus from the suggestion buttons. */}
          <div
            ref={logRef}
            aria-live="polite"
            className="kiro-chat-scroll flex max-h-72 flex-col gap-2 overflow-y-auto px-4 py-3"
          >
            {messages.map((message) => (
              <p
                key={message.id}
                className={cn(
                  "max-w-[85%] rounded-[var(--radius-lg)] px-3 py-2 text-sm",
                  message.from === "kiro"
                    ? "self-start bg-[var(--color-surface-muted)] text-[var(--color-text-primary)]"
                    : "self-end bg-[var(--color-accent)] text-[var(--color-text-on-accent)]"
                )}
              >
                {message.text}
              </p>
            ))}
          </div>

          {/* Suggested questions. When every entry has been asked, Kiro points
              the visitor to the full FAQ page instead of leaving a dead end. */}
          <div className="flex flex-col gap-2 border-t border-[var(--color-border-subtle)] px-4 py-3">
            {remaining.length > 0 ? (
              remaining.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAsk(item)}
                  className="rounded-[var(--radius-pill)] border border-[var(--color-border-subtle)] px-3 py-1.5 text-left text-sm text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  {item.question}
                </button>
              ))
            ) : (
              <p className="text-sm text-[var(--color-text-secondary)]">
                Esas eran mis preguntas frecuentes. Para más detalles visitá la{" "}
                <a
                  href="/faq"
                  className="font-semibold text-[var(--color-accent)] underline"
                >
                  página de FAQ
                </a>
                .
              </p>
            )}
          </div>
        </div>
      )}

      {/* Greeting bubble, revealed on hover / keyboard focus of the button.
          Hidden while the chat panel is open so it does not overlap it. */}
      {!open && (
        <span
          role="status"
          className="pointer-events-none translate-y-1 rounded-[var(--radius-pill)] bg-[var(--color-surface-elevated)] px-3 py-1.5 text-sm font-semibold text-[var(--color-text-primary)] opacity-0 shadow-lg ring-1 ring-[var(--color-border-subtle)] transition-all duration-200 group-hover/kiro:translate-y-0 group-hover/kiro:opacity-100 group-focus-within/kiro:translate-y-0 group-focus-within/kiro:opacity-100"
        >
          ¡Hola! Soy Kiro 👋
        </span>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Cerrar chat de Kiro" : "Abrir chat de Kiro"}
        className="size-16 shrink-0 rounded-[var(--radius-pill)] p-1 transition-transform duration-200 hover:-translate-y-0.5 hover:scale-105 active:scale-95 motion-reduce:transform-none sm:size-[72px]"
      >
        <MeshGradientSVG className="relative h-full w-full" speed={1.2} />
      </button>
    </div>
  );
}
