# PRD — Dheeraj Reddy Portfolio 2026

## 1. Summary

A personal portfolio website for **Dheeraj (Bittu) Reddy** — full-stack developer, currently a Workforce Software Consultant at TCS, founder of the freelance web-dev brand **YDR Digital**, and builder of multiple independent AI/product projects. The site must replace two prior "basic/generic" portfolio attempts with one that stands out immediately, communicates skill and output within 10 seconds, and supports both job-search and freelance-client-acquisition goals simultaneously.

## 2. Goals

1. **10-second comprehension goal:** any visitor (recruiter, hiring manager, or potential freelance client) can answer "who is this, what do they do, are they good" within 10 seconds of landing, before any interaction.
2. **Differentiation:** the site must not resemble a template — distinctive type (`Typography.md`), a non-blue color system (`Design_System.md`), and a memorable opening moment (`Animation_system.md`) are all in service of this.
3. **Dual audience support:** the same site should work for (a) recruiters/hiring managers evaluating him for full-stack roles and (b) SMB clients evaluating YDR Digital for freelance web projects — without feeling like two disjointed sites bolted together.
4. **Proof over claims:** prioritize real, shipped work (GitHub projects, freelance client sites, product specs) over adjective-heavy self-description.
5. **Performance & craft as proof points themselves:** a portfolio for a developer must *itself* perform flawlessly (fast load, smooth 60fps animation, no layout shift) — this is part of the pitch, not just aesthetics.

## 3. Non-Goals

- Not a blog/CMS platform for long-form writing (a future `/writing` or `/notes` route can be added later, out of scope for v1).
- Not a full YDR Digital client-facing business site (pricing pages, client portal) — this is Dheeraj's personal portfolio; YDR Digital gets a section/case-study treatment, not a parallel site, in v1.
- Not multi-language.
- Not a CMS-editable site for v1 — content is code/JSON-driven (see `TRD.md §5`); a headless CMS can be layered in later if update frequency demands it.

## 4. Target Audience

| Persona | What they need to see fast |
|---|---|
| **Tech recruiter / hiring manager** (skimming, ~10–20s) | Name, current role, core stack, 2–3 strongest projects with clear outcomes, resume/contact CTA |
| **Engineering peer / technical interviewer** (deeper dive) | Real code links (GitHub), technical depth per project (architecture, stack choices, problems solved), the IEEE publication, leadership (HACK SIST) |
| **SMB / freelance client** | Proof of shipped client work (Tony's Angel Tattooz, sruchi.com audit), YDR Digital positioning, a clear "work with me" path |

## 5. Content Requirements (source material — pull from actual work, do not invent)

### 5.1 Hero
- Name: **Dheeraj** (full: Yadam Dheeraj Reddy), with the name-intro animation per `Animation_system.md §2`.
- Role line: a sharp, specific positioning statement — not "Full Stack Developer" alone. Recommended direction: *"Full-stack developer who ships real products — from AI-powered apps to production client websites."* (final copy to be refined with Dheeraj, but must include: full-stack, and evidence of shipping, in one line).
- Immediate proof strip beneath the fold-line (still within first 10s): 3–4 hard numbers/facts as a horizontal ticker or static row — e.g., "TCS Workforce Software Consultant", "IEEE-published ML research", "Founder, YDR Digital", "4+ shipped products." (Space Mono numerals per `Typography.md §6`.)

### 5.2 About / Story
- CS + AI/ML graduate (Sathyabama University) → TCS consultant → parallel builder/founder track.
- President, HACK SIST computer club — leadership signal.
- The throughline: interest in "building products using AI agents," and thinking at the intersection of tech and business impact — this differentiates him from a purely execution-focused developer.

### 5.3 Selected Work (the core proof section — most important section on the site)

Feature a curated, not exhaustive, set. Recommended structure — each project gets: problem, role, stack, outcome, and a link (live/GitHub):

1. **Strata-Browser**, **aurafit-ai**, **exam-guard**, **ECHO (Everyday Computing Human Operator)** — GitHub username `YadamDheerajReddy`. These are the explicitly-requested featured repos; each needs a one-line "what it does and why it's interesting" plus tech stack tags.
2. **Tony's Angel Tattooz** (tonysangeltattooz.in) — first paid freelance project: React/Vite SPA, monochromatic editorial design, full delivery through DNS/hosting — good as a "client work, real launch" proof point.
3. **Flexnect** — gym workout-partner matching app concept, React Native Expo + Supabase, dark-mode-first — show as a specced/in-progress product if not yet built, clearly labeled as such (never misrepresent build status).
4. **Kinetx Labs / EVOLYN** — brand + product system work (Evolyn Dictionary, 420-term knowledge base across 10 volumes) — demonstrates range beyond pure code into product/brand thinking, a differentiator for the "product builder" positioning.
5. **IEEE Xplore-published ML firewall project** — strongest academic/technical credibility signal, should be linked prominently (paper link if available) rather than buried.

Each project card must be honest about status (shipped/live vs. specced/in-progress vs. published research) — do not blur these; recruiters and clients both penalize overstated claims more than they penalize an honestly-labeled "concept" project.

### 5.4 Skills / Stack
- Grouped by category, not a flat tag-soup: **Languages & Frameworks** (JS/TS, React, Next.js, React Native), **Backend & Data** (Supabase, relevant DB/API experience), **AI/ML** (the specific tools/approach behind the IEEE project and "building with AI agents" interest), **Design & Product** (brand systems, UI/UX — evidenced by Kinetx Labs work).
- This section is a good candidate for the "assembling 3D object" scroll moment in `Animation_system.md §6`.

### 5.5 Process / How I Work (optional but recommended for freelance audience)
- Short section speaking to SMB clients: how a project goes from outreach → spec → build → launch, referencing the real workflow evidenced by YDR Digital's documented process (audits, specs, deliverables docs).

### 5.6 Contact / CTA
- Primary CTA: contact (email/form) + resume download, clearly split for "hire me" vs. "work with me" if audience-appropriate copy is used (can be a single CTA with dual-purpose copy for v1 simplicity).
- Secondary: GitHub, LinkedIn (if provided), YDR Digital link.

## 6. Success Metrics

- Qualitative: in user-testing with 3–5 people unfamiliar with Dheeraj, ≥80% can correctly state his role and name at least one project after 10 seconds of viewing the hero only.
- Performance: Lighthouse Performance ≥90 mobile, ≥95 desktop; LCP <2.0s; CLS <0.05; INP <200ms (see `TRD.md §7` for the full budget this is derived from).
- Engagement proxy (post-launch): scroll depth to "Selected Work" section >70% of sessions; contact-form/resume CTA click-through tracked via analytics.

## 7. Constraints

- Solo build, so scope must fit a realistic timeline (see `Implementation_plan.md`) — v1 should not require a CMS, backend auth, or database beyond what's needed for a contact form.
- Must degrade gracefully for low-end devices/slow connections (India mobile network conditions are a realistic real-world test case, not just desktop-fast-wifi).
- Content accuracy: every claim/project status must be verified against actual current state before launch (see `Implementation_plan.md` QA checklist) — this PRD lists source material, not final copy.

## 8. Open Questions (resolve before/during build)

- Final resume/CV content and downloadable PDF.
- Whether LinkedIn and a public email are ready to be listed, or a contact form only.
- Whether IEEE paper is publicly linkable (Xplore access) or needs a summary instead.
- Final call on how prominently YDR Digital freelance positioning appears vs. job-search positioning — recommend testing both framings in copy review before launch.
