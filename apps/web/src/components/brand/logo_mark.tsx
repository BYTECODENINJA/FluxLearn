import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

/** Shared palette for the on-page mark and generated raster icons. */
export const LOGO_HEX = {
  ink: "#202124",
  red: "#e53935",
  paper: "#f6f5f2",
} as const;

function BrandGlyph({ className }: { className?: string }): ReactElement {
  return (
    <>
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="11"
        className={className ?? "fill-[#202124]"}
      />
      <path
        d="M10 28V12l10 10V12l10 10v6L20 18v10L10 18"
        stroke="var(--card, #f6f5f2)"
        strokeWidth="2.6"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="30" cy="10" r="3" fill="#e53935" />
    </>
  );
}

/** Flat mark for favicon, Apple icon, and Open Graph image. */
export function LogoArt({ size }: { size: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="1" y="1" width="38" height="38" rx="11" fill={LOGO_HEX.ink} />
      <path
        d="M10 28V12l10 10V12l10 10v6L20 18v10L10 18"
        stroke={LOGO_HEX.paper}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="10" r="3" fill={LOGO_HEX.red} />
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }): ReactElement {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9 shrink-0", className)}
      aria-hidden
    >
      <BrandGlyph className="fill-logo" />
    </svg>
  );
}

/** Icon plus the two-line school wordmark used on the public site. */
export function LogoLockup({
  className,
  markClassName,
  compact = false,
}: {
  className?: string;
  markClassName?: string;
  /** Hide the "Online School" line on the smallest screens. */
  compact?: boolean;
}): ReactElement {
  return (
    <span className={cn("flex min-w-0 items-center gap-2.5", className)}>
      <LogoMark className={markClassName} />
      <span className="min-w-0 leading-none">
        <span className="block truncate font-serif text-[15px] font-bold tracking-tight">
          fluxlearn
        </span>
        <span
          className={cn(
            "text-muted-foreground mt-1 block text-[11px]",
            compact && "hidden sm:block"
          )}
        >
          Online School
        </span>
      </span>
    </span>
  );
}
