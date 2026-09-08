import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { WorkIndex } from "@/components/work/WorkIndex";

export function Work() {
  return (
    <section id="work" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <RevealGroup>
          <RevealItem>
            <SectionLabel>Selected Work</SectionLabel>
          </RevealItem>
          <RevealItem className="mt-4">
            <h2 className="font-display text-display-2 text-[var(--text-primary)]">
              A few things I&apos;ve built
            </h2>
          </RevealItem>
        </RevealGroup>

        <div className="mt-12">
          <WorkIndex />
        </div>
      </div>
    </section>
  );
}
