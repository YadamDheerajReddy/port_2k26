"use client";

import { useSpring, animated } from "@react-spring/web";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

type FooterLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

/** A small springy overshoot on hover/focus -- react-spring's `scale` style key composes its own transform, no manual matrix math needed. */
export function FooterLink({ children, ...rest }: FooterLinkProps) {
  const reducedMotion = useReducedMotion();
  const [{ scale }, api] = useSpring(() => ({
    scale: 1,
    config: { tension: 400, friction: 12 },
  }));

  function grow() {
    if (!reducedMotion) api.start({ scale: 1.12 });
  }

  function reset() {
    if (!reducedMotion) api.start({ scale: 1 });
  }

  return (
    <animated.a
      {...rest}
      onMouseEnter={grow}
      onMouseLeave={reset}
      onFocus={grow}
      onBlur={reset}
      style={reducedMotion ? undefined : { scale, display: "inline-block" }}
      className="text-label-caps font-ui text-label text-bone hover:text-ember transition-colors duration-[var(--dur-fast)]"
    >
      {children}
    </animated.a>
  );
}
