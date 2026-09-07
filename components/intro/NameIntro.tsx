"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { nameGlyphs, nameGlyphsMeta } from "@/lib/name-glyphs";
import { useIntro } from "@/components/providers/IntroProvider";
import { IntroSkipButton } from "@/components/intro/IntroSkipButton";

const viewBoxHeight = nameGlyphsMeta.maxY - nameGlyphsMeta.minY;
const viewBox = `0 ${-nameGlyphsMeta.maxY} ${nameGlyphsMeta.totalWidth} ${viewBoxHeight}`;

/**
 * The site's signature moment, Animation_system.md §2. Plays once per fresh
 * session, mode "full" only (IntroProvider), on real Clash Display "DR"
 * glyph outlines extracted from the actual font file (lib/name-glyphs.ts),
 * matching NavMark.tsx's monogram: stroke-draw -> ember glow -> fill wash
 * -> scale/translate into the nav logo's real measured position, handing
 * off to the persistent nav + hero content (IntroReveal.tsx) at the same
 * moment. Reduced-motion visitors get IntroSimple's plain fade instead,
 * per Animation_system.md §7.
 */
export function NameIntro() {
  const { mode, markDone } = useIntro();
  const [dismissed, setDismissed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const active = mode === "full";

  useLayoutEffect(() => {
    if (!active || dismissed) return;

    const paths = pathRefs.current.filter((p): p is SVGPathElement => p !== null);
    const lengths = paths.map((p) => p.getTotalLength());
    paths.forEach((p, i) => {
      gsap.set(p, {
        strokeDasharray: lengths[i],
        strokeDashoffset: lengths[i],
        fillOpacity: 0,
      });
    });

    const navLogo = document.getElementById("nav-logo");
    const tl = gsap.timeline({
      onComplete: () => setDismissed(true),
    });
    timelineRef.current = tl;

    // 0.1s-1.4s: stroke draws on, letter by letter.
    tl.to(
      paths,
      { strokeDashoffset: 0, duration: 1.0, ease: "power2.inOut", stagger: 0.06 },
      0.1,
    );

    // 1.2s-1.6s: ember glow fades in behind the name.
    if (glowRef.current) {
      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.6, scale: 1.1, duration: 0.4, ease: "power2.out" },
        1.2,
      );
    }

    // 1.5s-1.9s: fill washes in left to right.
    tl.to(
      paths,
      { fillOpacity: 1, duration: 0.3, stagger: 0.06, ease: "power2.inOut" },
      1.5,
    );

    // 1.9s-2.3s: lockup scales down and moves to the real nav logo position,
    // while nav + hero content reveal underneath at the same moment.
    tl.call(() => markDone(), [], 1.9);

    if (navLogo && svgWrapRef.current) {
      const navRect = navLogo.getBoundingClientRect();
      const introRect = svgWrapRef.current.getBoundingClientRect();
      const scale = navRect.width / introRect.width;
      const deltaX = navRect.left - introRect.left;
      const deltaY = navRect.top - introRect.top;

      gsap.set(svgWrapRef.current, { transformOrigin: "0 0" });
      tl.to(
        svgWrapRef.current,
        { x: deltaX, y: deltaY, scale, duration: 0.4, ease: "power3.inOut" },
        1.9,
      );
      tl.to(svgWrapRef.current, { opacity: 0, duration: 0.15 }, 2.15);
    } else if (svgWrapRef.current) {
      tl.to(
        svgWrapRef.current,
        { scale: 0.14, opacity: 0, duration: 0.4, ease: "power3.inOut" },
        1.9,
      );
    }

    tl.to(
      containerRef.current,
      { opacity: 0, duration: 0.2, pointerEvents: "none" },
      2.2,
    );

    return () => {
      tl.kill();
    };
  }, [active, dismissed, markDone]);

  function handleSkip() {
    timelineRef.current?.kill();
    markDone();
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.2,
        onComplete: () => setDismissed(true),
      });
    } else {
      setDismissed(true);
    }
  }

  if (!active || dismissed) return null;

  return (
    <div
      ref={containerRef}
      className="bg-ink fixed inset-0 z-[100] flex items-center justify-center"
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute h-[80vmin] w-[80vmin] opacity-0"
        style={{ background: "var(--gradient-ember-glow)" }}
      />

      <div ref={svgWrapRef} className="relative w-[min(50vw,480px)]">
        <svg viewBox={viewBox} className="w-full" aria-hidden>
          {nameGlyphs.map((glyph, i) => (
            <g key={glyph.char + i} transform={`translate(${glyph.x}, 0) scale(1, -1)`}>
              <path
                ref={(el) => {
                  pathRefs.current[i] = el;
                }}
                d={glyph.d}
                fill="var(--color-paper)"
                stroke="var(--color-paper)"
                strokeOpacity={0.6}
                strokeWidth={2}
              />
            </g>
          ))}
        </svg>
      </div>

      <IntroSkipButton onSkip={handleSkip} />
    </div>
  );
}
