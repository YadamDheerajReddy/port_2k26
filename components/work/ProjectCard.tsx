"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import type { Project } from "@/lib/content";
import { StatusBadge, Tag } from "@/components/ui/Tag";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const MAX_TILT = 6;

export function ProjectCard({
  project,
  large = false,
}: {
  project: Project;
  large?: boolean;
}) {
  const link = project.links.live ?? project.links.github ?? project.links.paper;
  const ref = useRef<HTMLDivElement>(null);
  const pointerFine = usePointerFine();
  const reducedMotion = useReducedMotion();
  const tiltActive = pointerFine && !reducedMotion;

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 300, damping: 25 });
  const springRotateY = useSpring(rotateY, { stiffness: 300, damping: 25 });
  const lift = useMotionValue(0);
  const springLift = useSpring(lift, { stiffness: 300, damping: 25 });

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!tiltActive || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * MAX_TILT * 2);
    rotateX.set(-py * MAX_TILT * 2);
  }

  function handleMouseEnter() {
    if (!reducedMotion) lift.set(-4);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
    lift.set(0);
  }

  const Card = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: tiltActive ? springRotateX : 0,
        rotateY: tiltActive ? springRotateY : 0,
        y: springLift,
        transformPerspective: 800,
      }}
      className={`rounded-card bg-ink-raised flex h-full flex-col justify-between border border-[var(--border-subtle)] p-6 transition-colors duration-[var(--dur-fast)] ${
        link ? "hover:border-ember" : ""
      } ${large ? "md:p-10" : ""}`}
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3
            className={`font-display text-[var(--text-primary)] ${large ? "text-display-2" : "text-display-3"}`}
          >
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>

        <p className="font-body text-body mt-4 text-[var(--text-secondary)]">
          {project.outcome}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <Tag key={item}>{item}</Tag>
        ))}
      </div>
    </motion.div>
  );

  if (!link) return Card;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block h-full">
      {Card}
    </a>
  );
}
