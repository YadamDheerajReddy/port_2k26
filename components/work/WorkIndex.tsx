"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import { projects, type Project } from "@/lib/content";
import { Tag } from "@/components/ui/Tag";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const STATUS_LABEL: Record<Project["status"], string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  concept: "Concept",
  research: "Research",
};

function statusClass(status: Project["status"]) {
  if (status === "shipped") return "text-ember";
  if (status === "research") return "text-acid";
  return "text-bone";
}

function initials(title: string) {
  return title
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

// Deterministic per-project hue, not random: the same project always gets
// the same mark. Stands in for a real screenshot until one exists in
// project.media -- add a media entry (and the actual file) there and the
// preview below switches to it automatically, nothing here needs to change.
function markGradient(index: number) {
  const hue = (16 + index * 41) % 360;
  return `linear-gradient(135deg, hsl(${hue} 70% 13%), hsl(${(hue + 30) % 360} 82% 20%))`;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const PREVIEW_WIDTH = 260;

/**
 * Design direction: dennissnellenberg.com/work's project index -- a plain
 * list of rows (title, role, status) rather than a card grid, with a
 * preview that floats beside the cursor on hover instead of sitting fixed
 * in a card. Position tracking mirrors CustomCursor.tsx's spring config
 * (tight damping/stiffness) rather than AnnotatedParagraph's softer one:
 * a preview meant to feel like it's genuinely attached to the cursor reads
 * better snapped in tight than lagging behind. Portaled to document.body
 * for the same reason as AnnotatedParagraph's tooltip -- RevealItem's
 * motion.div ancestor carries a transform during its reveal, which would
 * otherwise make `fixed` positioning relative to that div, not the
 * viewport.
 */
export function WorkIndex() {
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const active = pointerFine && !reducedMotion;

  const [hovered, setHovered] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 26, stiffness: 300, mass: 0.5 });
  const springY = useSpring(y, { damping: 26, stiffness: 300, mass: 0.5 });

  useEffect(() => setMounted(true), []);

  function updatePosition(clientX: number, clientY: number) {
    const height = panelRef.current?.offsetHeight ?? 260;
    const margin = 20;
    x.set(clamp(clientX + 28, margin, window.innerWidth - PREVIEW_WIDTH - margin));
    y.set(clamp(clientY - height / 2, margin, window.innerHeight - height - margin));
  }

  function handleEnter(index: number, event: React.MouseEvent) {
    updatePosition(event.clientX, event.clientY);
    setHovered(index);
  }

  function handleMove(event: React.MouseEvent) {
    if (hovered !== null) updatePosition(event.clientX, event.clientY);
  }

  function handleLeave() {
    setHovered(null);
  }

  const project = hovered !== null ? projects[hovered] : null;
  const image = project?.media[0];

  const preview =
    mounted &&
    createPortal(
      <motion.div
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70]"
        style={{ x: springX, y: springY, width: PREVIEW_WIDTH }}
      >
        <AnimatePresence>
          {project ? (
            <motion.div
              key={project.slug}
              ref={panelRef}
              initial={{ opacity: 0, scale: 0.92, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(6px)" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-card bg-ink-raised overflow-hidden border border-[var(--border-subtle)] shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
            >
              <div className="relative aspect-[4/3] w-full">
                {image ? (
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes={`${PREVIEW_WIDTH}px`}
                    className="object-cover"
                  />
                ) : (
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{ background: markGradient(hovered!) }}
                  >
                    <span className="font-display text-paper/25 text-5xl">
                      {initials(project.title)}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <p className="font-body text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  {project.outcome}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.stack.slice(0, 3).map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>,
      document.body,
    );

  return (
    <>
      <RevealGroup className="border-t border-[var(--border-subtle)]" stagger={0.06}>
        {projects.map((item, index) => {
          const link = item.links.live ?? item.links.github ?? item.links.paper;
          const isExternal = /^https?:\/\//.test(link ?? "");

          const rowContent = (
            <div
              className="group flex items-baseline justify-between gap-6 border-b border-[var(--border-subtle)] py-6 md:py-7"
              onMouseEnter={active ? (e) => handleEnter(index, e) : undefined}
              onMouseMove={active ? handleMove : undefined}
              onMouseLeave={active ? handleLeave : undefined}
            >
              <span className="font-display text-display-3 group-hover:text-ember transition-[color,transform] duration-300 ease-[var(--ease-snap)] group-hover:translate-x-2">
                {item.title}
              </span>
              <span className="text-mono flex flex-shrink-0 items-center gap-4 font-mono text-[var(--text-secondary)]">
                <span className="hidden sm:inline">{item.role}</span>
                <span className={statusClass(item.status)}>
                  {STATUS_LABEL[item.status]}
                </span>
              </span>
            </div>
          );

          return (
            <RevealItem key={item.slug}>
              {link ? (
                <a
                  href={link}
                  {...(isExternal
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="block cursor-pointer"
                >
                  {rowContent}
                </a>
              ) : (
                rowContent
              )}
            </RevealItem>
          );
        })}
      </RevealGroup>
      {preview}
    </>
  );
}
