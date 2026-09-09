import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

// Placeholder: real content (grouped by category, from lib/content.ts's
// skillGroups) still to be designed.
export function Skills() {
  return (
    <section id="skills" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px] text-center">
        <RevealGroup>
          <RevealItem>
            <SectionLabel>Skills & Stack</SectionLabel>
          </RevealItem>
          <RevealItem className="mt-6">
            <p className="text-mono font-mono text-[var(--text-secondary)]">
              Coming soon.
            </p>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
