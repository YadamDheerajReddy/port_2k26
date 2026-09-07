import { profile } from "@/lib/content";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ContactForm } from "@/components/contact/ContactForm";

const SOCIALS = [
  { label: "GitHub", href: profile.github },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export function Contact() {
  const year = new Date().getFullYear();

  return (
    <section
      id="contact"
      className="theme-paper bg-[var(--bg-primary)] px-6 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1440px]">
        <SectionLabel>Contact</SectionLabel>
        <h2 className="font-display text-display-2 mt-4 max-w-2xl text-[var(--text-primary)]">
          Let&apos;s build something.
        </h2>
        <p className="font-body text-body-lg mt-4 max-w-xl text-[var(--text-secondary)]">
          Open to full-stack roles and freelance projects. Send a message or grab my
          resume.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div className="max-w-md">
            <ContactForm />
          </div>

          <div className="text-mono flex flex-col gap-2 font-mono text-[var(--text-secondary)]">
            <a href={profile.resume} download className="underline">
              Download resume
            </a>
            <a href={`mailto:${profile.email}`} className="underline">
              {profile.email}
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-[var(--border-subtle)] pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-6">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="font-ui text-ui text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {social.label}
              </a>
            ))}
          </div>
          <p className="text-mono font-mono text-[var(--text-secondary)]">
            {"© "}
            {year} {profile.name}
          </p>
        </div>
      </div>
    </section>
  );
}
