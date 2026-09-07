"use client";

import { motion, type Variants } from "motion/react";
import { useIntro } from "@/components/providers/IntroProvider";

/**
 * Animation_system.md §2 step 5: staggered by section (eyebrow -> H1 ->
 * sub-line -> CTA -> scroll cue), opacity 0->1, y 24px->0, as the intro
 * lockup scales into the nav. Only mounts as motion.div once mode is
 * confirmed to not be "settled" (already waited on the real reduced-motion
 * reading, see IntroProvider), so `initial="hidden"` is never resolving a
 * stale default.
 */
const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
};

export function IntroRevealGroup({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const { mode, introDone } = useIntro();

  if (mode === "settled") return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate={introDone ? "visible" : "hidden"}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  );
}

export function IntroRevealItem({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { mode } = useIntro();

  if (mode === "settled") return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
