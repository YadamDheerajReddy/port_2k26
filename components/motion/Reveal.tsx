"use client";

import { useEffect, useState } from "react";
import { motion, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

/** Animation_system.md §5: opacity 0->1, y 32px->0, viewport once:true margin:"-15% 0px". */
const item: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.65, 0, 0.35, 1] } },
};

/**
 * Waits for a real (not the SSR-safe default) reduced-motion reading
 * before deciding whether to render the animated variant at all. This
 * matters because Motion resolves `initial` once, at mount: if this
 * mounted while the reduced-motion default was still true (opacity 1
 * baked in), then flipped to false, the element would stay visible
 * forever, whileInView never gets anything to reveal. Rendering a plain,
 * fully-visible div until the real reading is known, then mounting the
 * motion.div fresh, avoids that stale-initial-value trap entirely -- and
 * doubles as the TRD.md §6 requirement that content be visible by
 * default, with JS only ever animating in on top of that.
 */
function useReadyForMotion() {
  const reducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reducedMotion;
}

export function RevealGroup({
  children,
  className = "",
  stagger = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ready = useReadyForMotion();

  if (!ready) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ready = useReadyForMotion();

  if (!ready) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
