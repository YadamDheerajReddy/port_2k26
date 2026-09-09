"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

type Waypoint = { x: number; y: number; scale: number; opacity: number };

// One waypoint per section, in page order: where the glow settles while
// that section fills the middle of the viewport. x/y are offsets in px
// from dead-center. About and Contact dip opacity near zero rather than
// repositioning off-screen -- both are theme-paper (styles/tokens.css's
// "breather" convention), and their own opaque background already paints
// over this glow (it sits at -z-10, behind all page content); fading it
// out first means it isn't snapping back at full strength the instant a
// sliver of the next dark section peeks into view.
const SECTION_WAYPOINTS: Record<string, Waypoint> = {
  top: { x: 0, y: 0, scale: 1, opacity: 0.5 },
  about: { x: -180, y: 60, scale: 0.85, opacity: 0.05 },
  work: { x: 220, y: -40, scale: 1.15, opacity: 0.4 },
  skills: { x: -240, y: 30, scale: 0.95, opacity: 0.4 },
  process: { x: 200, y: -20, scale: 1.1, opacity: 0.4 },
  contact: { x: 0, y: 0, scale: 0.85, opacity: 0.05 },
};
const SECTION_IDS = Object.keys(SECTION_WAYPOINTS);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/**
 * The single ember glow that used to sit fixed behind the Hero name now
 * travels the whole page: one persistent element, position:fixed at the
 * root (mounted in layout.tsx, not inside Hero), whose offset/scale/
 * opacity are driven by scroll position instead of a per-section replica.
 *
 * Deliberately a plain window scroll listener + manually-set motion
 * values, not Motion's useScroll/useTransform: the waypoints are measured
 * from real DOM elements (each section's own midpoint), not fixed
 * fractions, so the mapping has to be rebuilt from actual layout, and a
 * plain ref + listener is the simplest way to do that without fighting
 * useTransform's need for a fixed input range up front. Lenis (see
 * SmoothScrollProvider) drives the real window.scrollY, not a virtualized
 * position, so a native "scroll" listener already reflects its smoothing
 * with no special integration.
 *
 * Each motion value is wrapped in a slow, heavily-damped spring (not the
 * tight cursor-follow config used elsewhere) so the glow drifts to its
 * next waypoint rather than tracking the scroll position frame-for-frame
 * -- ambient light easing into place, not something snapping to the
 * cursor.
 *
 * -z-10 on the outer wrapper, not the animated element itself, for the
 * same reason as Hero's old parallax wrapper: escaping to the page's
 * root stacking context (nothing between this and <body> establishes its
 * own) is exactly what's wanted here -- behind every section's content,
 * naturally occluded by About/Contact's own opaque theme-paper background
 * without any extra opacity logic, and still showing through the dark
 * sections, which paint no background of their own.
 */
export function ScrollGlow() {
  const reducedMotion = useReducedMotion();

  const x = useMotionValue(SECTION_WAYPOINTS.top.x);
  const y = useMotionValue(SECTION_WAYPOINTS.top.y);
  const scale = useMotionValue(SECTION_WAYPOINTS.top.scale);
  const opacity = useMotionValue(SECTION_WAYPOINTS.top.opacity);

  const springConfig = { damping: 40, stiffness: 55, mass: 1.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  const springScale = useSpring(scale, springConfig);
  const springOpacity = useSpring(opacity, springConfig);

  const waypointsRef = useRef<(Waypoint & { frac: number })[]>([]);

  useEffect(() => {
    if (reducedMotion) return;

    function measure() {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;

      waypointsRef.current = SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        const center = el
          ? el.offsetTop + el.offsetHeight / 2 - window.innerHeight / 2
          : 0;
        const frac = Math.min(1, Math.max(0, center / total));
        return { frac, ...SECTION_WAYPOINTS[id] };
      });
    }

    function applyScroll() {
      const points = waypointsRef.current;
      if (points.length < 2) return;

      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;

      let i = 0;
      while (i < points.length - 2 && progress > points[i + 1].frac) i++;
      const a = points[i];
      const b = points[i + 1];
      const t = b.frac === a.frac ? 0 : (progress - a.frac) / (b.frac - a.frac);
      const clampedT = Math.min(1, Math.max(0, t));

      x.set(lerp(a.x, b.x, clampedT));
      y.set(lerp(a.y, b.y, clampedT));
      scale.set(lerp(a.scale, b.scale, clampedT));
      opacity.set(lerp(a.opacity, b.opacity, clampedT));
    }

    function handleResize() {
      measure();
      applyScroll();
    }

    measure();
    applyScroll();
    window.addEventListener("scroll", applyScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", applyScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [reducedMotion, x, y, scale, opacity]);

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none fixed top-1/2 left-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        aria-hidden
        className="h-[clamp(320px,80vw,700px)] w-[clamp(320px,80vw,700px)] rounded-full"
        style={{
          x: springX,
          y: springY,
          scale: springScale,
          opacity: springOpacity,
          background:
            "radial-gradient(circle, var(--color-ember) 0%, var(--color-ember) 25%, transparent 70%)",
        }}
      />
    </div>
  );
}
