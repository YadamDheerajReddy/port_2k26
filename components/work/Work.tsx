import { projects } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ProjectCard } from "@/components/work/ProjectCard";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const LARGE_SLUGS = new Set(["echo", "tonys-angel-tattooz"]);

export function Work() {
  const featured = projects.filter((project) => project.featured);

  return (
    <section id="work" className="px-6 py-24 md:py-32">
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>Selected Work</SectionLabel>
        <h2 className="font-display text-display-2 mt-4 text-[var(--text-primary)]">
          A few things I&apos;ve built
        </h2>

        <RevealGroup className="mt-12 grid gap-6 md:grid-cols-2" stagger={0.1}>
          {featured.map((project) => {
            const large = LARGE_SLUGS.has(project.slug);
            return (
              <RevealItem key={project.slug} className={large ? "md:col-span-2" : ""}>
                <ProjectCard project={project} large={large} />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
