# UI/UX Brief — Dheeraj Reddy Portfolio 2026

Translates `PRD.md` requirements and `Design_System.md`/`Typography.md`/`Animation_system.md` tokens into a section-by-section layout and interaction brief. This is the doc to hand to yourself (or a designer) when actually laying out screens.

---

## 1. Site Map

```
/                       Home (single scrolling page, sections below)
  ├─ Intro (name animation, once per fresh session)
  ├─ Hero
  ├─ About / Story
  ├─ Selected Work (project cards, 5 featured)
  ├─ Skills & Stack
  ├─ Process (optional — freelance audience)
  └─ Contact / Footer
/work/[slug]            Optional project detail page (only if a project needs more space than a card affords — recommend for at least the IEEE project and Tony's Angel Tattooz)
```

Single-page-scroll for v1 keeps scope realistic (per `PRD.md §7` constraint) while still allowing deep-dive detail pages for the 1–2 projects that need them.

---

## 2. Navigation

- Fixed top nav, transparent over the hero/intro, transitions to glass-panel (`Design_System.md §4`) after 80px scroll.
- Left: name-mark (the settled intro logo). Center or right: section links (About, Work, Skills, Contact) with the ember active-indicator pill (`Animation_system.md §4`).
- Right-aligned: resume download + primary CTA button, always visible (not hidden in a hamburger on desktop).
- Mobile: hamburger reveals a full-screen ink-background menu, Clash Display large section links, staggered fade-in per `Animation_system.md §5`.

---

## 3. Section-by-Section Layout

### 3.1 Intro
- Full-viewport, `--color-ink`, centered name animation per `Typography.md §6` / `Animation_system.md §2`.
- Skip link bottom-right, appears at 0.8s.

### 3.2 Hero
- Layout: asymmetric two-zone. Left/center ~60% width: eyebrow label ("Full-Stack Developer & Product Builder"), H1 role statement (Clash Display, with one word in Gambetta italic for emphasis per `Typography.md §2`), sub-line (General Sans body-lg), primary CTA ("See my work" scrolls to Work section) + secondary CTA ("Get in touch").
- Right/background ~40–100% (bleeds behind text at low opacity): the 3D hero object, per `Animation_system.md §6` — positioned so it never sits directly behind body-lg text (contrast/readability).
- Below the fold-line but still in first viewport on most screens: the proof-strip (`PRD.md §5.1`) — small Space Mono row of facts, subtle horizontal marquee or static row depending on final content length.
- Scroll cue: small animated chevron/line at bottom center, fades on scroll start.

### 3.3 About / Story
- This is one of the 1–2 `--color-paper` (light) sections per `Design_System.md §2.4` — a deliberate rhythm break after the intense hero.
- Layout: large pull-style opening line (Clash Display, e.g., "From an IEEE-published research project to shipping client sites — I build things that work.") followed by 2–3 short paragraphs (General Sans) covering the CS/AI background, TCS role, HACK SIST leadership, and the "builder/founder" throughline.
- Optional: a simple annotated timeline (Space Mono years + Switzer labels) — University → IEEE publication → HACK SIST → TCS → YDR Digital founding — gives recruiters a fast scan path without reading full paragraphs.

### 3.4 Selected Work
- The most important section — largest share of build effort.
- Layout: not a uniform grid — vary card sizes to signal importance (e.g., IEEE project and one flagship shipped project get large "feature" cards; others get standard cards), consistent with the "editorial asymmetry" principle in `Design_System.md §3`.
- Each card: media (screenshot/frame per `Design_System.md §5`), title (Clash Display), status badge (small label: Shipped / In Progress / Concept / Published Research — color-coded via `--color-ember` for shipped, `--color-bone`/muted for concept, never hidden), one-line outcome (General Sans), stack tags (Switzer/Space Mono chips), link icons (GitHub/live/paper).
- Interaction: hover state per `Animation_system.md §4`; click opens either an in-page expanding detail (Motion `layoutId` shared-element transition into a modal/panel) or navigates to `/work/[slug]` for the two projects that warrant full detail pages.
- Scroll reveal: staggered card entrance per `Animation_system.md §5`, optionally the horizontal-scrub treatment for this section specifically (§5 allows one such section).

### 3.5 Skills & Stack
- Grouped categories per `PRD.md §5.4`, not a tag cloud.
- This is the recommended home for the scroll-scrubbed "assembling 3D object" moment (`Animation_system.md §6`) — as the user scrolls through skill categories, the 3D form visually assembles/reveals facets tied to each category, reinforcing "full-stack = all pieces fitting together."
- Fallback for reduced-motion/low-tier devices: same categorized list, static layout, no scrub dependency — content must stand alone.

### 3.6 Process (optional, freelance-facing)
- Short, 3–4 step horizontal or vertical process outline (Discover → Design/Spec → Build → Launch), light on animation (simple staggered reveal only) — this section supports the freelance-client persona without competing for attention with Selected Work.

### 3.7 Contact / Footer
- Second `--color-paper` (light) section — bookends the page, gives a calm, high-contrast close.
- Large Clash Display prompt ("Let's build something.") + primary CTA (mailto or contact form) + resume download.
- Footer row: social/profile links (GitHub, LinkedIn, YDR Digital), small copyright/credit line, name-mark repeated small.

---

## 4. Responsive Behavior

- Breakpoints: mobile `<768px`, tablet `768–1279px`, desktop `≥1280px` (matches grid in `Design_System.md §3`).
- 3D scenes: hero object shrinks and simplifies (Tier 2 per `TRD.md §4.3`) below 1024px viewport width by default, regardless of device capability, to protect layout space for text on smaller screens.
- Horizontal-scrub work section (if used) converts to standard vertical stacked cards on mobile/touch — horizontal scroll-jacking on mobile is a common usability failure and must not ship.
- Type scale uses fluid `clamp()` throughout per `Typography.md §3` so there are no jarring jumps at breakpoints.
- Custom cursor and magnetic-hover effects are fully disabled on touch/coarse-pointer devices (`Animation_system.md §4`) — touch targets get standard tap feedback (scale/opacity) instead.

---

## 5. Interaction Principles (summary — full spec in `Animation_system.md`)

1. Every hover effect has a touch/keyboard equivalent.
2. Nothing animates infinitely at high intensity — idle states are subtle (breathing glow, slow rotation), never distracting from reading.
3. First scroll after the intro should feel *calmer* than the intro, not louder — the intro is the peak, not the baseline.
4. Status/proof information (project status badges, stack tags, dates) is never animated in a way that delays comprehension — these render instantly, only position/entrance is animated.

---

## 6. Accessibility Notes (summary — full spec in `TRD.md §9`)

- Contrast, focus states, reduced-motion, and alt text requirements are binding, not aspirational — verify each section against `Design_System.md §2.4` and `Animation_system.md §7` before considering it "done."
- Skip-to-content link present for keyboard users bypassing the intro/nav entirely.
