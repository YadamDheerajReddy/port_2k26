import { SectionLabel } from "@/components/ui/SectionLabel";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { SkillsDecode } from "@/components/skills/SkillsDecode";

export function Skills() {
  return (
    <section id="skills" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <RevealGroup className="text-center">
          <RevealItem>
            <SectionLabel>Skills & Stack</SectionLabel>
          </RevealItem>
          <RevealItem className="mt-12">
            <SkillsDecode />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
