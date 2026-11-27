"use client";

import { useSyncExternalStore } from "react";

const subscribeNever = () => () => undefined;

/**
 * False during the server render and hydration, true on the client after.
 * For UI that depends on browser-only state (theme, window), so the server
 * and first client render match.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  );
}

/** `window.location.origin` on the client, "" on the server. */
export function useOrigin(): string {
  return useSyncExternalStore(
    subscribeNever,
    () => window.location.origin,
    () => ""
  );
}

function subscribeHash(onChange: () => void): () => void {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

/** The URL hash without "#", kept in sync with navigation. "" on the server. */
export function useLocationHash(): string {
  return useSyncExternalStore(
    subscribeHash,
    () => window.location.hash.replace(/^#/u, ""),
    () => ""
  );
}
