"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ReducedMotionState = {
  /** Real device preference. Meaningless until `ready` is true. */
  reduced: boolean;
  /** False until the real matchMedia reading has replaced the SSR-safe default. */
  ready: boolean;
};

/**
 * Single matchMedia subscription shared by every animated component, per
 * TRD.md §9: "implemented as a global React context/hook, not duplicated
 * per-component logic." `reduced` defaults to true (motion off) until
 * mounted, so server-rendered markup and first paint never assume motion
 * is safe. Consumers that make a one-time, non-reactive decision at mount
 * (the name intro deciding whether to play at all; Reveal deciding which
 * variant to mount) must wait for `ready` before reading `reduced` --
 * otherwise they see the safe-default `true` on that first render and,
 * because the decision doesn't get revisited, can get stuck treating a
 * regular visitor as if they had reduced motion set. See Reveal.tsx for
 * a fuller writeup of that failure mode; use `ready` here instead of
 * duplicating the wait in every consumer.
 */
const ReducedMotionContext = createContext<ReducedMotionState>({
  reduced: true,
  ready: false,
});

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ReducedMotionState>({ reduced: true, ready: false });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setState({ reduced: query.matches, ready: true });

    const handleChange = (event: MediaQueryListEvent) =>
      setState({ reduced: event.matches, ready: true });
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={state}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

/** Reactive reading, safe to use for ongoing styling decisions. */
export function useReducedMotion() {
  return useContext(ReducedMotionContext).reduced;
}

/** For one-time, non-reactive decisions made at mount: wait for this before reading reduced. */
export function useReducedMotionReady() {
  return useContext(ReducedMotionContext).ready;
}
