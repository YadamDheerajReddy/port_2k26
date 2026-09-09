"use client";

import { useEffect, useRef } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

const MAX_PULL = 46;
const PULL_RATIO = 0.3;
const RELEASE_DELAY_MS = 140;
const BOTTOM_TOLERANCE_PX = 2;

/**
 * Rubber-band overscroll: once the page is fully scrolled and the visitor
 * keeps scrolling down, the footer gets pulled up past its resting place
 * and springs back -- the classic bounce, built by hand because Locomotive/
 * Lenis (SmoothScrollProvider.tsx) drives real window scroll and clamps it
 * at the bottom, so the browser's own native overscroll never fires here.
 *
 * Wheel-only, not touch: trackpad/mouse wheel scrolling has no distinct
 * "release" event the way a touch gesture does, so the 140ms idle gap
 * between wheel ticks stands in for one -- another tick arriving before
 * that timer fires keeps building the pull instead of springing back.
 */
export function FooterBounce({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const pullRef = useRef(0);
  const releaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [{ y }, api] = useSpring(() => ({
    y: 0,
    config: { tension: 300, friction: 22 },
  }));

  useEffect(() => {
    if (reducedMotion) return;

    function handleWheel(event: WheelEvent) {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - BOTTOM_TOLERANCE_PX;

      if (atBottom && event.deltaY > 0) {
        pullRef.current = Math.min(MAX_PULL, pullRef.current + event.deltaY * PULL_RATIO);
        api.start({ y: -pullRef.current });

        if (releaseTimer.current) clearTimeout(releaseTimer.current);
        releaseTimer.current = setTimeout(() => {
          pullRef.current = 0;
          api.start({ y: 0, config: { tension: 210, friction: 14 } });
        }, RELEASE_DELAY_MS);
        return;
      }

      if (pullRef.current > 0) {
        pullRef.current = 0;
        api.start({ y: 0 });
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      if (releaseTimer.current) clearTimeout(releaseTimer.current);
    };
  }, [reducedMotion, api]);

  return (
    <animated.footer
      style={reducedMotion ? undefined : { y }}
      className="bg-[var(--color-ink)] px-6 py-16 md:py-20"
    >
      {children}
    </animated.footer>
  );
}
