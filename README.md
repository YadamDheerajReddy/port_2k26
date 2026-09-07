# Dheeraj Reddy - Portfolio 2026

Personal portfolio for Dheeraj (Bittu) Reddy. Full spec lives in [`docs/`](./docs):
`PRD.md`, `TRD.md`, `Design_System.md`, `Typography.md`, `Animation_system.md`,
`UI_UX_Brief.md`, `Implementation_plan.md`.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Motion · GSAP + ScrollTrigger ·
React Three Fiber

## Development

```bash
npm install
npm run dev
```

```bash
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
npm run format       # Prettier, writes
npm run format:check # Prettier, check only
npm run build
```

## Fonts

Self-hosted Fontshare `.woff2` files live in `public/fonts/`, loaded via
`next/font/local` in `lib/fonts.ts`. Space Mono comes from `next/font/google`.
