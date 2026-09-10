"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useSpring, animated, to } from "@react-spring/web";
import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Footer } from "@/components/footer/Footer";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";

const MAX_TILT_DEG = 5;
const SCRAMBLE_CHARS = "01_/\\#$%&";
const SCRAMBLE_FRAMES = 14;
const SCRAMBLE_MS = 520;

/**
 * "404" decodes in like a corrupted value settling, one character at a
 * time left to right, rather than just appearing -- same one-time-on-mount
 * spirit as AboutContent's signature draw, not a looping effect. Starts
 * already-settled ("404", no scramble) by default: ReducedMotionProvider's
 * SSR-safe default is `reduced: true` until it resolves the real
 * matchMedia value, so this never flashes an unreadable scramble for
 * server-rendered markup or a reduced-motion visitor -- only once `reduced`
 * flips to a confirmed `false` does the effect re-run and actually play it.
 */
function useScrambleIn(target: string, reducedMotion: boolean) {
  const [text, setText] = useState(target);

  useEffect(() => {
    if (reducedMotion) {
      setText(target);
      return;
    }

    let frame = 0;
    const id = setInterval(() => {
      frame++;
      if (frame >= SCRAMBLE_FRAMES) {
        setText(target);
        clearInterval(id);
        return;
      }
      const revealCount = Math.floor((frame / SCRAMBLE_FRAMES) * target.length);
      setText(
        target
          .split("")
          .map((char, i) =>
            i < revealCount
              ? char
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
          )
          .join(""),
      );
    }, SCRAMBLE_MS / SCRAMBLE_FRAMES);

    return () => clearInterval(id);
  }, [target, reducedMotion]);

  return text;
}

/**
 * Reuses CaseStudyMockup's exact browser-chrome frame (traffic lights,
 * #242019 bar) rather than inventing a new "error page" shape -- Strata is
 * a real Chromium browser he built, so "the browser hit a dead end" is a
 * conceit that's actually his, not a generic 404 illustration. The address
 * bar shows the real attempted path (usePathname), and the whole card
 * tilts on the cursor exactly like a case study hero does.
 */
export default function NotFound() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const active = pointerFine && !reducedMotion;

  const digits = useScrambleIn("404", reducedMotion);

  const cardRef = useRef<HTMLDivElement>(null);
  const [{ rx, ry }, api] = useSpring(() => ({
    rx: 0,
    ry: 0,
    config: { tension: 200, friction: 20 },
  }));

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!active || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    api.start({ rx: -py * MAX_TILT_DEG, ry: px * MAX_TILT_DEG });
  }

  function handleMouseLeave() {
    api.start({ rx: 0, ry: 0 });
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center px-6 py-32">
        <div
          ref={cardRef}
          onMouseMove={active ? handleMouseMove : undefined}
          onMouseLeave={active ? handleMouseLeave : undefined}
          className="w-full max-w-[640px]"
        >
          <animated.div
            className="rounded-media bg-ink-raised overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.45)]"
            style={
              active
                ? {
                    transform: to(
                      [rx, ry],
                      (rxDeg, ryDeg) =>
                        `perspective(1200px) rotateX(${rxDeg}deg) rotateY(${ryDeg}deg)`,
                    ),
                  }
                : undefined
            }
          >
            <div
              aria-hidden
              className="flex items-center gap-3 border-b border-white/5 px-4 py-3"
              style={{ background: "#242019" }}
            >
              <span className="flex flex-shrink-0 gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f56" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#27c93f" }} />
              </span>
              <div className="font-mono text-mono flex flex-1 items-center gap-2 truncate rounded-full border border-white/5 bg-black/20 px-3 py-1.5 text-[var(--text-secondary)]">
                <span className="truncate">
                  dheerajdev.space{pathname}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center px-8 py-16 text-center md:px-14 md:py-20">
              <SectionLabel>Page not found</SectionLabel>

              <div
                aria-hidden
                className="font-display text-ember tabular-nums mt-6 text-[clamp(4.5rem,14vw,8rem)] leading-none"
              >
                {digits}
              </div>

              <h1 className="font-display text-display-2 mt-4 text-[var(--text-primary)]">
                This route doesn&apos;t exist
              </h1>
              <p className="text-body mt-4 max-w-[440px] text-[var(--text-secondary)]">
                Chrome couldn&apos;t find this page. Neither can I -- whatever you were
                looking for isn&apos;t at this address.
              </p>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <MagneticWrap>
                  <Button href="/" variant="primary">
                    Back to home
                  </Button>
                </MagneticWrap>
                <MagneticWrap>
                  <Button href="/#work" variant="secondary">
                    See my work
                  </Button>
                </MagneticWrap>
              </div>
            </div>
          </animated.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
