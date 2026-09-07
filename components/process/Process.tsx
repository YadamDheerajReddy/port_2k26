import { processSteps } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function Process() {
  return (
    <section id="process" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>Process</SectionLabel>
        <h2 className="font-display text-display-2 mt-4 text-[var(--text-primary)]">
          How a project goes from outreach to launch
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {processSteps.map((item) => (
            <div key={item.step}>
              <span className="text-mono font-mono text-[var(--accent-primary)]">
                {item.step}
              </span>
              <h3 className="font-display text-display-3 mt-2 text-[var(--text-primary)]">
                {item.title}
              </h3>
              <p className="font-body text-body mt-3 text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
