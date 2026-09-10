"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

type CursorState = "default" | "link" | "text";

/**
 * Redesigned from the old acid-ring + ember-dot pair (read as generic
 * clip-art) into a single element: a small solid ember dot at rest that
 * morphs into a soft glass circle carrying the same arrow glyph
 * WorkIndex's rows and CaseStudyNextLink already use for "this goes
 * somewhere" -- so the cursor's hover state reads as the same affordance
 * the rest of the site already taught, not a one-off shape. Acid dropped
 * entirely; it's reserved for focus-ring/keyboard state elsewhere
 * (tokens.css --focus-ring), not the pointer.
 *
 * Disabled on touch (usePointerFine) and under reduced motion, per
 * Animation_system.md §7. Never rendered server-side: mouse position
 * doesn't exist until mount.
 */
export function CustomCursor() {
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<CursorState>("default");
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const ringX = useSpring(x, springConfig);
  const ringY = useSpring(y, springConfig);

  const active = pointerFine && !reducedMotion;

  useEffect(() => {
    if (!active) return;

    function handleMove(event: MouseEvent) {
      x.set(event.clientX);
      y.set(event.clientY);
      setVisible(true);

      const target = event.target as HTMLElement;
      if (target.closest("a, button, [role='button']")) {
        setState("link");
      } else if (target.closest("input, textarea")) {
        setState("text");
      } else {
        setState("default");
      }
    }

    function handleLeave() {
      setVisible(false);
    }

    document.documentElement.classList.add("custom-cursor-active");
    window.addEventListener("mousemove", handleMove);
    document.documentElement.addEventListener("mouseleave", handleLeave);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMove);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
    };
  }, [active, x, y]);

  if (!active || !visible || state === "text") return null;

  const isLink = state === "link";

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2"
      style={{ x: ringX, y: ringY }}
    >
      <motion.div
        animate={{ width: isLink ? 46 : 8, height: isLink ? 46 : 8 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center justify-center rounded-full ${
          isLink
            ? "border-ember/50 bg-ember/10 border backdrop-blur-[2px]"
            : "bg-ember shadow-[0_0_10px_rgba(255,77,28,0.55)]"
        }`}
      >
        {isLink ? (
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15, delay: 0.1 }}
            width="16"
            height="12"
            viewBox="0 0 20 14"
            fill="none"
            className="text-ember"
          >
            <path
              d="M1 7H19M19 7L13 1M19 7L13 13"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        ) : null}
      </motion.div>
    </motion.div>
  );
}
