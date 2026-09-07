"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

type CursorState = "default" | "link" | "text";

/**
 * Design_System.md §6 / Animation_system.md §4: acid ring + ember dot,
 * damped trailing lag. Disabled on touch (usePointerFine) and under
 * reduced motion, per Animation_system.md §7 ("cursor-follow effects are
 * disabled"). Never rendered server-side: mouse position doesn't exist
 * until mount.
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

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[999] -translate-x-1/2 -translate-y-1/2"
      style={{ x: ringX, y: ringY }}
    >
      <div
        className={`border-acid flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-150 ${
          state === "link" ? "bg-ember border-ember" : "bg-transparent"
        }`}
      >
        {state === "default" ? (
          <div className="bg-ember h-1.5 w-1.5 rounded-full" />
        ) : null}
      </div>
    </motion.div>
  );
}
