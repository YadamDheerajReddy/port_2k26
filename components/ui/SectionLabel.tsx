/**
 * Design_System.md §7: recurring "/" signature motif before section eyebrows.
 * §7 names --color-ember for this label, but §2.4 rules ember out for text
 * this small (fails AA at 12px, confirmed by Lighthouse: 2.97:1 on paper
 * sections, needs 4.5:1). TRD.md §9 marks AA as binding, so this follows
 * §2.4 over §7: secondary text color, ember reserved for headings/links/UI.
 */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-label-caps font-ui text-label text-[var(--text-secondary)]">
      {"/ "}
      {children}
    </p>
  );
}
