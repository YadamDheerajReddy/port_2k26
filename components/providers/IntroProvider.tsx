"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  useReducedMotion,
  useReducedMotionReady,
} from "@/components/providers/ReducedMotionProvider";

const SESSION_KEY = "intro-seen";

type IntroMode = "full" | "simple" | "settled";

type IntroState = {
  /** "full": stroke-draw sequence. "simple": plain fade/scale (reduced motion). "settled": no intro, content already visible. */
  mode: IntroMode;
  /** Content stays visible (the safe default) until this flips true mid-sequence. */
  introDone: boolean;
  markDone: () => void;
};

const IntroContext = createContext<IntroState>({
  mode: "settled",
  introDone: true,
  markDone: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const ready = useReducedMotionReady();
  const reducedMotion = useReducedMotion();
  const [decided, setDecided] = useState(false);
  const [mode, setMode] = useState<IntroMode>("settled");
  const [introDone, setIntroDone] = useState(true);

  useEffect(() => {
    // Wait for the real reduced-motion reading (see ReducedMotionProvider):
    // deciding on the SSR-safe default here would risk always skipping the
    // intro for regular visitors too.
    if (!ready || decided) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      // sessionStorage unavailable (privacy mode, etc): treat as a fresh session.
    }

    if (!seen) {
      setMode(reducedMotion ? "simple" : "full");
      setIntroDone(false);
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // Nothing to persist; the intro will just replay next time. Not worth failing over.
    }
    setDecided(true);
  }, [ready, reducedMotion, decided]);

  const markDone = useCallback(() => setIntroDone(true), []);

  return (
    <IntroContext.Provider value={{ mode, introDone, markDone }}>
      {children}
    </IntroContext.Provider>
  );
}

export function useIntro() {
  return useContext(IntroContext);
}
