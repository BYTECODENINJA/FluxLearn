"use client";

import { useHydrated } from "@/hooks/use_hydrated";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ThemeWipe = "light" | "dark";

function applyTheme(next: ThemeWipe, setTheme: (value: string) => void): void {
  const root = document.documentElement;
  root.dataset.themeWipe = next;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Apply the class in the same turn as the view transition. next-themes
  // writes the class in an effect, which is too late for the snapshot.
  const update = () => {
    root.classList.toggle("dark", next === "dark");
    root.style.colorScheme = next;
    setTheme(next);
  };
  const start = (
    document as Document & {
      startViewTransition?: (update: () => void) => void;
    }
  ).startViewTransition;
  if (reduce || typeof start !== "function") {
    update();
    return;
  }
  start.call(document, update);
}

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonClass = cn(
    "size-10 rounded-full transition-colors duration-150 ease-out",
    className
  );

  const mounted = useHydrated();

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Toggle theme"
        className={cn(buttonClass, "opacity-0")}
        disabled
      >
        <Sun />
      </Button>
    );
  }

  const dark = resolvedTheme === "dark";
  const next: ThemeWipe = dark ? "light" : "dark";
  const Icon = dark ? Moon : Sun;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={buttonClass}
      onClick={() => applyTheme(next, setTheme)}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <Icon key={next} className="fluxlearn-theme-icon" aria-hidden />
    </Button>
  );
}
