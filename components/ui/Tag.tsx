export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-chip text-mono border border-[var(--border-subtle)] px-2 py-1 font-mono text-[var(--text-secondary)]">
      {children}
    </span>
  );
}

const STATUS_LABEL: Record<string, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  concept: "Concept",
  research: "Published research",
};

export function StatusBadge({ status }: { status: string }) {
  const isShipped = status === "shipped";
  return (
    <span
      className={`text-label-caps rounded-chip font-ui text-label px-2 py-1 ${
        isShipped
          ? "bg-ember text-ink"
          : "border border-[var(--border-subtle)] text-[var(--text-secondary)]"
      }`}
    >
      {STATUS_LABEL[status] ?? status}
    </span>
  );
}
