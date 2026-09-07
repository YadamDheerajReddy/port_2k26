"use client";

import { motion } from "motion/react";

/** Animation_system.md §7: fades in at 0.8s, jumps to the settled state with a 200ms fade. */
export function IntroSkipButton({ onSkip }: { onSkip: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onSkip}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.3 }}
      className="text-label-caps font-ui text-label text-bone hover:text-paper fixed right-6 bottom-6 z-[60]"
    >
      Skip
    </motion.button>
  );
}
