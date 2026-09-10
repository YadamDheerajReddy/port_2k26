"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { projects } from "@/lib/content";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const AUTO_OPEN_MS = 5000;
const RING_RADIUS = 19;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Hovering a row floats a small ring beside the cursor -- mirrors the old
 * preview panel's cursor-follow spring rather than sitting fixed inside the
 * row, since a countdown living inside the card itself read as a loading
 * bar on the row, not a "the page is about to open" cue. The ring fades
 * and scales in on entry (never snaps) and its stroke sweeps closed over
 * 5s; if the pointer is still there when it closes, the case study opens
 * on its own. A direct click on the row (Link's normal behavior) still
 * jumps immediately regardless of the timer. Portaled to document.body for
 * the same reason as the old preview panel: RevealItem's motion.div
 * ancestor carries a transform during its reveal, which would otherwise
 * anchor `fixed` positioning to that div instead of the viewport.
 */
export function WorkIndex() {
  const router = useRouter();
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const active = pointerFine && !reducedMotion;

  const [hovered, setHovered] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(AUTO_OPEN_MS / 1000));
  const [mounted, setMounted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 420, mass: 0.4 });
  const springY = useSpring(y, { damping: 30, stiffness: 420, mass: 0.4 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function updatePosition(clientX: number, clientY: number) {
    x.set(clientX + 24);
    y.set(clientY - 22);
  }

  function handleEnter(index: number, event: React.MouseEvent) {
    updatePosition(event.clientX, event.clientY);
    setHovered(index);
    setSecondsLeft(Math.ceil(AUTO_OPEN_MS / 1000));

    if (intervalRef.current) clearInterval(intervalRef.current);
    const deadline = Date.now() + AUTO_OPEN_MS;
    intervalRef.current = setInterval(() => {
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = null;
        router.push(`/work/${projects[index].slug}`);
        return;
      }
      setSecondsLeft(Math.ceil(remainingMs / 1000));
    }, 100);
  }

  function handleMove(event: React.MouseEvent) {
    updatePosition(event.clientX, event.clientY);
  }

  function handleLeave() {
    setHovered(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  const ring =
    mounted &&
    createPortal(
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70]"
        style={{ x: springX, y: springY }}
      >
        <AnimatePresence>
          {hovered !== null ? (
            <motion.svg
              key="ring"
              width="44"
              height="44"
              viewBox="0 0 44 44"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <circle
                cx="22"
                cy="22"
                r={RING_RADIUS}
                stroke="var(--border-subtle)"
                strokeWidth="2"
                fill="none"
              />
              <motion.circle
                key={hovered}
                cx="22"
                cy="22"
                r={RING_RADIUS}
                stroke="var(--color-ember)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                style={{ rotate: -90, transformOrigin: "22px 22px" }}
                initial={{ strokeDashoffset: RING_CIRCUMFERENCE }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: AUTO_OPEN_MS / 1000, ease: "linear" }}
              />
              <text
                x="22"
                y="23"
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono fill-paper"
                fontSize="13"
              >
                {secondsLeft}
              </text>
            </motion.svg>
          ) : null}
        </AnimatePresence>
      </motion.div>,
      document.body,
    );

  return (
    <>
      <RevealGroup className="border-t border-[var(--border-subtle)]" stagger={0.06}>
        {projects.map((item, index) => (
          <RevealItem key={item.slug}>
            <Link
              href={`/work/${item.slug}`}
              className="group flex items-baseline justify-between gap-6 border-b border-[var(--border-subtle)] py-6 md:py-7"
              onMouseEnter={active ? (e) => handleEnter(index, e) : undefined}
              onMouseMove={active ? handleMove : undefined}
              onMouseLeave={active ? handleLeave : undefined}
            >
              <span className="font-display text-display-3 group-hover:text-ember transition-[color,transform] duration-300 ease-[var(--ease-snap)] group-hover:translate-x-2">
                {item.title}
              </span>
              <svg
                width="28"
                height="20"
                viewBox="0 0 20 14"
                fill="none"
                className="group-hover:text-ember flex-shrink-0 text-[var(--text-secondary)] transition-[color,transform] duration-300 ease-[var(--ease-snap)] group-hover:translate-x-1.5"
              >
                <path
                  d="M1 7H19M19 7L13 1M19 7L13 13"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </RevealItem>
        ))}
      </RevealGroup>
      {ring}
    </>
  );
}
