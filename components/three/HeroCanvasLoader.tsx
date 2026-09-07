"use client";

import dynamic from "next/dynamic";
import { StaticHeroGraphic } from "@/components/three/StaticHeroGraphic";

// TRD.md §4.2: dynamic import, never in the initial bundle. `ssr: false`
// requires a Client Component boundary in Next.js 15, hence this thin
// wrapper, Hero.tsx itself stays a Server Component. StaticHeroGraphic
// (zero JS/GPU cost) covers the loading gap with the same visual language
// the canvas will use, so there's no flash of empty space either way.
const HeroCanvas = dynamic(
  () => import("@/components/three/HeroCanvas").then((mod) => mod.HeroCanvas),
  { ssr: false, loading: () => <StaticHeroGraphic /> },
);

export function HeroCanvasLoader() {
  return <HeroCanvas />;
}
