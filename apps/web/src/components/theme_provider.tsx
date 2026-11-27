"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import type { ReactElement } from "react";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps): ReactElement {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="fluxlearn-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
