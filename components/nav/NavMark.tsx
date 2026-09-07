/** Design_System.md §5: the "D" monogram concept extended to "DR" (Dheeraj Reddy)
 * for this full wordmark treatment, geometric Clash Display letterforms, tight
 * kerning so the two overlap into a single locked-up mark rather than reading
 * as two separate characters. */
export function NavMark() {
  return (
    <svg viewBox="0 0 52 36" className="h-6 w-auto shrink-0" aria-hidden>
      <text
        x="0"
        y="28"
        fontFamily="var(--font-display)"
        fontWeight="600"
        fontSize="32"
        fill="var(--color-paper)"
      >
        D
      </text>
      <text
        x="21"
        y="28"
        fontFamily="var(--font-display)"
        fontWeight="600"
        fontSize="32"
        fill="var(--color-paper)"
      >
        R
      </text>
    </svg>
  );
}
