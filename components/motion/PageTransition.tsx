"use client";

import { AnimatePresence, motion, type Variants } from "motion/react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

// Exit is short and opacity-only, deliberately: Next's router can tear
// down the outgoing page before a slow, multi-property exit gets to
// finish, which reads as "enter animates, exit doesn't" -- a page that
// half-transitions is worse than one that doesn't bother animating out at
// all. Enter carries the actual "smooth" feeling (longer, fade + slide);
// exit just needs to not be an abrupt cut.
const variants: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.65, 0, 0.35, 1] } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeOut" } },
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
 * The wrapper structure below is ALWAYS the same, regardless of the
 * reduced-motion reading -- only the animation values change. An earlier
 * version branched on `ready`, rendering bare `{children}` until the real
 * reduced-motion reading resolved and only then switching to this
 * AnimatePresence-wrapped shape. That's a different element at the same
 * tree position, which forces React to unmount and remount the entire
 * page tree (every section, every DOM node) the moment the reading
 * resolves -- landing right in the middle of the intro sequence's own
 * timing-sensitive setup (IntroProvider deciding "full" vs "settled",
 * NameIntro measuring #nav-logo, Nav's IntersectionObserver attaching to
 * section elements that were about to be destroyed and replaced). That
 * remount is what caused the home page to flash visible before the intro
 * played, and left the nav's scroll-spy watching detached elements that
 * could never intersect anything again.
 *
 * `useReducedMotion()`'s SSR-safe default is `true` (motion off) until the
 * real reading is confirmed, so the very first render always resolves
 * `initial={false}` here -- children render at their final, fully-visible
 * "animate" values immediately, never a hidden state waiting on a reading
 * that hasn't arrived yet. Once resolved, that only affects the *next*
 * mount (a real route change gives AnimatePresence a new key to animate),
 * never the one already on screen -- Motion reads `initial` once, at
 * mount, and ignores later prop changes on an already-mounted instance.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={reducedMotion ? false : "initial"}
        animate="animate"
        exit={reducedMotion ? undefined : "exit"}
        variants={variants}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
