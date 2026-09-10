"use client";

import { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import type { Project } from "@/lib/content";
import { markGradient } from "@/lib/work";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

const SCREEN_COUNT = 2;

/**
 * Same honest stand-in as CaseStudyMockup -- no real screenshots exist yet,
 * so each "screen" is an abstract layout (a card grid, a stacked list) over
 * the project's own deterministic gradient, not a fabricated UI claim.
 * Laptop and phone always show the *other* screen from each other, so the
 * pair reads as "two real views of the same product" rather than two
 * copies of the same thing at different sizes.
 */
function ScreenContent({ variant, gradient }: { variant: 0 | 1; gradient: string }) {
  if (variant === 1) {
    return (
      <div
        className="flex h-full w-full flex-col justify-center gap-2.5 p-4"
        style={{ background: gradient }}
      >
        {[100, 78, 88, 62].map((width, i) => (
          <div
            key={i}
            className={`h-3 rounded-full ${i === 0 ? "bg-ember/40" : "bg-paper/10"}`}
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid h-full w-full grid-cols-3 gap-2 p-4"
      style={{ background: gradient }}
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`rounded-md ${i === 0 ? "bg-ember/40" : "bg-paper/10"}`}
        />
      ))}
    </div>
  );
}

export function CaseStudyDeviceShowcase({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const gradient = markGradient(index);

  const [{ progress }, api] = useSpring(() => ({
    progress: 0,
    config: { tension: 220, friction: 26 },
  }));

  function select(next: number) {
    if (next === active) return;
    setActive(next);
    api.start({ progress: next, immediate: reducedMotion });
  }

  const screenAOpacity = progress.to((p) => 1 - p);
  const screenBOpacity = progress;

  return (
    <div>
      <p className="text-label-caps font-ui text-label text-ember-dim mb-8 text-center">
        {project.title} across screens
      </p>

      <div
        className={`relative mx-auto max-w-[640px] ${project.hasMobile ? "pb-14" : ""}`}
      >
        {/* laptop -- shows screen A by default, crossfades to B */}
        <div className="rounded-t-xl border border-b-0 border-black/10 bg-[#1c1a17] p-2 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            <animated.div
              className="absolute inset-0"
              style={{ opacity: screenAOpacity }}
            >
              <ScreenContent variant={0} gradient={gradient} />
            </animated.div>
            <animated.div
              className="absolute inset-0"
              style={{ opacity: screenBOpacity }}
            >
              <ScreenContent variant={1} gradient={gradient} />
            </animated.div>
          </div>
        </div>
        <div className="relative h-3 rounded-b-xl bg-gradient-to-b from-[#242019] to-[#151311]">
          <div className="absolute top-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-b-md bg-[#0a0908]" />
        </div>

        {/* phone -- overlapping the laptop's corner, always the complementary screen.
            Desktop-only builds (project.hasMobile: false) don't get one -- there's
            no mobile app to honestly show a screen from. */}
        {project.hasMobile ? (
          <div className="absolute -right-1 -bottom-6 w-[28%] max-w-[128px] min-w-[92px] rounded-[22px] border-4 border-[#1c1a17] bg-[#1c1a17] shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[16px]">
              <animated.div
                className="absolute inset-0"
                style={{ opacity: screenBOpacity }}
              >
                <ScreenContent variant={0} gradient={gradient} />
              </animated.div>
              <animated.div
                className="absolute inset-0"
                style={{ opacity: screenAOpacity }}
              >
                <ScreenContent variant={1} gradient={gradient} />
              </animated.div>
              <div className="absolute top-1.5 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-[#0a0908]" />
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: SCREEN_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => select(i)}
            aria-label={`Show screen ${i + 1}`}
            aria-pressed={active === i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              active === i ? "bg-ember w-6" : "w-1.5 bg-[var(--border-subtle)]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
