const ITEMS = [
  "Product Design/Product Development",
  "Portfolio Design",
  "AI/ML Applications",
  "Desktop Applications",
  "E-commerce Development",
];

/**
 * CSS-only: no client component needed, the site's global
 * `prefers-reduced-motion` rule in globals.css already forces
 * animation-duration to ~0 for every element, so this is automatically
 * neutralized for reduced-motion visitors without a separate JS gate.
 * Paused on hover, WCAG 2.2.2 requires a way to stop motion that runs
 * longer than 5 seconds.
 */
export function Marquee() {
  return (
    <div className="marquee-fade relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-t border-[var(--border-subtle)] py-6">
      <div className="marquee-track flex w-max items-center gap-10">
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-mono font-mono whitespace-nowrap text-[var(--text-secondary)]">
              {item}
            </span>
            <span aria-hidden className="bg-ember h-1.5 w-1.5 rounded-full" />
          </span>
        ))}
      </div>
    </div>
  );
}
