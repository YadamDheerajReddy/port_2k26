"use client";

import { createContext, useContext, useEffect, useState } from "react";

/**
 * Single matchMedia subscription shared by every animated component, per
 * TRD.md §9: "implemented as a global React context/hook, not duplicated
 * per-component logic." Defaults to true (motion off) until mounted, so
 * server-rendered markup and first paint never assume motion is safe.
 */
const ReducedMotionContext = createContext(true);

export function ReducedMotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);

    const handleChange = (event: MediaQueryListEvent) => setReduced(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  return (
    <ReducedMotionContext.Provider value={reduced}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

export function useReducedMotion() {
  return useContext(ReducedMotionContext);
}
