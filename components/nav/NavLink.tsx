"use client";

import { useSpring, animated } from "@react-spring/web";
import { motion } from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

/**
 * FooterLink's springy hover-grow (same config, same reasoning) under
 * Nav.tsx's own Motion layoutId underline. The underline stays on Motion
 * rather than being hand-rolled in react-spring alongside the bounce: it's
 * a genuine cross-render "magic move" (sliding from whichever link was
 * active to this one), exactly what layoutId is for, and duplicating that
 * in react-spring would mean tracking every link's position by hand for
 * no real benefit.
 */
export function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const [{ scale }, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 400, friction: 12 },
  }));

  function grow() {
    if (!reducedMotion) api.start({ scale: 1.1 });
  }

  function reset() {
    if (!reducedMotion) api.start({ scale: 1 });
  }

  return (
    <animated.a
      href={href}
      data-scroll-to
      data-scroll-to-offset={100}
      onMouseEnter={grow}
      onMouseLeave={reset}
      onFocus={grow}
      onBlur={reset}
      style={reducedMotion ? undefined : { scale, display: "inline-block" }}
      className={`text-label-caps font-ui text-label relative pb-3 transition-colors duration-[var(--dur-fast)] ${
        active ? "text-[var(--accent-primary)]" : "text-bone hover:text-paper"
      }`}
    >
      {label}
      {active ? (
        <motion.span
          layoutId="nav-active-line"
          className="bg-ember absolute inset-x-0 bottom-0 h-px"
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
        >
          <span className="bg-ember absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
        </motion.span>
      ) : null}
    </animated.a>
  );
}
