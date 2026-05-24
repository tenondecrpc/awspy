// Polymorphic Button atom. Renders a real `<button>` by default; pass
// `as="a"` plus `href` to render an anchor styled as a button (used for the
// hero CTAs that point to `/register` and `/cfp`).

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-[var(--color-action)] text-[var(--color-text-on-action)] hover:bg-[var(--color-action-strong)] disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]",
  secondary:
    "bg-[var(--color-accent)] text-[var(--color-text-on-accent)] hover:bg-[var(--color-accent-strong)] disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]",
  ghost:
    "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold transition-colors disabled:cursor-not-allowed";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    as?: "button";
  };

type ButtonAsAnchor = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    as: "a";
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsAnchor;

export function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className,
  } = props;

  const cls = cn(BASE_CLASS, VARIANT_CLASS[variant], SIZE_CLASS[size], className);

  if (props.as === "a") {
    const { as: _as, variant: _v, size: _s, className: _c, children: _ch, ...rest } =
      props;
    void _as;
    void _v;
    void _s;
    void _c;
    void _ch;
    return (
      <a
        className={cls}
        // When a button-styled link is disabled, communicate it to AT and the
        // browser without using color alone (constitution Principle VI).
        aria-disabled={rest["aria-disabled"]}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const {
    as: _as,
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    type,
    disabled,
    ...rest
  } = props;
  void _as;
  void _v;
  void _s;
  void _c;
  void _ch;

  return (
    <button
      type={type ?? "button"}
      disabled={disabled}
      aria-disabled={disabled || undefined}
      className={cls}
      {...rest}
    >
      {children}
    </button>
  );
}
