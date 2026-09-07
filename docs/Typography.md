# Typography — Dheeraj Reddy Portfolio 2026

All fonts are sourced from **Fontshare** (fontshare.com), chosen specifically to avoid the generic Inter/Montserrat/Raleway family that dominates developer portfolios. Every font below is free for commercial use under Fontshare's license (verify current license terms per font at build time).

---

## 1. The Type System — 4 Fonts, 4 Jobs

| Role | Font (Fontshare) | Why |
|---|---|---|
| **Signature / Name Intro** | **Gambetta** (Italic, weight 500–700) | An elegant, high-contrast serif with a genuinely "written" italic — perfect for the opening animation where "Dheeraj" appears stroke-by-stroke. Feels handcrafted, not corporate. |
| **Display / Section Headings** | **Clash Display** (weight 500–700, especially 600 "Semibold") | Geometric, confident, slightly architectural sans — carries the "I build things with precision" message in large sizes. Used for H1/H2 and hero sub-line. |
| **UI / Nav / Labels / Buttons** | **Switzer** (weight 500–600) | Clean, technical grotesk with excellent tracking at small sizes — used for nav items, buttons, tags, section labels, metadata (dates, stack lists). |
| **Body Copy** | **General Sans** (weight 400–500) | High-legibility humanist sans with warmth Inter lacks — used for paragraphs, project descriptions, about text. Optimized for long-form reading at 16–18px. |
| **Code / Data accents** | **Space Mono** (weight 400, 700) | Not on Fontshare but essential — used only for small tech-stack tags, terminal-style micro-copy ("<available for work/>"), and numeric counters. Keep usage minimal and intentional. |

Do not introduce a 5th typeface without updating this document — the constraint of exactly 4 (+1 mono accent) is what keeps the site feeling designed rather than assembled.

---

## 2. Font Pairing Rationale

- **Gambetta (serif, emotional) + Clash Display (sans, structural) + General Sans (sans, neutral)** gives three distinct "voices": the signature is personal and artful, the display type is bold and technical, and body copy is quiet and readable — mirroring the brief's ask for a portfolio that's expressive *and* clear.
- **Switzer** sits between Clash Display and General Sans in personality, so UI chrome (nav, buttons, labels) doesn't compete with headings but still feels intentional, not default-browser.
- Contrast is the goal: Gambetta's italic curves against Clash Display's geometric squareness is the site's core typographic tension — reuse this pairing anywhere two type styles need to interact (e.g., a headline with one word set in Gambetta italic for emphasis, like *"Full-stack developer who **ships**."*).

---

## 3. Type Scale (desktop / mobile, `rem` @ 16px root)

| Token | Desktop | Mobile | Font | Weight | Line-height | Tracking |
|---|---|---|---|---|---|---|
| `--text-hero-name` | 12rem–18rem (fluid, `clamp()`) | 4.5rem | Gambetta Italic | 600 | 0.9 | -0.01em |
| `--text-display-1` (H1) | 5.5rem | 2.75rem | Clash Display | 600 | 1.0 | -0.02em |
| `--text-display-2` (H2, section titles) | 3.25rem | 2rem | Clash Display | 600 | 1.05 | -0.02em |
| `--text-display-3` (H3, card titles) | 1.75rem | 1.375rem | Clash Display | 500 | 1.15 | -0.01em |
| `--text-body-lg` (intro paragraphs) | 1.375rem | 1.125rem | General Sans | 400 | 1.5 | 0 |
| `--text-body` (default) | 1.0625rem | 1rem | General Sans | 400 | 1.6 | 0 |
| `--text-ui` (nav, buttons) | 0.9375rem | 0.9375rem | Switzer | 500 | 1.2 | 0.02em (uppercase variants: 0.06em) |
| `--text-label` (eyebrows, tags) | 0.75rem | 0.75rem | Switzer | 600 | 1.2 | 0.08em, uppercase |
| `--text-mono` (stack tags, counters) | 0.8125rem | 0.75rem | Space Mono | 400/700 | 1.4 | 0 |

Use CSS `clamp()` for all hero/display sizes so the name-intro and H1 scale fluidly between 375px and 1920px viewports rather than jumping at breakpoints.

---

## 4. Loading Strategy (performance-critical)

1. Self-host all Fontshare `.woff2` files (download from Fontshare, do not link their CDN — avoids third-party request + gives full control) via `next/font/local`.
2. Load only the weights actually used: Gambetta (500 italic, 600 italic), Clash Display (500, 600), Switzer (500, 600), General Sans (400, 500). That's ~7 font files total — keep the budget here, do not import full family ranges.
3. Space Mono: use `next/font/google` (it's on Google Fonts) with `display: 'swap'` and only weights 400/700.
4. `font-display: swap` for everything except Gambetta on the intro screen, which should use `font-display: block` with a short fallback timeout (max 100ms) since the entire opening animation depends on it rendering correctly — a FOUT on the name-write animation would break the site's first impression.
5. Preload the Gambetta italic woff2 in `<head>` (`<link rel="preload">`) since it's needed for the very first paint interaction.
6. Fallback stack: `Gambetta, "Times New Roman", serif` / `Clash Display, "Arial Black", sans-serif` / `General Sans, -apple-system, sans-serif` — sized with `size-adjust` in the `@font-face` (or next/font's automatic adjustment) to minimize layout shift (CLS) when fonts swap in.

---

## 5. Usage Rules

- Never set body copy in Clash Display or Gambetta — both are display-only, legibility drops below ~24px.
- Never use more than 2 typefaces in a single component (e.g., a project card = Clash Display title + General Sans description; do not add a 3rd).
- All-caps text is reserved for `--text-label` (Switzer 600, 0.08em tracking) only — never set Clash Display or General Sans in all-caps, it breaks their designed letterforms.
- Gambetta italic is reserved for: the name intro, the emphasized word inside a hero headline, and pull-quotes/testimonials if added later. It should read as a signature, not a body-text option — overusing it dilutes the opening moment.
- Numerals (years, stats like "3+ years", "10+ projects") always use Space Mono tabular figures for a technical, "readout" feel that contrasts nicely against the editorial serif/sans mix.

---

## 6. The Name-Intro Typography Spec

Since the opening animation is a signature requirement of the brief:

- Text: **"Dheeraj"** set in Gambetta Italic 600, `--text-hero-name` size, `--color-paper` on `--color-ink` background.
- Render as an SVG (convert the font outline to path data at build time, e.g., via `opentype.js` or a pre-exported SVG path) so it can be **stroke-drawn** with GSAP's `DrawSVGPlugin` (or a hand-rolled `stroke-dasharray` animation) rather than faded/typed in — this is what makes it feel "written," not just displayed.
- After the stroke completes, the fill washes in with `--gradient-ember-glow` behind it for one beat before the whole lockup scales down and translates into the persistent nav-bar logo position, physically connecting the intro to the rest of the site (see `Animation_system.md §2` for full sequence and timing).
