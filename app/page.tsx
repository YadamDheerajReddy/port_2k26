import { projects } from "@/lib/content";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-mono font-mono tracking-[0.08em] text-[var(--accent-primary)] uppercase">
        {"/ Phase 0"}
      </p>
      <h1 className="font-signature text-hero-name text-[var(--text-primary)] italic">
        Dheeraj
      </h1>
      <p className="font-body text-body-lg max-w-xl text-[var(--text-secondary)]">
        Full-stack developer who ships real products, from AI-powered apps to production
        client websites.
      </p>
      <p className="text-mono font-mono text-[var(--text-secondary)]">
        {projects.length} projects loaded from the content model
      </p>
    </main>
  );
}
