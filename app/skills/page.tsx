import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills | Dheeraj Reddy",
};

// Placeholder: the Skills section moved off the home page to live here as
// its own route. Design still to come -- see lib/content.ts's
// skillGroups for the real data this will eventually be built from.
export default function SkillsPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <p className="text-mono font-mono text-[var(--text-secondary)]">
        Skills — coming soon.
      </p>
    </main>
  );
}
