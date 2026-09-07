const VARIANTS: Record<number, { points: string; fill: string; opacity?: number }[]> = {
  // Each variant echoes the faceted-polyhedron motif from the hero object
  // and StaticHeroGraphic.tsx, Design_System.md §8: no arbitrary decoration,
  // every shape ties back to the same abstract-geometric-form concept.
  1: [
    { points: "60,40 180,20 160,140 40,150", fill: "url(#menu-facet-ember)" },
    { points: "180,20 260,90 160,140", fill: "url(#menu-facet-rust)", opacity: 0.85 },
  ],
  2: [
    { points: "220,60 320,110 280,220 190,190", fill: "url(#menu-facet-rust)" },
    { points: "220,60 190,190 100,150", fill: "url(#menu-facet-ember)", opacity: 0.75 },
  ],
  3: [
    { points: "100,220 200,180 220,290 110,320", fill: "url(#menu-facet-ember)" },
    { points: "200,180 300,210 220,290", fill: "url(#menu-facet-acid)", opacity: 0.6 },
  ],
  4: [
    { points: "260,240 340,270 300,360 210,340", fill: "url(#menu-facet-rust)" },
    { points: "260,240 210,340 150,290", fill: "url(#menu-facet-ember)", opacity: 0.8 },
  ],
  5: [
    { points: "80,260 170,230 190,330 90,350", fill: "url(#menu-facet-ember)" },
    { points: "170,230 260,260 190,330", fill: "url(#menu-facet-acid)", opacity: 0.55 },
  ],
};

export function MenuShape({ variant }: { variant: number }) {
  const facets = VARIANTS[variant] ?? VARIANTS[1];

  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="menu-facet-ember" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4d1c" />
          <stop offset="100%" stopColor="#c43b14" />
        </linearGradient>
        <linearGradient id="menu-facet-rust" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c43b14" />
          <stop offset="100%" stopColor="#7a1f1a" />
        </linearGradient>
        <linearGradient id="menu-facet-acid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4ff3f" />
          <stop offset="100%" stopColor="#7a1f1a" />
        </linearGradient>
      </defs>
      {facets.map((facet, i) => (
        <polygon
          key={i}
          className="shape-element"
          points={facet.points}
          fill={facet.fill}
          opacity={facet.opacity ?? 1}
        />
      ))}
    </svg>
  );
}
