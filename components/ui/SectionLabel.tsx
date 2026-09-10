/**
 * Design_System.md §7: recurring "/" signature motif before section eyebrows.
 * §7 names --color-ember for this label, but §2.4 rules ember out for text
 * this small (fails AA at 12px, confirmed by Lighthouse: 2.97:1 on paper
 * sections, needs 4.5:1). TRD.md §9 marks AA as binding, so this follows
 * §2.4 over §7: secondary text color, ember reserved for headings/links/UI.
 *
 * `as` defaults to "p": most sections already have their own real headline
 * (Work's "A few things I've built", Skills' decode title, etc.) so this
 * eyebrow stays a plain paragraph there. About has no separate headline --
 * just this label over a bio paragraph -- so it's the one section that
 * passes as="h2", making the eyebrow itself the section's real heading
 * instead of leaving About with no heading at all.
 */
export function SectionLabel({
  children,
  as: Tag = "p",
}: {
  children: React.ReactNode;
  as?: "p" | "h2";
}) {
  return (
    <Tag className="text-label-caps font-ui text-label text-[var(--text-secondary)]">
      {"/ "}
      {children}
    </Tag>
  );
}
