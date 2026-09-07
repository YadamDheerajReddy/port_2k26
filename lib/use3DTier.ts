"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

export type Tier = 1 | 2 | 3;

const NARROW_VIEWPORT_BREAKPOINT = 1024;

/**
 * TRD.md §4.3 tiered fallback, required not optional.
 * 1 (full): WebGL2, decent hardwareConcurrency, no reduced-motion, fine pointer.
 * 2 (simplified): WebGL available but weaker signals (mobile, low core count, webgl1-only).
 * 3 (static): no WebGL, or reduced-motion.
 * "Never block render waiting on this, default to Tier 2 while detecting,
 * upgrade/downgrade after mount" -- hence the hook starts at 2 and only
 * settles once the real checks have run client-side.
 */
function detectCapabilityTier(reducedMotion: boolean): Tier {
  if (reducedMotion) return 3;

  let webgl2 = false;
  let webgl1 = false;
  try {
    const canvas = document.createElement("canvas");
    webgl2 = !!canvas.getContext("webgl2");
    webgl1 = webgl2 || !!canvas.getContext("webgl");
  } catch {
    webgl1 = false;
  }
  if (!webgl1) return 3;

  const cores = navigator.hardwareConcurrency ?? 4;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

  if (webgl2 && cores >= 4 && !coarsePointer) return 1;
  return 2;
}

export function use3DTier(): Tier {
  const reducedMotion = useReducedMotion();
  const [capabilityTier, setCapabilityTier] = useState<Tier>(2);
  const [narrowViewport, setNarrowViewport] = useState(false);

  useEffect(() => {
    setCapabilityTier(detectCapabilityTier(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    // UI_UX_Brief.md §4: the hero object caps at Tier 2 below 1024px
    // regardless of device capability, to protect layout space for text.
    const query = window.matchMedia(`(max-width: ${NARROW_VIEWPORT_BREAKPOINT - 1}px)`);
    setNarrowViewport(query.matches);
    const handleChange = (event: MediaQueryListEvent) => setNarrowViewport(event.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  if (capabilityTier === 1 && narrowViewport) return 2;
  return capabilityTier;
}
