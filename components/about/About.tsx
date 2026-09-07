import { SectionLabel } from "@/components/ui/SectionLabel";

export function About() {
  return (
    <section
      id="about"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>About</SectionLabel>

        <p className="font-display text-display-2 mt-6 max-w-4xl text-[var(--text-primary)]">
          From an IEEE-published research project to shipping client sites, I build things
          that work.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <p className="font-body text-body-lg text-[var(--text-secondary)]">
            I studied Computer Science with a focus on AI and ML at Sathyabama University,
            where a machine-learning firewall project I built ended up published in IEEE
            Xplore. That research background still shapes how I approach product work: I
            care about the mechanism underneath a feature, not just the interface on top
            of it.
          </p>
          <p className="font-body text-body-lg text-[var(--text-secondary)]">
            Today I work as a Workforce Software Consultant at TCS, and outside of that I
            run YDR Digital, building and shipping websites for real clients, and build
            independent products on my own, several of them exploring what it means to
            build software with AI agents rather than just calling an API. I also led HACK
            SIST, my university&apos;s computer club, as president.
          </p>
        </div>
      </div>
    </section>
  );
}
