export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-chip text-mono border border-[var(--border-subtle)] px-2 py-1 font-mono text-[var(--text-secondary)]">
      {children}
    </span>
  );
}
