"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const RADIUS = 40;
const MAX_DISPLACEMENT = 8;

/** Animation_system.md §4: primary CTAs pull toward the cursor within 40px, max 8px. */
export function MagneticWrap({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const active = pointerFine && !reducedMotion;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;
    const distance = Math.hypot(distanceX, distanceY);

    if (distance < RADIUS) {
      x.set((distanceX / RADIUS) * MAX_DISPLACEMENT);
      y.set((distanceY / RADIUS) * MAX_DISPLACEMENT);
    } else {
      x.set(0);
      y.set(0);
    }
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={active ? { x: springX, y: springY } : undefined}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
