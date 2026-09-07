# TRD — Technical Requirements Document — Dheeraj Reddy Portfolio 2026

Companion to `PRD.md` (what/why) — this is how it gets built.

---

## 1. Stack Overview

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Static-first (SSG) for a portfolio — no need for SSR/dynamic rendering except the contact-form API route |
| Language | **TypeScript** (strict mode) | Non-negotiable for a portfolio meant to demonstrate engineering quality |
| Styling | **Tailwind CSS v4** + CSS variables for design tokens from `Design_System.md`/`Typography.md` | Tailwind config extended with the exact color/spacing/type tokens — no ad hoc values in components |
| Component-level animation | **Motion (motion.dev)** | See `Animation_system.md §1` |
| Timeline/scroll animation | **GSAP 3 + ScrollTrigger** (+ optionally DrawSVGPlugin if Club GreenSock license is acquired; otherwise custom stroke-dasharray) | |
| 3D | **React Three Fiber + drei + Three.js** | See §4 |
| Fonts | **next/font/local** (self-hosted Fontshare `.woff2`) + `next/font/google` (Space Mono) | See `Typography.md §4` |
| Forms | Next.js Route Handler → **Resend** (or similar transactional email API) for the contact form; simple honeypot + rate-limit, no full backend needed | |
| Hosting | **Vercel** | Matches his existing freelance stack (`ydr-digital` memory: Vercel already in use), free tier sufficient for a portfolio |
| Analytics | **Vercel Analytics** + **Plausible or Vercel Web Analytics** (privacy-friendly, no cookie banner needed) | |
| Version control | Git + GitHub, repo public (it's a portfolio — an inspectable repo is itself a proof point) | |

## 2. Project Structure

```
/app
  /(site)
    page.tsx                 → home (hero, about, work, skills, contact all as sections OR route-split — decide in Implementation_plan Phase 1)
    /work/[slug]/page.tsx    → optional project detail pages (only if content volume justifies it)
    /api/contact/route.ts    → form handler
  layout.tsx                  → root layout, font loading, global providers
/components
  /intro                     → NameIntro, IntroSkipButton
  /hero, /about, /work, /skills, /process, /contact
  /ui                        → Button, Tag, SectionLabel, MagneticWrap, CustomCursor
  /three                     → Scene, HeroObject, SkillsAssembly, fallbackStatic
/lib
  motion-tokens.ts            → easing/duration constants from Animation_system.md
  content.ts / content.json   → typed content model (see §5)
/styles
  globals.css, tokens.css
/public/fonts                 → self-hosted woff2 files
```

## 3. Rendering Strategy

- Fully static (`generateStaticParams` not needed beyond optional project-detail pages) — the entire site can be pre-rendered at build time. No client-fetched content on first load.
- Client Components only where interaction/animation/3D requires it (intro, hero 3D canvas, cursor, scroll-triggered sections); everything else is a Server Component for minimal JS shipped.
- Route segment config: `export const dynamic = 'force-static'` on the home route.

## 4. 3D Architecture

### 4.1 Scene Composition
- One shared `<Canvas>` per major 3D moment (hero, skills-assembly) rather than one persistent full-page canvas — reduces GPU/memory load and avoids fighting scroll-based layout.
- `@react-three/drei` helpers: `useGLTF`/procedural geometry (prefer procedural `Icosahedron`/custom `BufferGeometry` composition over a heavy imported model — keeps bundle size down and matches the "abstract geometric form" concept in `Animation_system.md §6`), `Environment` for lighting (a simple studio HDRI or manually placed lights matching the ink/ember palette), `useFrame` for the damped cursor-follow rotation.
- Materials: use `MeshTransmissionMaterial` or a custom shader sparingly for a premium glass/refraction look on the hero object, tinted toward `--color-ember`/`--color-rust` — avoid default Three.js `MeshStandardMaterial` flatness.

### 4.2 Performance Budget for 3D
- Target: <150KB gzipped JS for the R3F/Three.js bundle (dynamic `import()` it — never in the initial bundle for non-hero routes).
- Geometry complexity: keep hero object under ~5k triangles; use instancing if any particle-like repetition is used.
- Cap devicePixelRatio at 2 (`gl={{ dpr: Math.min(window.devicePixelRatio, 2) }}`) to avoid retina-driven GPU overload.

### 4.3 Tiered Fallback (required, not optional)
1. **Tier 1 (full):** WebGL2 supported, `navigator.hardwareConcurrency` decent, no reduced-motion preference → full interactive 3D scene.
2. **Tier 2 (simplified):** WebGL supported but weaker signals (mobile, lower core count) → same object, no post-processing, lower geometry detail, no cursor-follow (auto-rotate slow idle only).
3. **Tier 3 (static):** WebGL unavailable, `prefers-reduced-motion`, or explicit low-end detection → pre-rendered static image/SVG of the hero object in place of the canvas, so layout stays visually consistent with zero JS cost.
- Detection: feature-detect WebGL support + `navigator.deviceMemory`/`hardwareConcurrency` where available, wrapped in a small `get3DTier()` utility; never block render waiting on this — default to Tier 2 while detecting, upgrade/downgrade after mount.

## 5. Content Model

Define a typed content source (`lib/content.ts`) rather than hardcoding copy in JSX, so copy revisions (see `PRD.md §8` open questions) don't require touching component logic:

```ts
type Project = {
  slug: string;
  title: string;
  status: "shipped" | "in-progress" | "concept" | "research";
  role: string;
  problem: string;
  outcome: string;
  stack: string[];
  links: { live?: string; github?: string; paper?: string };
  media: { type: "image" | "video"; src: string }[];
};
```
- v1: content lives in a typed TS/JSON file, imported at build time (static). Explicitly out of scope for v1: headless CMS (Sanity/Contentful) — revisit only if update frequency post-launch justifies the added complexity (per `PRD.md §3` non-goals).

## 6. Progressive Enhancement / No-JS Fallback

- Core semantic HTML (headings, project titles/descriptions/links) must be present and readable in the server-rendered HTML regardless of JS/animation library load state — Motion/GSAP/R3F only enhance, never gate, content visibility.
- If GSAP/Motion fail to load (CDN/script error — unlikely with bundled imports, but design for it), all animated elements must have a CSS-only fallback state of `opacity: 1` (i.e., default DOM state is the "settled/revealed" state; JS animates *from* a hidden state *added by* JS itself, e.g., via a `js-loaded` class on `<html>`, not by default-hiding content in CSS).

## 7. Performance Budget

| Metric | Target |
|---|---|
| LCP | < 2.0s (mobile, simulated 4G) |
| CLS | < 0.05 |
| INP | < 200ms |
| Total JS (initial route, gzipped) | < 250KB excluding lazy-loaded 3D chunk |
| Font files loaded | ≤ 8 woff2 files total (see `Typography.md §4`) |
| Images | AVIF/WebP via `next/image`, explicit dimensions everywhere (zero CLS from media) |

Enforce via Lighthouse CI in the deploy pipeline (fail build on regression below thresholds — see `Implementation_plan.md` Phase 5).

## 8. SEO & Metadata

- `generateMetadata` per route: title, description, OG image (custom-designed, not a default screenshot — should carry the same visual identity), Twitter card.
- Structured data: `Person` schema (JSON-LD) with name, jobTitle, sameAs (GitHub/LinkedIn), so search engines and AI crawlers can correctly attribute the site.
- `sitemap.xml` and `robots.txt` via Next.js file conventions.
- Semantic heading order enforced (single H1 = name/role, H2 per section) despite large *visual* type sizes potentially suggesting otherwise — visual hierarchy (`Typography.md`) and semantic hierarchy must be decoupled correctly in markup.

## 9. Accessibility

- WCAG AA minimum, per contrast rules in `Design_System.md §2.4`.
- Full keyboard navigation: intro skip button, nav, project cards, contact form all reachable and operable via keyboard; visible focus rings (`--focus-ring` token).
- `prefers-reduced-motion` handling per `Animation_system.md §7` implemented as a global React context/hook (`useReducedMotion`) consumed by every animated component, not duplicated per-component logic.
- Alt text authored for every project image describing the actual screenshot content, not filenames.

## 10. Testing & QA

- Type-check (`tsc --noEmit`) and lint (ESLint) in CI on every push.
- Visual/interaction smoke test: Playwright script that loads the homepage, waits for intro completion, and asserts hero content is visible and key CTAs are clickable — catches regressions in the animation sequence blocking content.
- Cross-browser: Chrome, Safari (WebGL/Safari quirks are common — test explicitly), Firefox, mobile Safari/Chrome.
- Reduced-motion pass: manually verify every rule in `Animation_system.md §7` with OS-level reduced-motion enabled.
- Low-end device pass: throttle CPU 4x + Slow 4G in DevTools, confirm Tier 2/3 3D fallback engages and performance budget still roughly holds.
