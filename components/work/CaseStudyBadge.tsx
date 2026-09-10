"use client";

import { useSpring, animated } from "@react-spring/web";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

type CaseStudyBadgeProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode;
};

/** Same react-spring scale-overshoot as FooterLink.tsx, plus a slight counter-rotation on hover -- circular badges read a little more alive with a twist than a plain scale. */
export function CaseStudyBadge({
  children,
  className = "",
  ...rest
}: CaseStudyBadgeProps) {
  const reducedMotion = useReducedMotion();
  const [{ scale, rotate }, api] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    config: { tension: 300, friction: 14 },
  }));

  function grow() {
    if (!reducedMotion) api.start({ scale: 1.08, rotate: -4 });
  }

  function reset() {
    if (!reducedMotion) api.start({ scale: 1, rotate: 0 });
  }

  return (
    <animated.a
      {...rest}
      onMouseEnter={grow}
      onMouseLeave={reset}
      onFocus={grow}
      onBlur={reset}
      style={reducedMotion ? undefined : { scale, rotate }}
      className={`bg-ember text-ink font-body absolute flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-full text-[11.5px] font-semibold shadow-[0_16px_32px_rgba(0,0,0,0.3)] ${className}`}
    >
      {children}
    </animated.a>
  );
}
