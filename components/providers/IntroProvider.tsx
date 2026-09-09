"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useState } from "react";
import {
  useReducedMotion,
  useReducedMotionReady,
} from "@/components/providers/ReducedMotionProvider";

type IntroMode = "full" | "simple" | "settled";

declare global {
  interface Window {
    /** Set once, synchronously, by layout.tsx's blocking script -- read-only here. */
    __introMode?: IntroMode;
  }
}

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

  useLayoutEffect(() => {
    // Wait for the real reduced-motion reading (see ReducedMotionProvider):
    // deciding on the SSR-safe default here would risk always skipping the
    // intro for regular visitors too.
    if (!ready || decided) return;

    // The actual decision (and the sessionStorage read/write behind it)
    // already happened once, synchronously, in layout.tsx's blocking
    // script -- window.__introMode is read-only here on purpose. Deciding
    // it again in this effect, from sessionStorage directly, is what used
    // to let React Strict Mode's dev-only double effect invocation see
    // its own prior write and skip the intro on the second pass. Reading
    // a value that was only ever written once is safe to do twice.
    const decidedMode =
      (typeof window !== "undefined" && window.__introMode) || "settled";

    if (decidedMode !== "settled") {
      setMode(reducedMotion ? "simple" : decidedMode);
      setIntroDone(false);
    }

    // Hands off from layout.tsx's blocking script: by now mode/introDone
    // above are set correctly for this render, so either real content is
    // already visible (mode stayed "settled") or NameIntro/IntroSimple are
    // about to cover it themselves. Safe to stop hiding it via the CSS
    // class either way, whichever mode was decided. useLayoutEffect (not
    // useEffect) so this resolves before the browser paints this commit,
    // not after -- the gap between those two is the other half of what
    // could let real content flash before the intro covers it.
    document.documentElement.classList.remove("intro-pending");

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
