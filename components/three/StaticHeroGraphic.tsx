/**
 * TRD.md §4.3 Tier 3: pre-rendered static graphic in place of the canvas,
 * same visual language as HeroObject.tsx (interlocking facets, ember/rust
 * on ink) at zero JS/GPU cost. Same footprint as the canvas so swapping
 * between tiers never shifts layout.
 */
export function StaticHeroGraphic() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" role="img" aria-label="">
      <defs>
        <linearGradient id="facet-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff4d1c" />
          <stop offset="100%" stopColor="#c43b14" />
        </linearGradient>
        <linearGradient id="facet-b" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#c43b14" />
          <stop offset="100%" stopColor="#7a1f1a" />
        </linearGradient>
        <linearGradient id="facet-c" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff4d1c" />
          <stop offset="100%" stopColor="#7a1f1a" />
        </linearGradient>
      </defs>
      <g opacity={0.95}>
        <polygon points="200,60 300,150 260,260 140,260 100,150" fill="url(#facet-a)" />
        <polygon points="200,60 300,150 200,190" fill="url(#facet-b)" />
        <polygon points="200,60 100,150 200,190" fill="url(#facet-c)" />
        <polygon points="300,150 260,260 200,190" fill="url(#facet-b)" opacity={0.85} />
        <polygon points="100,150 140,260 200,190" fill="url(#facet-c)" opacity={0.85} />
        <polygon points="140,260 260,260 200,190" fill="url(#facet-a)" opacity={0.7} />
      </g>
      <polygon
        points="320,280 355,300 340,335 305,325 295,290"
        fill="url(#facet-a)"
        opacity={0.6}
      />
      <polygon points="70,90 100,105 88,130 60,122" fill="url(#facet-c)" opacity={0.5} />
    </svg>
  );
}
