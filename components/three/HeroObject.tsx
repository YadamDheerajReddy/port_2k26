"use client";

import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Animation_system.md §6: an abstract, interlocking/fractured polyhedron,
 * not a literal laptop/rocket cliche. Icosahedron core plus a few offset
 * fragments, well under the ~5k triangle budget (TRD.md §4.2): core at
 * detail 1 (80 tris) + three fragments at detail 0 (20 tris each) = 140.
 * Tier 1 gets damped cursor-follow rotation (max ~15deg, lerped, never raw
 * 1:1 tracking); Tier 2 gets a slow idle auto-rotate only, no cursor-follow.
 * MeshStandardMaterial rather than MeshPhysicalMaterial/transmission: see
 * the bundle-size note in Hero.tsx and HeroCanvasLoader.tsx.
 */
export function HeroObject({ interactive }: { interactive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const [targetRotation] = useState(() => new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (interactive) {
      const maxTilt = THREE.MathUtils.degToRad(15);
      targetRotation.x = -pointer.y * maxTilt;
      targetRotation.y = pointer.x * maxTilt;
      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        targetRotation.x,
        4,
        delta,
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotation.y + state.clock.elapsedTime * 0.08,
        4,
        delta,
      );
    } else {
      groupRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial
          color="#ff4d1c"
          roughness={0.3}
          metalness={0.1}
          emissive="#7a1f1a"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[1.1, 0.4, 0.3]} rotation={[0.4, 0.2, 0]}>
        <icosahedronGeometry args={[0.32, 0]} />
        <meshStandardMaterial
          color="#ff4d1c"
          roughness={0.35}
          metalness={0.1}
          emissive="#7a1f1a"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[-0.9, -0.6, 0.5]} rotation={[0.2, -0.3, 0.1]}>
        <icosahedronGeometry args={[0.24, 0]} />
        <meshStandardMaterial
          color="#d4ff3f"
          roughness={0.4}
          metalness={0.1}
          emissive="#7a1f1a"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[-0.5, 0.9, -0.4]} rotation={[-0.3, 0.4, 0.2]}>
        <icosahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#ff4d1c"
          roughness={0.35}
          metalness={0.1}
          emissive="#7a1f1a"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}
