import Link from "next/link";
import type { Project } from "@/lib/content";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Tag } from "@/components/ui/Tag";
import { CaseStudyMockup } from "@/components/work/CaseStudyMockup";
import { CaseStudyHeroSection } from "@/components/work/CaseStudyHeroSection";
import { CaseStudyDeviceShowcase } from "@/components/work/CaseStudyDeviceShowcase";

/**
 * Selected concept: "Paper Breather, Faithful" (dennissnellenberg.com/work
 * reference) with the "Sticky Condensed Header" enhancement. theme-paper
 * joins the same breather convention About and Contact already use, rather
 * than inventing a new light section type. No Role/Status labels -- just
 * the stack, as plain tags rather than a label-over-rule column, since a
 * single remaining column read as a broken three-column strip missing two
 * thirds of itself.
 */
export function CaseStudy({ project, index }: { project: Project; index: number }) {
  return (
    <section className="theme-paper min-h-screen bg-[var(--bg-primary)] px-6 pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-[900px]">
        <RevealGroup>
          <RevealItem>
            <Link
              href="/#work"
              data-scroll-to
              data-scroll-to-offset={100}
              className="text-label-caps font-ui text-label hover:text-ember-dim text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)]"
            >
              &larr; Back to work
            </Link>
          </RevealItem>

          <RevealItem className="mt-6">
            <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] leading-[0.98] tracking-[-0.02em] text-[var(--text-primary)]">
              {project.title}
            </h1>
          </RevealItem>

          {project.stack.length > 0 ? (
            <RevealItem className="mt-8">
              <div className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </RevealItem>
          ) : null}

          <RevealItem className="mt-10">
            <CaseStudyHeroSection project={project}>
              <CaseStudyMockup project={project} index={index} />
            </CaseStudyHeroSection>
          </RevealItem>

          <RevealItem className="mt-20 max-w-[560px]">
            <p className="text-label-caps font-ui text-label text-ember-dim mb-3">
              Problem
            </p>
            <p className="mb-10 text-[16px] leading-[1.8] text-[var(--text-secondary)]">
              {project.problem}
            </p>
            <p className="text-label-caps font-ui text-label text-ember-dim mb-3">
              Outcome
            </p>
            <p className="text-[16px] leading-[1.8] text-[var(--text-secondary)]">
              {project.outcome}
            </p>
          </RevealItem>

          <RevealItem className="mt-20">
            <CaseStudyDeviceShowcase project={project} index={index} />
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}
