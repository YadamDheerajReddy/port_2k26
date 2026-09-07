"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { usePointerFine } from "@/lib/usePointerFine";

/**
 * me2.png (same pose and pixel dimensions as me.png, an alternate "geared
 * up" version) sits on top, masked to a soft circle that tracks the cursor
 * via a CSS custom property updated directly on the DOM node (mousemove
 * fires far too often for React state without dropping frames), and fades
 * in/out on hover via a plain opacity transition. Skipped entirely on
 * coarse pointers, there's no persistent hover to reveal it with.
 */
export function PortraitReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const pointerFine = usePointerFine();

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!containerRef.current || !revealRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    revealRef.current.style.setProperty("--reveal-x", `${x}%`);
    revealRef.current.style.setProperty("--reveal-y", `${y}%`);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={pointerFine ? handleMouseMove : undefined}
      onMouseEnter={() => pointerFine && setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="relative"
    >
      {/*
        portrait-fade-mask: the source photos are hard-cropped at the
        bottom (a flat rectangular edge), which read as visibly "cut off"
        against the page background. This fades the bottom ~20% to
        transparent instead. Scoped to just the image layers, not the
        tagline below, which needs to stay fully legible.
      */}
      <div className="portrait-fade-mask relative">
        <Image
          src="/images/me.png"
          alt="Dheeraj Reddy"
          width={1145}
          height={1374}
          priority
          className="relative z-0 h-auto w-full"
        />

        {pointerFine ? (
          <div
            ref={revealRef}
            aria-hidden
            className="portrait-reveal-mask pointer-events-none absolute inset-0 z-[1] transition-opacity duration-300 ease-[var(--ease-snap)]"
            style={{ opacity: hovering ? 1 : 0 }}
          >
            <Image
              src="/images/me2.png"
              alt=""
              width={1145}
              height={1374}
              className="h-auto w-full"
            />
          </div>
        ) : null}
      </div>

      {/*
        Legibility fix: subtle dark glow behind the tagline so it holds up
        against the busy photo underneath, rather than sitting directly on
        whatever happens to be there (hair, jacket detail, glasses).
      */}
      <div className="absolute inset-x-4 bottom-2 z-[2] sm:inset-x-6 sm:bottom-[10%]">
        <div
          aria-hidden
          className="bg-ink/70 absolute inset-0 scale-125 rounded-full blur-lg"
        />
        <p className="font-body relative px-2 py-2 text-xs text-[var(--text-secondary)] sm:px-3 sm:text-base">
          A full-stack developer crafting elegant solutions to complex problems.
        </p>
      </div>
    </div>
  );
}
