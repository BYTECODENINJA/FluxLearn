import type { ReactElement } from "react";

import { cn } from "@/lib/utils";

/**
 * Shared geometry for the on-page mark and the raster icons.
 * Hex values match --logo / --primary / --accent. next/og cannot read CSS variables.
 */
export const LOGO_HEX = {
  indigo: "#292899",
  cyan: "#27c4e5",
  yellow: "#fcc943",
  paper: "#ffffff",
} as const;

export const LOGO_PATH = {
  base: "M3.2 20.7h25.6c.62 0 .98.62.72 1.16l-1.35 2.55c-.2.38-.6.64-1.02.64H4.85c-.42 0-.82-.26-1.02-.64L2.48 21.86c-.26-.54.1-1.16.72-1.16z",
  pageLeft:
    "M10.3 8.7c1.7-1.15 3.4-1.2 4.9.4v6.6c-1.65-1.05-3.25-1-4.9.35V8.7z",
  pageRight:
    "M21.7 8.7c-1.7-1.15-3.4-1.2-4.9.4v6.6c1.65-1.05 3.25-1 4.9.35V8.7z",
  ribbon: "M18.15 6.35h2.15v4.2l-1.08-.78-1.07.78z",
} as const;

export const LOGO_SCREEN = {
  x: 6.2,
  y: 4,
  width: 19.6,
  height: 16.6,
  rx: 2.4,
} as const;
export const LOGO_DISPLAY = {
  x: 7.8,
  y: 5.5,
  width: 16.4,
  height: 12.6,
  rx: 1.15,
} as const;
export const LOGO_HINGE = {
  x: 13.5,
  y: 20.15,
  width: 5,
  height: 1.35,
  rx: 0.4,
} as const;

/** Flat mark for favicon, Apple icon, and the Open Graph image. */
export function LogoArt({ size }: { size: number }): ReactElement {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32">
      <path d={LOGO_PATH.base} fill={LOGO_HEX.indigo} />
      <rect {...LOGO_SCREEN} fill={LOGO_HEX.indigo} />
      <rect {...LOGO_DISPLAY} fill={LOGO_HEX.cyan} />
      <path d={LOGO_PATH.pageLeft} fill={LOGO_HEX.paper} />
      <path d={LOGO_PATH.pageRight} fill={LOGO_HEX.paper} />
      <path d={LOGO_PATH.ribbon} fill={LOGO_HEX.yellow} />
      <rect {...LOGO_HINGE} fill={LOGO_HEX.yellow} />
    </svg>
  );
}

export function LogoMark({ className }: { className?: string }): ReactElement {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-9 shrink-0", className)}
      aria-hidden
    >
      <path d={LOGO_PATH.base} className="fill-logo" />
      <rect {...LOGO_SCREEN} className="fill-logo" />
      <rect {...LOGO_DISPLAY} className="fill-primary" />
      <path d={LOGO_PATH.pageLeft} className="fill-white" />
      <path d={LOGO_PATH.pageRight} className="fill-white" />
      <path d={LOGO_PATH.ribbon} className="fill-accent" />
      <rect {...LOGO_HINGE} className="fill-accent" />
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
        <span className="block truncate text-[15px] font-bold tracking-tight">
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
