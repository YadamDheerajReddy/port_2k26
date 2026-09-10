"use client";

import { useRef } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import type { Project } from "@/lib/content";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";
import { CaseStudyBadge } from "@/components/work/CaseStudyBadge";
import { CaseStudyStickyBar } from "@/components/work/CaseStudyStickyBar";

const MAX_TILT_DEG = 5;

/**
 * Owns the one DOM node (heroRef) that both the mouse-tilt physics and the
 * sticky bar's scroll observer need -- keeping them in the same client
 * component is what lets the sticky bar know exactly when this hero (not
 * some other element) has scrolled out of view.
 *
 * Tilt formula mirrors FooterSignature.tsx (same MagneticWrap-style
 * radius-based idea, applied as rotateX/rotateY instead of x/y), but at
 * roughly half the degree range -- a large rectangular mockup reads as
 * distracting at the angles that feel fine on a short line of text.
 */
export function CaseStudyHeroSection({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) {
  const heroRef = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const active = pointerFine && !reducedMotion;

  const [{ rx, ry }, api] = useSpring(() => ({
    rx: 0,
    ry: 0,
    config: { tension: 200, friction: 20 },
  }));

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!active || !heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    api.start({ rx: -py * MAX_TILT_DEG, ry: px * MAX_TILT_DEG });
  }

  function handleMouseLeave() {
    api.start({ rx: 0, ry: 0 });
  }

  const link = project.links.live ?? project.links.github ?? project.links.paper;
  const badgeLabel = project.links.live
    ? "Live site"
    : project.links.github
      ? "GitHub"
      : null;
  const isExternal = /^https?:\/\//.test(link ?? "");

  return (
    <>
      <CaseStudyStickyBar project={project} heroRef={heroRef} />
      <div ref={heroRef} className="relative">
        <animated.div
          onMouseMove={active ? handleMouseMove : undefined}
          onMouseLeave={active ? handleMouseLeave : undefined}
          style={
            active
              ? {
                  transform: to(
                    [rx, ry],
                    (rxDeg, ryDeg) =>
                      `perspective(1400px) rotateX(${rxDeg}deg) rotateY(${ryDeg}deg)`,
                  ),
                }
              : undefined
          }
        >
          {children}
        </animated.div>

        {link && badgeLabel ? (
          <CaseStudyBadge
            href={link}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="right-7 -bottom-6"
          >
            {badgeLabel}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 12L12 4M12 4H6M12 4V10"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </CaseStudyBadge>
        ) : null}
      </div>
    </>
  );
}
