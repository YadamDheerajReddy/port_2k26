# Design System — Dheeraj Reddy Portfolio 2026

Codename: **"Ember & Ink"**
This document is the single source of truth for color, spacing, elevation, surfaces, iconography, and component-level visual rules. `Typography.md` and `Animation_system.md` extend this file and must be read alongside it — all three share the same token names.

---

## 1. Design Principles

1. **Clarity before spectacle.** Every 3D element, hover state, and animation exists to reinforce a message, never to replace one. If a motion doesn't help the visitor understand what Dheeraj can do, it gets cut.
2. **10-second comprehension.** The hero must communicate identity (name), role, and proof of skill before any scroll. Visual hierarchy is built backward from that constraint.
3. **Warm, not corporate.** Reject the "generic SaaS blue + Inter" template entirely. The palette and type are intentionally unlike 90% of developer portfolios.
4. **Depth with restraint.** 3D and grain/texture create tactility, but the content grid stays clean and editorial underneath — like a well-designed print magazine that happens to be interactive.
5. **Performance is a design constraint, not an afterthought.** Every visual decision is tested against Core Web Vitals (see `TRD.md §7`).

---

## 2. Color System

No blue. The system is built around a warm ink/paper base with two high-energy accents, so the site feels alive and slightly rebellious against the typical dev-portfolio look, while staying premium and legible.

### 2.1 Core Palette

| Token | Hex | Role |
|---|---|---|
| `--color-ink` | `#0E0C0A` | Primary background (warm near-black, not pure black) |
| `--color-ink-raised` | `#17140F` | Card / panel surfaces on dark background |
| `--color-paper` | `#F7F2E9` | Primary light surface / inverted sections / light-mode base |
| `--color-paper-dim` | `#EDE6D6` | Secondary light surface |
| `--color-ember` | `#FF4D1C` | Primary accent — CTAs, active states, key highlights |
| `--color-ember-dim` | `#C43B14` | Ember pressed/hover-dark variant |
| `--color-acid` | `#D4FF3F` | Secondary accent — cursor glow, micro-highlights, "live" indicators. Use sparingly (≤5% of any viewport) |
| `--color-rust` | `#7A1F1A` | Depth accent — gradients, glow falloff, shadow tinting |
| `--color-bone` | `#B8AFA0` | Muted text on ink background (secondary copy) |
| `--color-graphite` | `#3A362F` | Muted text on paper background (secondary copy) |

### 2.2 Semantic Tokens

| Token | Light-on-dark value | Notes |
|---|---|---|
| `--bg-primary` | `--color-ink` | Default site background |
| `--bg-inverted` | `--color-paper` | Used for 1–2 "breather" sections (e.g., About, Contact) to reset visual rhythm |
| `--text-primary` | `--color-paper` (on ink) / `--color-ink` (on paper) | Headings, primary copy |
| `--text-secondary` | `--color-bone` (on ink) / `--color-graphite` (on paper) | Supporting copy, captions |
| `--accent-primary` | `--color-ember` | Links, CTA fills, active nav state, cursor default |
| `--accent-secondary` | `--color-acid` | Hover glows, badge highlights, terminal/code accents |
| `--border-subtle` | `rgba(247,242,233,0.08)` on ink / `rgba(14,12,10,0.08)` on paper | Hairline dividers, card borders |
| `--focus-ring` | `--color-acid` at 100% opacity, 2px | Keyboard focus only — never removed |

### 2.3 Gradients (use max 1–2 per viewport)

- `--gradient-ember-glow`: radial, `--color-ember` → `--color-rust` → transparent — used behind the hero name and key 3D anchor points.
- `--gradient-ink-vignette`: linear, `--color-ink` 0% → transparent 40% → `--color-ink` 100% — used to fade 3D canvases into the page edges so WebGL never looks like a "pasted-in widget."

### 2.4 Usage Rules

- Default theme is **dark (ink)**. Paper is used for exactly 1–2 sections to break rhythm (recommended: About/Story section and Footer/Contact) — never alternate every section, that reads as templated.
- Ember is the only color allowed on primary CTAs. Never use acid for a button fill — acid is a highlight/accent color only (text glow, underline, particle color, cursor trail).
- Maintain **60/30/10**: 60% ink/paper (base), 30% bone/graphite/paper-dim (structure), 10% ember+acid combined (energy). If accent color starts to feel like more than 10% of a screen, pull back.
- All accent-on-dark color pairs must pass **WCAG AA (4.5:1)** for body text, 3:1 for large text/UI. Ember `#FF4D1C` on ink `#0E0C0A` passes for large text/headings only — never use ember for small body copy, only for headings, links, and UI chrome.

---

## 3. Layout & Grid

- **Base unit:** 8px spacing scale — `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`. Tailwind's default spacing scale is overridden to snap to this.
- **Grid:** 12-column on desktop (≥1280px), 8-column tablet (768–1279px), 4-column mobile (<768px). Gutter 24px desktop / 16px mobile.
- **Max content width:** 1440px container, with full-bleed sections allowed for hero/3D moments (edge-to-edge canvas, content still constrained to a 1200px reading column inside it).
- **Section rhythm:** vertical padding uses `128px` desktop / `64px` mobile between major sections as the default; hero and name-intro are exceptions (100dvh).
- **Editorial asymmetry:** avoid perfectly centered symmetric layouts throughout — use off-center hero copy, staggered project cards, and varied column spans per section to keep the "generic template" feeling away.

---

## 4. Elevation & Surface Treatment

- **No soft-UI drop shadows.** Depth comes from three sources instead: (1) subtle grain/noise texture overlay (2–3% opacity) across the whole site for a tactile, non-flat-vector feel; (2) real WebGL depth in hero/project-detail 3D objects; (3) a 1px `--border-subtle` hairline + slight background-color shift (`ink` → `ink-raised`) for cards instead of shadows.
- **Glass panels** (used sparingly — nav bar on scroll, project modal): `backdrop-filter: blur(16px)`, background `rgba(14,12,10,0.6)`, 1px `--border-subtle` edge.
- **Corner radius scale:** `4px` (chips/tags), `8px` (buttons, inputs), `16px` (cards), `24px` (large media/project thumbnails). No fully-pill buttons except tags/badges — keep the geometric, slightly technical feel from the type system.

---

## 5. Iconography & Imagery

- Icons: **Phosphor Icons (Duotone or Bold weight)** or **Lucide** with custom stroke-width 1.5, recolored to `--text-secondary` default / `--accent-primary` on hover. No default outline packs without customization — must match the geometric display type.
- Custom mark: a simple monogram/glyph built from the "D" in the chosen display font, used as a loading-state icon, favicon, and cursor companion — never a generic "briefcase/rocket" cliché icon set for section markers.
- Project imagery: screenshots get a consistent frame treatment (browser chrome or device mockup in `--color-ink-raised`, 16px radius, subtle grain matching the page) so a Next.js dashboard shot and a mobile app shot from Flexnect feel like one system, not mismatched screenshots.
- Photography (if a portrait is used): duotone-treated in `--color-ink` / `--color-ember` to stay on-palette rather than a raw photo that reintroduces arbitrary color.

---

## 6. Cursor & Interaction Chrome

- Custom cursor: a small ring in `--color-acid` that scales/morphs contextually (grows over draggable 3D objects, becomes a filled ember dot over links, hides over text inputs). Implemented with Motion (motion.dev), disabled entirely on touch devices — see `Animation_system.md §6`.
- Link underline style: 1px `--border-subtle` static underline that fills to solid `--color-ember` on hover (see `Animation_system.md`), not just a color change — reinforces the "craft" feel.

---

## 7. Component Tokens (reference — full specs in code, not this doc)

| Component | Key rule |
|---|---|
| Primary button | Ink text on Ember fill (dark mode inverted case: paper text), 8px radius, magnetic hover pull (see Animation_system.md §4) |
| Secondary button | Transparent fill, 1px `--border-subtle`, border brightens to `--color-ember` on hover |
| Nav bar | Transparent over hero, glass-panel after 80px scroll, logo-mark left, ember pill for active section indicator |
| Project card | `--color-ink-raised` surface, 16px radius, image reveals on scroll (clip-path wipe, not fade), hover tilts subtly toward cursor (max 6°, see 3D rules) |
| Section label | Small caps, Switzer Medium, `--color-ember`, preceded by a `/` or `—` glyph as a recurring signature motif |

---

## 8. What to Avoid (explicit anti-goals)

- No blue anywhere in the core palette (including grays with a blue cast — all neutrals must be warm-tinted).
- No Inter/Roboto/Montserrat/Raleway/Poppins/Open Sans.
- No default shadcn "purple gradient hero" look.
- No particle.js starfield backgrounds — any particle/3D system must be original and tied to a concept (see `Animation_system.md §5`).
- No more than one full-viewport 3D scene competing with the hero name reveal at once.
