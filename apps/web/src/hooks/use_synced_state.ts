"use client";

import { useState, type Dispatch, type SetStateAction } from "react";

/**
 * Local, editable state seeded from `source` (usually query data) and reset
 * whenever `source` changes identity - e.g. a register loaded from the API
 * that the user then edits. Uses React's "adjust state while rendering"
 * pattern instead of an effect, so there is no extra render with stale state.
 */
export function useSyncedState<TSource, TState>(
  source: TSource,
  derive: (source: TSource) => TState
): [TState, Dispatch<SetStateAction<TState>>] {
  const [state, setState] = useState(() => derive(source));
  const [seenSource, setSeenSource] = useState(source);
  if (seenSource !== source) {
    setSeenSource(source);
    setState(derive(source));
  }
  return [state, setState];
}
