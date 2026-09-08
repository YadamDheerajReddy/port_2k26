"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { signatureGlyphs, signatureGlyphsMeta } from "@/lib/signature-glyphs";
import {
  useReducedMotion,
  useReducedMotionReady,
} from "@/components/providers/ReducedMotionProvider";
import { AnnotatedParagraph } from "@/components/about/AnnotatedParagraph";

const viewBoxHeight = signatureGlyphsMeta.maxY - signatureGlyphsMeta.minY;
const viewBox = `0 ${-signatureGlyphsMeta.maxY} ${signatureGlyphsMeta.totalWidth} ${viewBoxHeight}`;

type Phase = "settled" | "pending" | "playing";

// Rock Salt's letterforms are already thick strokes, an outline alone (fill
// none) reads as a thin wire tracing the edges, not a signature. Draw the
// stroke first for the pen-tracing feel, then wash in the fill so the
// watermark that's left behind is a solid shape, matching how the page
// intro's "DR" handles the same stroke -> fill handoff.
const strokeDrawDuration = 1.0;
const staggerPerLetter = 0.09;
const watermarkOpacity = 0.28;

// strokeWidth lives in the SAME coordinate space as the glyph paths and the
// viewBox: font units, where the whole word is ~5200 units wide, not CSS
// pixels. A flat number like "4" there renders under half a physical pixel
// once the ~5200-unit-wide viewBox is scaled down into a 600px-wide box,
// which is exactly why the draw motion was visible (pathLength animates
// regardless of width) but nothing was left behind once it settled. Scale
// it off the font's own unitsPerEm instead so it holds a real, visible
// width at any render size.
const strokeWidth = signatureGlyphsMeta.unitsPerEm * 0.025;

/**
 * The first time this section scrolls into view, the "Dheeraj" signature
 * (real Rock Salt glyph outlines -- lib/signature-glyphs.ts, extracted by
 * scripts/generate-signature-glyphs.mjs the same way the page intro's "DR"
 * comes from a real font file, not a drawn-by-hand path) strokes itself in
 * behind the text, settles as a faint permanent watermark, then the
 * paragraph fades in on top of it. After that it just sits there, drawn.
 *
 * Default state (phase "settled" from first render) is the fully visible,
 * already-drawn end state: paragraph showing, signature complete. The
 * effect below only ever moves things into a hidden "pending" state once
 * it has confirmed reduced-motion is off and IntersectionObserver exists,
 * so a visitor who never gets that effect (slow script, unsupported
 * browser) always sees the finished, readable section, never a blank one
 * waiting on an observer that might not fire.
 *
 * The fill wash and the paragraph reveal use plain CSS transitions (style +
 * transition), not Motion's `animate` prop: `animate={{ opacity }}` was
 * landing on the DOM as a literal "undefined" attribute here rather than a
 * resolved number, on both the SVG paths and a motion.div, so it wasn't
 * safe to rely on for anything that isn't purely decorative. `pathLength`
 * animates correctly through Motion (it's a dedicated stroke-drawing
 * feature, not a generic style value), so that one stays.
 */
export function AboutContent() {
  const ready = useReducedMotionReady();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const hasRunRef = useRef(false);
  const [phase, setPhase] = useState<Phase>("settled");

  useEffect(() => {
    if (!ready || reducedMotion || hasRunRef.current) return;
    if (!("IntersectionObserver" in window) || !containerRef.current) return;

    setPhase("pending");

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRunRef.current) {
            hasRunRef.current = true;
            setPhase("playing");
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(containerRef.current);

    // Safety net: this section must never end up stuck hidden waiting on
    // an intersection that, for whatever reason, doesn't fire. If nothing
    // has happened in 6s (scrolling this far normally takes a fraction of
    // that), skip straight to fully revealed instead of the draw.
    const fallback = window.setTimeout(() => {
      if (!hasRunRef.current) {
        hasRunRef.current = true;
        setPhase("settled");
      }
    }, 6000);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, [ready, reducedMotion]);

  const fillOpacity = phase === "settled" ? watermarkOpacity : 0;
  const fillTransition =
    phase === "settled" && hasRunRef.current ? "opacity 0.5s ease" : "none";
  const paragraphOpacity = phase === "settled" ? 1 : 0;
  const paragraphTransition =
    phase === "settled" && hasRunRef.current
      ? "opacity 0.7s cubic-bezier(0.65, 0, 0.35, 1)"
      : "none";

  return (
    <div ref={containerRef} className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <svg viewBox={viewBox} className="w-[min(90%,600px)]">
          {signatureGlyphs.map((glyph, i) => (
            <g key={glyph.char + i} transform={`translate(${glyph.x}, 0) scale(1, -1)`}>
              {/* Stroke: the pen tracing the letterform. */}
              <motion.path
                d={glyph.d}
                fill="none"
                stroke="var(--color-ember)"
                strokeOpacity={0.2}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ pathLength: phase === "pending" ? 0 : 1 }}
                transition={
                  phase === "playing"
                    ? {
                        duration: strokeDrawDuration,
                        ease: [0.65, 0, 0.35, 1],
                        delay: i * staggerPerLetter,
                      }
                    : { duration: 0 }
                }
                onAnimationComplete={() => {
                  if (phase === "playing" && i === signatureGlyphs.length - 1) {
                    setPhase("settled");
                  }
                }}
              />
              {/* Fill: washes in once the stroke finishes, becoming the
                  permanent watermark. Plain CSS transition, see the note
                  above the component for why. */}
              <path
                d={glyph.d}
                fill="var(--color-ember)"
                stroke="none"
                style={{ opacity: fillOpacity, transition: fillTransition }}
              />
            </g>
          ))}
        </svg>
      </div>

      <div style={{ opacity: paragraphOpacity, transition: paragraphTransition }}>
        <AnnotatedParagraph />
      </div>
    </div>
  );
}
