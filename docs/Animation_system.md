# Animation System — Dheeraj Reddy Portfolio 2026

Governs every moving pixel on the site: the name-intro sequence, scroll choreography, hover micro-interactions, and 3D behavior. Read alongside `Design_System.md` (tokens) and `Typography.md` (name-intro type spec).

**Golden rule:** motion clarifies hierarchy and rewards exploration — it never blocks reading, never runs longer than the user's patience, and always respects `prefers-reduced-motion`.

---

## 1. Tooling & Division of Labor

| Tool | Used for | Why |
|---|---|---|
| **Motion (motion.dev, formerly Framer Motion)** | React component-level animation: enter/exit transitions, layout animations, hover/tap gestures, `AnimatePresence` for route/section transitions, the custom cursor | Declarative, integrates natively with React state, best for UI-driven motion |
| **GSAP + ScrollTrigger** | Timeline-based sequences: the name-intro, pinned scroll sections, scrubbed animations tied to scroll position, complex multi-element choreography | Frame-accurate timelines and scroll-scrubbing are GSAP's strength; Motion's scroll utilities are lighter-weight and not built for this level of choreography |
| **React Three Fiber + drei** | All 3D: hero background object, project-detail 3D previews, cursor-reactive elements | See `TRD.md §4` for full 3D architecture |
| **GSAP DrawSVGPlugin (Club GreenSock) or a custom stroke-dasharray hook** | Name-intro SVG stroke reveal | Purpose-built for path drawing; if avoiding the paid Club plugin, implement via `stroke-dasharray`/`stroke-dashoffset` animated with GSAP's core tween |

Rule of thumb: **GSAP owns timelines and scroll**, **Motion owns component/interaction state**, **R3F owns anything WebGL**. Do not use two libraries to animate the same element.

---

## 2. The Opening Sequence (name-intro → reveal)

This is the site's signature moment and must be tuned obsessively. Total duration target: **2.2–2.8 seconds** before the visitor can start reading the hero (skippable after 0.8s — see §7).

**Timeline (GSAP master timeline, `tl`):**

1. `0.0s` — Ink background (`--color-ink`) fills instantly, no fade-in (avoid a slow black-screen wait).
2. `0.1s–1.4s` — "Dheeraj" SVG path strokes on, letter-by-letter, using `stroke-dashoffset` animated `1 → 0` per glyph, staggered `0.06s` apart, eased with a custom `power2.inOut`-based signature curve (see §3). Stroke color `--color-paper` at 60% opacity, 1.5px weight, no fill yet.
3. `1.2s–1.6s` (slight overlap) — `--gradient-ember-glow` radial fades in centered behind the name, `scale 0.8 → 1.1`, opacity `0 → 0.6`.
4. `1.5s–1.9s` — Fill washes into the stroked letterforms (`fill-opacity 0 → 1`) left to right, as if ink is being poured into the outline.
5. `1.9s–2.3s` — Whole name lockup scales down (`scale 1 → 0.14`) and translates to the top-left nav position with `power3.inOut` easing, simultaneously fading in the persistent nav bar and hero content underneath (`opacity 0 → 1`, `y: 24px → 0`, staggered by section: eyebrow label → H1 → sub-line → CTA → scroll cue).
6. `2.3s+` — Idle: name-mark in nav gets a subtle breathing glow loop (4s cycle, barely perceptible) tying back to the intro without being distracting.

**On repeat visits (same session):** store a `sessionStorage` flag; skip straight to the settled nav-logo state with a 300ms fade instead of replaying the full sequence, so returning to the homepage via in-site navigation doesn't force the intro every time. Fresh sessions (new tab, new visit) always get the full sequence — first impression matters most for a portfolio.

---

## 3. Motion Language / Easing Tokens

Define once, reuse everywhere (as GSAP eases + Motion transition presets):

| Token | Curve | Use case |
|---|---|---|
| `--ease-signature` | `cubic-bezier(0.65, 0, 0.35, 1)` | Name-intro strokes, hero reveals — smooth, slightly dramatic |
| `--ease-snap` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | Buttons, hover states, cursor — fast response, soft landing |
| `--ease-scroll` | linear (scrubbed to scroll position) | Any ScrollTrigger `scrub: true` animation |
| `--ease-magnetic` | spring (`stiffness: 300, damping: 20` in Motion) | Magnetic button pull, card tilt |

**Duration tokens:** `--dur-micro: 150ms` (hover/tap feedback), `--dur-fast: 300ms` (small transitions), `--dur-base: 600ms` (section reveals), `--dur-slow: 1000ms+` (only for the intro sequence and hero-to-content handoff).

---

## 4. Micro-Interactions (hover, click, cursor)

- **Magnetic buttons:** primary CTAs pull toward the cursor within a 40px radius (Motion `useMotionValue` + spring), max displacement 8px, snaps back with `--ease-magnetic` on mouse leave.
- **Link underlines:** static 1px hairline underline sits under all inline links by default; on hover it fills solid in `--color-ember` from left to right (`scaleX 0 → 1`, `transform-origin: left`), `--dur-fast`.
- **Project cards:** on hover, image scales `1 → 1.05` inside a fixed-radius clip container (never overflow the card edge), card lifts via a slight `translateY(-4px)` + border brightening — no drop shadow (per `Design_System.md §4`). If pointer is fine (desktop), card also tilts up to 6° toward cursor position using a lightweight perspective-tilt hook (vanilla-tilt-style, hand-rolled with Motion, capped rotation).
- **Custom cursor:** a `--color-acid` ring (24px) with a smaller ember dot inside, both driven by `useMotionValue`/`useSpring` in Motion for smooth trailing lag (~0.15s). States: default (ring only), over-link (ring fills solid ember, dot hides), over-draggable-3D (ring becomes a "drag" affordance with a small arrow glyph, using Space Mono-styled text label), over-text-input (cursor hides, native caret shows). **Disabled entirely on touch/coarse-pointer devices** via `@media (pointer: fine)` check — never fake a cursor on mobile.
- **Nav active-section indicator:** an ember pill slides between nav items (Motion `layoutId` shared-element transition) as ScrollTrigger updates the active section — this single detail does a lot to make the nav feel "alive."

---

## 5. Scroll Choreography

- **Section reveals:** default pattern for entering content — `opacity 0→1`, `y: 32px → 0`, staggered children (labels first, then headline, then body, then media), triggered at `viewport: { once: true, margin: "-15% 0px" }` in Motion, or GSAP ScrollTrigger `start: 'top 80%'` for GSAP-owned sections. **Once-only** — do not re-trigger reveals on scroll-back-up; that reads as gimmicky, not polished.
- **Pinned/scrubbed moments (use max 2 on the whole page, likely: Hero → Skills transition, and one Project deep-dive):** GSAP ScrollTrigger with `pin: true, scrub: 1` to tie a multi-stage animation (e.g., a 3D object rotating/exploding into labeled skill categories) directly to scroll position. Keep pinned sections under 150vh of scroll distance — longer pins frustrate users trying to reach content below.
- **Horizontal project showcase (optional, if content volume supports it):** a horizontally-scrubbed row of project cards inside a pinned vertical section, GSAP `xPercent` tween mapped to scroll progress — common for portfolios done well, becomes generic if overused; limit to one section, likely "Selected Work."
- **Parallax:** subtle only (max 15–20px offset), applied to background 3D elements and large headline text relative to foreground content, via GSAP ScrollTrigger `scrub`. Never parallax body copy — legibility first.

---

## 6. 3D Interaction Rules (behavioral spec — technical spec in `TRD.md §4`)

- The hero 3D object (concept: an abstract geometric form built from interlocking shapes referencing code/structure — e.g., a fractured or assembling polyhedron — not a literal laptop/rocket cliché) sits **behind and to the side of** the hero headline, never overlapping the primary text block at any viewport width.
- It responds to cursor position with subtle rotation (max ±15°) using damped lerping (`drei`'s `useFrame` + lerp, not raw 1:1 mouse tracking — must feel weighted, not jittery).
- On scroll into the "Skills" or "Process" section, the same 3D object (or a related one, for continuity) can transform/assemble in response to scroll progress — reinforcing "pieces coming together" as a metaphor for full-stack skill.
- Any 3D element must render at 60fps on mid-tier hardware or degrade gracefully (see `TRD.md §4.3` for the tiered fallback: full WebGL → simplified geometry → static image, based on device capability detection).
- 3D never triggers layout shift — canvas containers have fixed dimensions reserved before the scene loads.

---

## 7. Accessibility & Restraint Rules (non-negotiable)

- Respect `prefers-reduced-motion: reduce` globally: name-intro becomes a simple 400ms fade/scale (no stroke draw), parallax and pinned-scrub sections disable their scroll-linked motion (content still reveals via simple fade), magnetic buttons and cursor-follow effects are disabled, 3D objects stop idle-rotating (remain static, still cursor-tiltable at reduced amplitude or fully static per user preference).
- **Skip control:** during the name-intro, a small "Skip" text link (Switzer, `--text-label` style) fades in at 0.8s in the bottom-right corner — clicking it jumps straight to the settled state (step 6 in §2) with a 200ms fade. Required for repeat visitors within the same fresh session and for anyone impatient.
- No animation should ever exceed ~3s uninterrupted before yielding control back to the user, except the one-time name-intro.
- All animated content must remain fully readable/operable with JavaScript disabled or animation libraries failing to load — motion is progressive enhancement over a real, accessible DOM (see `TRD.md §6` for the no-JS/degraded fallback).
- Test all hover-dependent interactions have a keyboard/touch equivalent (focus-visible states mirror hover states; tap replaces hover-tilt on touch).
