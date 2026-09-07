"use client";

import { Suspense } from "react";
import { use3DTier } from "@/lib/use3DTier";
import { Scene } from "@/components/three/Scene";
import { StaticHeroGraphic } from "@/components/three/StaticHeroGraphic";

/**
 * TRD.md §4.3: dimensions are fixed by the parent container in Hero.tsx,
 * reserved before this ever mounts, so the Tier 1/2 canvas and the Tier 3
 * static graphic never cause layout shift swapping in or out.
 */
export function HeroCanvas() {
  const tier = use3DTier();

  if (tier === 3) return <StaticHeroGraphic />;

  return (
    <Suspense fallback={<StaticHeroGraphic />}>
      <Scene tier={tier} />
    </Suspense>
  );
}
