/** Design_System.md §7: recurring "/" signature motif before section eyebrows. */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-label-caps font-ui text-label text-[var(--accent-primary)]">
      {"/ "}
      {children}
    </p>
  );
}
