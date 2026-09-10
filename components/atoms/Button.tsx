// Polymorphic Button atom. Renders a real `<button>` by default; pass
// `as="a"` plus `href` to render an anchor styled as a button (used for the
// hero CTAs that point to `/register` and `/cfp`).

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline-on-dark";
type Size = "sm" | "md" | "lg";
/**
 * `rounded` is the default form used across page bodies. `pill` is the fully
 * rounded call-to-action used in the hero and in the closing CTA banners,
 * matching the button language of the AWS Community Day family.
 */
type Shape = "rounded" | "pill";

const VARIANT_CLASS: Record<Variant, string> = {
  primary:
    "bg-[var(--color-action)] text-[var(--color-text-on-action)] hover:bg-[var(--color-action-strong)] disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]",
  secondary:
    "bg-[var(--color-accent)] text-[var(--color-text-on-accent)] hover:bg-[var(--color-accent-strong)] disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]",
  ghost:
    "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-surface-muted)] disabled:text-[var(--color-text-muted)]",
  "outline-on-dark":
    "bg-transparent text-[var(--color-text-on-hero)] border-2 border-[var(--color-text-on-hero)] hover:bg-[var(--color-accent)] hover:text-[var(--color-text-on-accent)] hover:border-[var(--color-accent)] disabled:text-[var(--color-text-muted)] disabled:border-[var(--color-text-muted)]",
};

const SIZE_CLASS: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

const SHAPE_CLASS: Record<Shape, string> = {
  rounded: "rounded-[var(--radius-md)]",
  pill: "rounded-[var(--radius-pill)]",
};

// The hover lift is a transform, so the global `prefers-reduced-motion` rule
// removes the transition without removing the affordance.
const BASE_CLASS =
  "inline-flex items-center justify-center gap-2 font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  shape?: Shape;
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
    shape = "rounded",
    className,
  } = props;

  const cls = cn(
    BASE_CLASS,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    SHAPE_CLASS[shape],
    className
  );

  if (props.as === "a") {
    const {
      as: _as,
      variant: _v,
      size: _s,
      shape: _sh,
      className: _c,
      children: _ch,
      ...rest
    } = props;
    void _as;
    void _v;
    void _s;
    void _sh;
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
    shape: _sh,
    className: _c,
    children: _ch,
    type,
    disabled,
    ...rest
  } = props;
  void _as;
  void _v;
  void _s;
  void _sh;
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
