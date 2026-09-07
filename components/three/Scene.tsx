"use client";

import { Canvas } from "@react-three/fiber";
import { HeroObject } from "@/components/three/HeroObject";
import type { Tier } from "@/lib/use3DTier";

/**
 * TRD.md §4.1: manually placed lights tinted toward the ember/rust palette
 * instead of an Environment HDRI, avoids an external CDN texture fetch.
 * TRD.md §4.2: dpr capped at 2, Tier 2 drops post-processing entirely
 * (there is none here to begin with, kept deliberately simple) and lowers
 * pixel ratio further to protect frame rate on weaker signals.
 */
export function Scene({ tier }: { tier: Tier }) {
  const dpr: [number, number] = tier === 1 ? [1, 2] : [1, 1];

  return (
    <Canvas
      dpr={dpr}
      camera={{ position: [0, 0, 4.5], fov: 40 }}
      gl={{ antialias: tier === 1, alpha: true }}
    >
      <ambientLight intensity={0.4} color="#f7f2e9" />
      <directionalLight position={[3, 2, 4]} intensity={1.2} color="#ff4d1c" />
      <pointLight position={[-3, -2, -2]} intensity={0.6} color="#7a1f1a" />
      <HeroObject interactive={tier === 1} />
    </Canvas>
  );
}
