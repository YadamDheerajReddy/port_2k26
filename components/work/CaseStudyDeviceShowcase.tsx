"use client";

import { useEffect, useState } from "react";
import { useSprings, animated } from "@react-spring/web";
import Image from "next/image";
import type { Project } from "@/lib/content";
import { markGradient, initials } from "@/lib/work";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

const CYCLE_MS = 3200;

/**
 * Crossfades through one device's real screenshots on its own loop. Laptop
 * and phone each get their own instance with their own image list and
 * timer -- a project's desktop and mobile screenshots rarely come in
 * matching counts (e.g. ExamGuard: 3 desktop, 2 mobile), so showing the
 * same "screen index" in both frames would be a coincidence, not a real
 * pairing. Pauses on hover (WCAG 2.2.2, same reasoning as Marquee.tsx's
 * pause-on-hover) and never auto-advances under reduced motion.
 *
 * object-contain, not object-cover: the device frame is a fixed 16:10 (or
 * 9:19.5) silhouette, but real screenshots don't land on that ratio --
 * ExamGuard's desktop shots run ~2.2:1, its mobile shots ~0.58:1 -- so
 * object-cover was cropping real content out of every one of them, same
 * bug CaseStudyMockup.tsx's hero image had. The ink-colored letterbox
 * bars read as bezel, not as a gap.
 */
function DeviceCrossfade({ images, altPrefix }: { images: string[]; altPrefix: string }) {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [springs, api] = useSprings(images.length, (i) => ({
    opacity: i === 0 ? 1 : 0,
    config: { tension: 170, friction: 26 },
  }));

  useEffect(() => {
    if (reducedMotion || paused || images.length < 2) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [reducedMotion, paused, images.length]);

  useEffect(() => {
    api.start((i) => ({ opacity: i === index ? 1 : 0, immediate: reducedMotion }));
  }, [index, api, reducedMotion]);

  return (
    <div
      className="relative h-full w-full bg-[#0e0c0a]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {springs.map((style, i) => (
        <animated.div key={images[i]} className="absolute inset-0" style={style}>
          <Image
            src={images[i]}
            alt={`${altPrefix} screen ${i + 1}`}
            fill
            sizes="640px"
            className="object-contain"
          />
        </animated.div>
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
  const hasDesktopScreens = project.desktopScreens.length > 0;
  const hasMobileScreens = project.hasMobile && project.mobileScreens.length > 0;

  return (
    <div>
      <p className="text-label-caps font-ui text-label text-ember-dim mb-8 text-center">
        {project.title} across screens
      </p>

      <div
        className={`relative mx-auto max-w-[640px] ${project.hasMobile ? "pb-14" : ""}`}
      >
        {/* laptop -- always the real desktop screenshots, cycling on their own */}
        <div className="rounded-t-xl border border-b-0 border-black/10 bg-[#1c1a17] p-2 shadow-[0_40px_80px_rgba(0,0,0,0.35)]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            {hasDesktopScreens ? (
              <DeviceCrossfade
                images={project.desktopScreens}
                altPrefix={`${project.title} desktop`}
              />
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
        </div>
        <div className="relative h-3 rounded-b-xl bg-gradient-to-b from-[#242019] to-[#151311]">
          <div className="absolute top-0 left-1/2 h-1 w-16 -translate-x-1/2 rounded-b-md bg-[#0a0908]" />
        </div>

        {/* phone -- overlapping the laptop's corner, its own real mobile
            screenshots. Desktop-only builds (project.hasMobile: false)
            don't get one -- there's no mobile app to honestly show. */}
        {project.hasMobile ? (
          <div className="absolute -right-1 -bottom-6 w-[28%] max-w-[128px] min-w-[92px] rounded-[22px] border-4 border-[#1c1a17] bg-[#1c1a17] shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[16px]">
              {hasMobileScreens ? (
                <DeviceCrossfade
                  images={project.mobileScreens}
                  altPrefix={`${project.title} mobile`}
                />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: markGradient(index + 1) }}
                >
                  <span className="font-display text-paper/25 text-2xl">
                    {initials(project.title)}
                  </span>
                </div>
              )}
              <div className="absolute top-1.5 left-1/2 h-2.5 w-10 -translate-x-1/2 rounded-full bg-[#0a0908]" />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
