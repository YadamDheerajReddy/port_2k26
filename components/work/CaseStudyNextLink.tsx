"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useSpring, animated, to } from "@react-spring/web";
import type { Project } from "@/lib/content";
import { markGradient, initials } from "@/lib/work";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const MAX_TILT_DEG = 4;

/**
 * Closes the paper case study back out to the site's default dark register
 * before Footer takes over -- same bookend logic as Footer.tsx itself.
 *
 * The floating preview is WorkIndex.tsx's own cursor-float panel, ported
 * to react-spring instead of Motion: same reasoning (portal to body so
 * `fixed` positions against the viewport, not some ancestor's transform),
 * same idea (a sneak peek of what you're about to click into), just reused
 * here instead of inventing a second pattern for the same job. Shows the
 * next project's real hero screenshot when it has one, same as WorkIndex's
 * panel; `index` is the *next* project's real position in the list, so its
 * gradient fallback matches exactly what that project's own case study
 * page falls back to -- not a fresh one recomputed relative to this page.
 */
export function CaseStudyNextLink({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reducedMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const active = pointerFine && !reducedMotion;

  const bandRef = useRef<HTMLAnchorElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const [{ rx, ry }, tiltApi] = useSpring(() => ({
    rx: 0,
    ry: 0,
    config: { tension: 180, friction: 20 },
  }));

  const [{ px, py, scale, opacity }, previewApi] = useSpring(() => ({
    px: 0,
    py: 0,
    scale: 0.85,
    opacity: 0,
    config: { tension: 320, friction: 28 },
  }));

  function handleMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!active || !bandRef.current) return;
    const rect = bandRef.current.getBoundingClientRect();
    const nx = (event.clientX - rect.left) / rect.width - 0.5;
    const ny = (event.clientY - rect.top) / rect.height - 0.5;
    tiltApi.start({ rx: -ny * MAX_TILT_DEG, ry: nx * MAX_TILT_DEG });
    previewApi.start({ px: event.clientX + 28, py: event.clientY - 90 });
  }

  function handleMouseEnter(event: React.MouseEvent<HTMLAnchorElement>) {
    previewApi.start({
      px: event.clientX + 28,
      py: event.clientY - 90,
      scale: 1,
      opacity: 1,
    });
  }

  function handleMouseLeave() {
    tiltApi.start({ rx: 0, ry: 0 });
    previewApi.start({ scale: 0.85, opacity: 0 });
  }

  const image = project.media[0];

  const preview =
    mounted &&
    createPortal(
      <animated.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70]"
        style={{ x: px, y: py, scale, opacity }}
      >
        <div className="rounded-card bg-ink-raised relative h-[150px] w-[210px] overflow-hidden border border-white/10 shadow-[0_24px_48px_rgba(0,0,0,0.5)]">
          {image ? (
            <Image src={image.src} alt="" fill sizes="210px" className="object-cover" />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center"
              style={{ background: markGradient(index) }}
            >
              <span className="font-display text-paper/25 text-5xl">
                {initials(project.title)}
              </span>
            </div>
          )}
        </div>
      </animated.div>,
      document.body,
    );

  return (
    <>
      <Link
        ref={bandRef}
        href={`/work/${project.slug}`}
        onMouseMove={active ? handleMouseMove : undefined}
        onMouseEnter={active ? handleMouseEnter : undefined}
        onMouseLeave={active ? handleMouseLeave : undefined}
        className="group bg-ink relative block overflow-hidden px-6 py-24 md:py-32"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
        >
          <div
            className="absolute top-1/2 left-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,77,28,0.16), transparent 70%)",
            }}
          />
        </div>

        <animated.div
          className="relative mx-auto flex max-w-[900px] flex-col items-start gap-4"
          style={
            active
              ? {
                  transform: to(
                    [rx, ry],
                    (rxDeg, ryDeg) =>
                      `perspective(1000px) rotateX(${rxDeg}deg) rotateY(${ryDeg}deg)`,
                  ),
                }
              : undefined
          }
        >
          <span className="text-label-caps font-ui text-label text-bone">Next case</span>
          <span className="font-display group-hover:text-ember text-paper flex items-center gap-5 text-[clamp(2rem,6vw,4rem)] leading-[0.98] tracking-[-0.02em] transition-colors duration-300">
            {project.title}
            <svg
              width="40"
              height="28"
              viewBox="0 0 20 14"
              fill="none"
              className="flex-shrink-0 transition-transform duration-300 ease-[var(--ease-signature)] group-hover:translate-x-3"
            >
              <path
                d="M1 7H19M19 7L13 1M19 7L13 13"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </animated.div>
      </Link>
      {preview}
    </>
  );
}
