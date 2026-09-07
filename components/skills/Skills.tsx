import { skillGroups } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>Skills & Stack</SectionLabel>
        <h2 className="font-display text-display-2 mt-4 text-[var(--text-primary)]">
          The pieces that fit together
        </h2>

        <RevealGroup className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <RevealItem key={group.category}>
              <h3 className="font-ui text-ui text-[var(--text-primary)]">
                {group.category}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-mono font-mono text-[var(--text-secondary)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
