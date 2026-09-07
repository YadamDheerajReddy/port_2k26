"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

/**
 * Decorative glTF sphere (Sketchfab, CC-BY, credited in the footer) that
 * spins as the viewer scrolls past it. The <model-viewer> element is built
 * with document.createElement instead of JSX: it's a web component, not a
 * React one, and TypeScript has no intrinsic-element typing for it, so this
 * sidesteps writing a global JSX declaration for a single one-off tag.
 * Loaded via a dynamic import inside the effect so the model-viewer library
 * never ships in the initial page bundle, only once this component mounts
 * on a wide enough viewport to actually show it.
 */
export function AboutSphere({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Element | null>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start end", "end start"],
  });
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  useEffect(() => {
    // The parent hides this component below the md breakpoint (matches
    // Tailwind's default 768px). Mirrored here so phones never pay for the
    // model download at all, not just for hiding it visually.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let cancelled = false;

    import("@google/model-viewer").then(() => {
      if (cancelled || !mountRef.current) return;

      const viewer = document.createElement("model-viewer");
      viewer.setAttribute("src", "/models/test_sphere/scene.gltf");
      viewer.setAttribute("alt", "");
      viewer.setAttribute("environment-image", "neutral");
      viewer.setAttribute("shadow-intensity", "0");
      viewer.setAttribute("orientation", "0deg 0deg 0deg");
      // Under 1MB total: not worth model-viewer's default lazy-load via
      // IntersectionObserver, load it as soon as this component mounts.
      viewer.setAttribute("loading", "eager");
      viewer.style.width = "100%";
      viewer.style.height = "100%";
      viewer.style.backgroundColor = "transparent";

      mountRef.current.appendChild(viewer);
      viewerRef.current = viewer;
    });

    return () => {
      cancelled = true;
      viewerRef.current?.remove();
      viewerRef.current = null;
    };
  }, []);

  // Direct attribute mutation, not React state: matches the pattern used
  // for the cursor and the portrait hover reveal elsewhere in this project,
  // scroll-driven updates fire far too often for React re-renders.
  useMotionValueEvent(rotation, "change", (latest) => {
    if (reducedMotion) return;
    viewerRef.current?.setAttribute("orientation", `0deg ${latest}deg 0deg`);
  });

  return (
    <div ref={wrapperRef} className={className} aria-hidden>
      <div ref={mountRef} className="h-full w-full" />
    </div>
  );
}
