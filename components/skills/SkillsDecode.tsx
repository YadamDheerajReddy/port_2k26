"use client";

import { useRef, useState } from "react";
import { skillGroups } from "@/lib/content";
import { Tag } from "@/components/ui/Tag";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ&/-·";
const DECODE_FRAMES = 14;

function randomGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

/**
 * Selected concept: "Chromatic Glitch" text-decode switcher. Clicking a
 * category scrambles the heading through random glyphs, locking each
 * character in left to right, while two colour-split copies (ember/acid,
 * mix-blend-screen) flicker a few px off-register behind it -- a broken
 * signal resolving into focus, not just letters cycling. Tools fade in
 * once the heading settles.
 *
 * The scramble is plain useState, not a ref-driven imperative loop: it
 * only runs for ~14 frames on a discrete click, nowhere near the
 * continuous-update territory (WorkIndex's per-mousemove tracking) that
 * actually needs to dodge React's render cycle.
 *
 * A token guard (tokenRef) is what makes rapid tab-clicking safe: each
 * decodeTo() call gets a new token, and the rAF loop bails the instant
 * its own token is stale, so a fast second click can't have two loops
 * both still writing to displayText.
 */
export function SkillsDecode() {
  const reducedMotion = useReducedMotion();

  const [activeIndex, setActiveIndex] = useState(0);
  const [displayText, setDisplayText] = useState(skillGroups[0].category.toUpperCase());
  const [glitching, setGlitching] = useState(false);
  const [visibleItems, setVisibleItems] = useState(skillGroups[0].items);
  const [chipsShown, setChipsShown] = useState(true);

  const tokenRef = useRef(0);

  function decodeTo(index: number) {
    if (index === activeIndex) return;
    const token = ++tokenRef.current;
    const text = skillGroups[index].category.toUpperCase();

    if (reducedMotion) {
      setDisplayText(text);
      setActiveIndex(index);
      setVisibleItems(skillGroups[index].items);
      return;
    }

    setGlitching(true);
    let frame = 0;

    function tick() {
      if (token !== tokenRef.current) return;
      frame++;
      const lockedUpTo = Math.floor((frame / DECODE_FRAMES) * text.length);
      let out = "";
      for (let k = 0; k < text.length; k++) {
        out += k < lockedUpTo || text[k] === " " ? text[k] : randomGlyph();
      }
      setDisplayText(out);

      if (frame < DECODE_FRAMES) {
        requestAnimationFrame(tick);
        return;
      }

      setGlitching(false);
      setActiveIndex(index);
      setVisibleItems(skillGroups[index].items);
      setChipsShown(false);
      // Double rAF: paint the opacity:0 state first, then flip to shown --
      // flipping in the same tick collapses into the browser's next paint
      // and the transition never has a "from" state to animate out of.
      requestAnimationFrame(() => requestAnimationFrame(() => setChipsShown(true)));
    }
    tick();
  }

  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-2.5">
        {skillGroups.map((group, i) => (
          <button
            key={group.category}
            type="button"
            onClick={() => decodeTo(i)}
            aria-pressed={activeIndex === i}
            className={`text-mono rounded-full border px-4 py-2 font-mono transition-colors duration-200 ${
              activeIndex === i
                ? "bg-ember border-ember text-ink font-bold"
                : "border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {group.category}
          </button>
        ))}
      </div>

      <div className="relative mx-auto mt-12 inline-block">
        <span
          aria-hidden
          className={`text-ember pointer-events-none absolute inset-0 [mix-blend-mode:screen] transition-all duration-150 ${
            glitching ? "translate-x-[3px] opacity-70" : "translate-x-0 opacity-0"
          }`}
        >
          {displayText}
        </span>
        <span
          aria-hidden
          className={`text-acid pointer-events-none absolute inset-0 translate-y-[1px] [mix-blend-mode:screen] transition-all duration-150 ${
            glitching ? "-translate-x-[3px] opacity-70" : "translate-x-0 opacity-0"
          }`}
        >
          {displayText}
        </span>
        <h3 className="font-display text-display-1 relative text-[var(--text-primary)]">
          {displayText}
        </h3>
      </div>

      <div className="mt-10 flex flex-wrap justify-center gap-2.5">
        {visibleItems.map((item, i) => (
          <span
            key={item}
            style={
              reducedMotion
                ? undefined
                : {
                    opacity: chipsShown ? 1 : 0,
                    transform: chipsShown ? "none" : "translateY(8px)",
                    transition: `opacity 0.4s ${i * 0.05}s, transform 0.4s ${i * 0.05}s`,
                  }
            }
          >
            <Tag>{item}</Tag>
          </span>
        ))}
      </div>
    </div>
  );
}
