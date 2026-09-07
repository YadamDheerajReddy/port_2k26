"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useIntro } from "@/components/providers/IntroProvider";

/**
 * Animation_system.md §7 reduced-motion fallback: "a simple 400ms fade/scale
 * (no stroke draw)". Stays centered, no cross-screen translate toward the
 * nav logo -- reduced motion means less movement, not just less complexity.
 */
export function IntroSimple() {
  const { mode, markDone } = useIntro();
  const [dismissed, setDismissed] = useState(false);
  const active = mode === "simple";

  useEffect(() => {
    if (!active) return;
    const revealTimer = setTimeout(markDone, 400);
    const dismissTimer = setTimeout(() => setDismissed(true), 700);
    return () => {
      clearTimeout(revealTimer);
      clearTimeout(dismissTimer);
    };
  }, [active, markDone]);

  if (!active || dismissed) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="bg-ink fixed inset-0 z-[100] flex items-center justify-center"
    >
      <motion.p
        aria-hidden
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="font-display text-display-1 text-paper"
      >
        DR
      </motion.p>
    </motion.div>
  );
}
