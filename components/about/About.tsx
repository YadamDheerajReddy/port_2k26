import { skillGroups } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { AnnotatedParagraph } from "@/components/about/AnnotatedParagraph";

export function About() {
  return (
    <section
      id="about"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <RevealGroup>
          <RevealItem>
            <SectionLabel>About</SectionLabel>
          </RevealItem>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_240px]">
            <RevealItem>
              <AnnotatedParagraph />
            </RevealItem>

            <RevealItem className="hidden lg:block">
              <p className="text-label-caps font-ui text-label text-[var(--text-secondary)]">
                / Focus
              </p>
              <ul className="mt-4 flex flex-col gap-3 border-l border-[var(--border-subtle)] pl-4">
                {skillGroups.map((group) => (
                  <li
                    key={group.category}
                    className="text-mono font-mono text-[var(--text-secondary)]"
                  >
                    {group.category}
                  </li>
                ))}
              </ul>
            </RevealItem>
          </div>
        </RevealGroup>
      </div>
    </section>
  );
}
