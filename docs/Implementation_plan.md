# Implementation Plan — Dheeraj Reddy Portfolio 2026

A realistic, phased build plan for a solo developer. Assumes evenings/weekends pace alongside a full-time TCS role — phases are scoped to be completable incrementally without leaving the site half-broken at any point (each phase ends in a working, deployable state).

---

## Phase 0 — Setup & Foundations (0.5–1 day)

- [ ] Init Next.js 15 (App Router, TypeScript, Tailwind v4) project, push to a public GitHub repo.
- [ ] Set up Vercel project + preview deployments on every push.
- [ ] Download and self-host the Fontshare font files chosen in `Typography.md §1` (Gambetta, Clash Display, Switzer, General Sans — only the specified weights); wire up `next/font/local`.
- [ ] Implement design tokens: Tailwind config extension + `tokens.css` for every value in `Design_System.md §2–3` and `Typography.md §3` and `Animation_system.md §3`.
- [ ] Set up ESLint, Prettier, `tsc --noEmit` in CI (GitHub Actions).
- [ ] Draft the typed content model (`TRD.md §5`) and fill in placeholder real content for all 5 featured projects — get the copy skeleton right before styling.

**Exit criteria:** blank but correctly-themed Next.js site deployed, fonts loading correctly, content model populated with real (even if rough) project data.

---

## Phase 1 — Static Layout, No Animation (2–4 days)

- [ ] Build every section from `UI_UX_Brief.md §3` as static, fully-responsive HTML/Tailwind components with zero animation — this is the "does the content and hierarchy work" checkpoint.
- [ ] Nav (static state only), Hero, About, Selected Work (grid, no hover effects yet), Skills, Process, Contact/Footer.
- [ ] Implement the contact form + `/api/contact` route (Resend integration), test end-to-end email delivery.
- [ ] Responsive pass across the 3 breakpoints in `Design_System.md §3`.
- [ ] Run a first Lighthouse pass — should already be strong since nothing heavy has been added yet; fix any early issues before layering in animation/3D debt on top.

**Exit criteria:** a real, readable, fully-functional (if visually plain) portfolio is live. This alone is already better than "generic" if it stopped here — everything after is enhancement, not a prerequisite for a working site.

---

## Phase 2 — Motion & Micro-Interactions (2–3 days)

- [ ] Install Motion (motion.dev); build `useReducedMotion` hook and global provider first (per `TRD.md §9`) — every animated component built after this must consume it from day one, not retrofit it later.
- [ ] Section scroll-reveals (`Animation_system.md §5`) across all sections.
- [ ] Custom cursor (`Animation_system.md §4`), gated to `pointer: fine`.
- [ ] Magnetic buttons, link underline fills, project card hover/tilt.
- [ ] Nav active-section indicator (Motion `layoutId`).
- [ ] QA: reduced-motion pass on everything shipped so far.

**Exit criteria:** the site feels alive on scroll and hover, with zero 3D or the name-intro yet — confirms the "restraint" principle before the highest-risk features are added.

---

## Phase 3 — Name Intro (GSAP) (1–2 days, tightly scoped)

- [ ] Export/generate SVG path data for "Dheeraj" in Gambetta Italic (via `opentype.js` or a manual export from a vector tool).
- [ ] Build the GSAP master timeline per `Animation_system.md §2` step by step: stroke → glow → fill → scale/translate into nav.
- [ ] `sessionStorage` skip-on-repeat-visit logic.
- [ ] Skip button + reduced-motion fallback (simple fade).
- [ ] This is the single highest-risk, highest-reward piece of the site — timebox it, and if the stroke-draw approach proves too fragile across browsers within the timebox, fall back to a simpler but still distinctive reveal (e.g., a clip-path wipe in Gambetta italic) rather than blocking launch on it.

**Exit criteria:** the opening sequence works reliably across Chrome/Safari/Firefox, respects reduced-motion, and is skippable.

---

## Phase 4 — 3D (React Three Fiber) (2–4 days, scoped conservatively)

- [ ] Build the hero 3D object as procedural geometry (no heavy imported models) with the tiered fallback system (`TRD.md §4.3`) from the start — do not build Tier 1 first and add fallbacks later, build the detection/fallback scaffold first, then the visual object.
- [ ] Cursor-follow damped rotation.
- [ ] Skills-section scroll-scrub assembly animation (or descope to a simpler static-per-category reveal if timeline is tight — this is the most cuttable item in the plan without damaging the core pitch).
- [ ] Bundle-size check against the `TRD.md §7` budget; dynamic-import the whole 3D module.
- [ ] Cross-device performance pass (throttled CPU/network per `TRD.md §10`).

**Exit criteria:** 3D enhances the hero and (optionally) skills section, degrades gracefully, and does not blow the performance budget. If it does, descope to Tier-2/3 as the shipped default rather than delaying launch.

---

## Phase 5 — Polish, SEO, Performance Hardening (1–2 days)

- [ ] Metadata, OG image (custom-designed), JSON-LD `Person` schema, sitemap/robots (`TRD.md §8`).
- [ ] Full accessibility audit against `TRD.md §9` (keyboard pass, contrast check, alt text, focus states).
- [ ] Lighthouse CI thresholds enforced (`TRD.md §7`); fix any remaining regressions from Phases 2–4.
- [ ] Cross-browser/device final pass (`TRD.md §10`).
- [ ] Analytics wired (Vercel Analytics / Plausible).
- [ ] Content accuracy pass: verify every project status label, every link, every claim against current real-world state (`PRD.md §5.3`) — nothing overstated or stale.

**Exit criteria:** production-ready.

---

## Phase 6 — Launch & Post-Launch (ongoing)

- [ ] Point domain, final deploy.
- [ ] Share for initial feedback (the `PRD.md §6` qualitative 10-second test with 3–5 people unfamiliar with Dheeraj — do this **before** wide launch, not after).
- [ ] Update GitHub/LinkedIn/resume with the new portfolio link.
- [ ] Post-launch backlog (explicitly deferred, not forgotten): `/work/[slug]` detail pages for any project that outgrows its card, `/writing` route if content strategy develops, headless CMS migration if update frequency demands it (`PRD.md §3`).

---

## Cut Lines (what to descope first if time runs short, in order)

1. Skills-section 3D scroll-assembly → replace with static categorized list.
2. Horizontal-scrub work section → replace with standard vertical card grid.
3. Custom cursor → replace with default cursor + strong hover states only.
4. Hero 3D object → replace with Tier-3 static hero graphic (a well-designed static SVG composition using the same visual language) — the name-intro and typography/color system alone still deliver a distinctive site even without any WebGL.

The name-intro animation and the type/color system (`Typography.md`, `Design_System.md`) are the two things that should **never** be cut — they are the highest-leverage, lowest-risk differentiators and are achievable without 3D or GSAP fluency.

---

## Total Estimated Timeline

~10–17 working days solo, part-time pace. Recommend treating Phase 1's exit criteria as a real, shippable milestone — if life gets busy, the site can pause there and still be a legitimate improvement over the prior "basic/generic" versions, with Phases 2–4 layered in opportunistically afterward.
