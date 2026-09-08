"use client";

import { useEffect } from "react";
import LocomotiveScroll from "locomotive-scroll";
import "locomotive-scroll/dist/locomotive-scroll.css";
import {
  useReducedMotion,
  useReducedMotionReady,
} from "@/components/providers/ReducedMotionProvider";

/**
 * Wires up Locomotive Scroll (v5, a thin parallax/viewport-detection layer
 * over Lenis) for inertia-smoothed scrolling and the data-scroll-speed
 * parallax used around the site. Renders nothing, it's a lifecycle-only
 * component mounted once at the app root.
 *
 * v5 needs no wrapper/content element or `data-scroll-container`: unlike
 * the old v4, it drives the real window scroll position via Lenis rather
 * than transforming a content div, so it doesn't fight position:fixed
 * elements (Nav, CustomCursor) and the native scrollbar keeps working.
 *
 * Gated on reduced-motion the same way as every other motion piece here:
 * `useReducedMotionReady` before reading `reduced`, so the SSR-safe
 * default is "off" and this only starts smoothing once it has actually
 * confirmed the visitor hasn't asked for reduced motion. `.locomotive-active`
 * on <html> flips off the CSS `scroll-behavior: smooth` fallback in
 * globals.css while this is running, so a stray native anchor jump can't
 * fight Lenis's own scrollTo (used via data-scroll-to in Nav.tsx) for the
 * same scroll.
 */
export function SmoothScrollProvider() {
  const ready = useReducedMotionReady();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ready || reducedMotion) return;

    const scroll = new LocomotiveScroll({
      lenisOptions: {
        lerp: 0.1,
        wheelMultiplier: 1,
      },
    });
    document.documentElement.classList.add("locomotive-active");

    return () => {
      scroll.destroy();
      document.documentElement.classList.remove("locomotive-active");
    };
  }, [ready, reducedMotion]);

  return null;
}
