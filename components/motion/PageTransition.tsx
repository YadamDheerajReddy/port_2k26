"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import {
  useReducedMotion,
  useReducedMotionReady,
} from "@/components/providers/ReducedMotionProvider";

const variants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.3, ease: [0.65, 0, 0.35, 1] } },
};

/**
 * Wraps layout.tsx's {children} (not the whole site-shell -- Nav, the name
 * intro and the cursor stay mounted across navigation, only the page area
 * itself should fade/slide). AnimatePresence keyed on the pathname is the
 * standard way to animate route changes under the App Router: layout.tsx
 * itself never remounts, so this component stays mounted across
 * navigation, and only the key changes, giving AnimatePresence something
 * to diff and animate between.
 *
 * Same "safe default, opt-in" shape as Reveal.tsx: renders children plain
 * (no wrapper, no animation) until reduced-motion is confirmed off, so a
 * visitor who never gets a real reading -- or explicitly asked for reduced
 * motion -- always gets an instant, unanimated page swap rather than one
 * stuck mid-fade.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const ready = useReducedMotionReady();
  const reducedMotion = useReducedMotion();

  if (!ready || reducedMotion) return <>{children}</>;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
