"use client";

import { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import type { Project } from "@/lib/content";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

/**
 * Condenses into a slim pinned bar once the hero scrolls out of view, so
 * which project you're reading never gets lost further down the page.
 * Sits at z-40, below Nav's z-50 -- Nav's floating pill can sit visually
 * in front of this bar's corner without any clipping fight.
 *
 * IntersectionObserver against the default root (the real viewport): this
 * site drives actual window scroll via Lenis (SmoothScrollProvider.tsx),
 * not a virtualized one, so the plain default-root observer Nav.tsx
 * already uses for its own scroll-spy is the right tool here too -- no
 * custom scroll container needed, unlike the concept mockup's demo frame.
 */
export function CaseStudyStickyBar({
  project,
  heroRef,
}: {
  project: Project;
  heroRef: React.RefObject<HTMLDivElement | null>;
}) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [{ y }, api] = useSpring(() => ({
    y: -100,
    config: { tension: 300, friction: 30 },
  }));

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      {
        rootMargin: "-90px 0px 0px 0px",
      },
    );
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [heroRef]);

  useEffect(() => {
    api.start({ y: visible ? 0 : -100, immediate: reducedMotion });
  }, [visible, api, reducedMotion]);

  return (
    <animated.div
      style={{ transform: y.to((v) => `translateY(${v}%)`) }}
      className="fixed inset-x-0 top-0 z-40 flex items-center border-b border-[var(--border-subtle)] bg-[rgba(247,242,233,0.97)] px-6 py-3 backdrop-blur-md md:px-10"
    >
      <span className="font-display text-ink text-[15px] font-semibold">
        {project.title}
      </span>
    </animated.div>
  );
}
