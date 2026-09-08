"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const NOTES = {
  time: "The real difference good software makes is time.",
  manual:
    "A slow process turned automatic, a confusing step turned obvious, a manual task that no longer needs a person.",
} as const;

type NoteKey = keyof typeof NOTES;

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Design_System.md /About: marked phrases in the running copy carry a
 * short aside, revealed at the cursor instead of a fixed margin column.
 * Position tracking mirrors CustomCursor.tsx's spring (useMotionValue +
 * useSpring), with velocity-derived skew on top for a bit of weight.
 * Rendered through a portal because RevealItem's motion.div ancestor
 * keeps an active transform, which would otherwise make `fixed`
 * positioning relative to that div instead of the real viewport.
 */
export function AnnotatedParagraph() {
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const active = pointerFine && !reducedMotion;

  const [openKey, setOpenKey] = useState<NoteKey | null>(null);
  const [mounted, setMounted] = useState(false);
  const tipRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 24, stiffness: 240, mass: 0.7 });
  const springY = useSpring(y, { damping: 24, stiffness: 240, mass: 0.7 });
  const velocityX = useVelocity(springX);
  const skew = useTransform(velocityX, [-1200, 1200], [-8, 8], { clamp: true });
  const stretch = useTransform(velocityX, (v) => 1 + Math.min(Math.abs(v) / 3000, 0.12));

  // The tooltip renders through a portal, which needs `document` -- true
  // only after mount, never during SSR.
  useEffect(() => setMounted(true), []);

  function updatePosition(clientX: number, clientY: number) {
    const width = tipRef.current?.offsetWidth ?? 280;
    const height = tipRef.current?.offsetHeight ?? 72;
    const margin = 16;
    x.set(clamp(clientX + 20, margin, window.innerWidth - width - margin));
    y.set(clamp(clientY + 24, margin, window.innerHeight - height - margin));
  }

  function handleEnter(key: NoteKey, event: React.MouseEvent) {
    updatePosition(event.clientX, event.clientY);
    setOpenKey(key);
  }

  function handleMove(event: React.MouseEvent) {
    if (openKey) updatePosition(event.clientX, event.clientY);
  }

  function handleLeave() {
    setOpenKey(null);
  }

  function handleTap(key: NoteKey, event: React.MouseEvent<HTMLSpanElement>) {
    if (active) return;
    const rect = event.currentTarget.getBoundingClientRect();
    updatePosition(rect.left, rect.bottom - 4);
    setOpenKey((current) => (current === key ? null : key));
  }

  function markClasses(key: NoteKey) {
    const isOpen = openKey === key;
    return [
      "underline decoration-dotted decoration-2 underline-offset-4 cursor-help transition-colors duration-200",
      isOpen
        ? "text-ember decoration-solid decoration-ember"
        : "decoration-ember/70 hover:text-ember-dim",
    ].join(" ");
  }

  const tooltip =
    mounted &&
    createPortal(
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[60]"
        style={{ x: springX, y: springY, skewX: skew, scaleX: stretch }}
      >
        <AnimatePresence>
          {openKey ? (
            <motion.div
              key={openKey}
              ref={tipRef}
              initial={{ opacity: 0, scale: 0.82, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.88, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              className="bg-ink-raised text-paper relative max-w-[280px] rounded-[var(--radius-button)] py-[13px] pr-[18px] pl-5 text-[0.9375rem] leading-relaxed shadow-[0_18px_40px_rgba(14,12,10,0.4),0_2px_10px_rgba(14,12,10,0.3)]"
            >
              <motion.span
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                exit={{ scaleY: 0 }}
                transition={{ duration: 0.35, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
                className="bg-ember absolute top-0 bottom-0 left-0 w-[2px] origin-top rounded-full"
              />
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.08 }}
                className="block"
              >
                {NOTES[openKey]}
              </motion.span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>,
      document.body,
    );

  return (
    <>
      <p className="font-body text-body-lg mx-auto max-w-[62ch] text-center text-[var(--text-primary)]">
        I like building things that{" "}
        <span
          className={markClasses("time")}
          onMouseEnter={active ? (e) => handleEnter("time", e) : undefined}
          onMouseMove={active ? handleMove : undefined}
          onMouseLeave={active ? handleLeave : undefined}
          onClick={(e) => handleTap("time", e)}
        >
          quietly make someone&rsquo;s day easier
        </span>
        <span className="sr-only"> ({NOTES.time})</span>. My work spans the full stack,
        from how data moves in the background to what a person sees and clicks on screen.
        I care about{" "}
        <span
          className={markClasses("manual")}
          onMouseEnter={active ? (e) => handleEnter("manual", e) : undefined}
          onMouseMove={active ? handleMove : undefined}
          onMouseLeave={active ? handleLeave : undefined}
          onClick={(e) => handleTap("manual", e)}
        >
          how something works underneath, not just how it looks
        </span>
        <span className="sr-only"> ({NOTES.manual})</span>, because that is what keeps it
        fast and easy to change later. That is what I try to build every time I sit down
        to code.
      </p>
      {tooltip}
    </>
  );
}
