"use client";

import { useRef } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const MAX_TILT_DEG = 10;

/**
 * The one deliberate react-spring dependency in a codebase that otherwise
 * uses Motion (lib/motion-tokens.ts, every other spring in the site) --
 * an explicit one-off per the user's request, not a switch away from
 * Motion. Kept isolated to this component so the rest of the site doesn't
 * end up depending on it.
 *
 * Tilt is driven by cursor position within the element's own bounding box
 * (not the whole viewport), like MagneticWrap.tsx's radius-based tracking --
 * gated the same way too: pointer-fine and motion-allowed only.
 */
export function FooterSignature() {
  const ref = useRef<HTMLParagraphElement>(null);
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const active = pointerFine && !reducedMotion;

  const [{ rx, ry }, api] = useSpring(() => ({
    rx: 0,
    ry: 0,
    config: { tension: 180, friction: 12 },
  }));

  function handleMouseMove(event: React.MouseEvent<HTMLParagraphElement>) {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    api.start({ rx: -py * MAX_TILT_DEG * 2, ry: px * MAX_TILT_DEG * 2 });
  }

  function handleMouseLeave() {
    api.start({ rx: 0, ry: 0 });
  }

  return (
    <animated.p
      ref={ref}
      onMouseMove={active ? handleMouseMove : undefined}
      onMouseLeave={active ? handleMouseLeave : undefined}
      style={
        active
          ? {
              transform: to(
                [rx, ry],
                (rxDeg, ryDeg) =>
                  `perspective(900px) rotateX(${rxDeg}deg) rotateY(${ryDeg}deg)`,
              ),
            }
          : undefined
      }
      className="font-display text-paper inline-block text-[clamp(2.25rem,8.5vw,5.5rem)] leading-[0.95] tracking-[-0.02em] select-none"
    >
      See you on <span className="text-ember">localhost</span>.
    </animated.p>
  );
}
