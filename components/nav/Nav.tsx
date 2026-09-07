"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";
import { IntroRevealGroup, IntroRevealItem } from "@/components/intro/IntroReveal";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((link) =>
      document.getElementById(link.href.slice(1)),
    ).filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHref(`#${entry.target.id}`);
            break;
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-[var(--dur-fast)] ${
        scrolled
          ? "border-[var(--border-subtle)] bg-[var(--glass-bg)] backdrop-blur-[16px]"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-4">
        {/*
          Always rendered, never hidden by IntroReveal: this is the exact
          element NameIntro measures and lands the animated wordmark on.
          The full-screen intro overlay covers it during the sequence
          regardless, so there's nothing to visually hide here anyway.
        */}
        <a
          id="nav-logo"
          href="#top"
          className="nav-logo-idle-glow font-signature text-paper text-xl italic"
        >
          Dheeraj
        </a>

        <IntroRevealGroup className="hidden items-center gap-2 md:flex">
          {LINKS.map((link) => (
            <IntroRevealItem key={link.href}>
              <a
                href={link.href}
                className="font-ui text-ui relative px-3 py-1.5 text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--text-primary)]"
              >
                {activeHref === link.href ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="rounded-button bg-ember/15 absolute inset-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                ) : null}
                <span className="relative">{link.label}</span>
              </a>
            </IntroRevealItem>
          ))}
        </IntroRevealGroup>

        <IntroRevealGroup className="hidden items-center gap-4 md:flex">
          <IntroRevealItem>
            <a
              href={profile.resume}
              download
              className="link-underline font-ui text-ui text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Resume
            </a>
          </IntroRevealItem>
          <IntroRevealItem>
            <MagneticWrap>
              <Button href="#contact" variant="primary" className="!px-4 !py-2">
                Get in touch
              </Button>
            </MagneticWrap>
          </IntroRevealItem>
        </IntroRevealGroup>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-[var(--text-primary)] md:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open ? (
        <nav className="bg-ink flex flex-col gap-6 border-t border-[var(--border-subtle)] px-6 py-8 md:hidden">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="font-display text-display-3 text-[var(--text-primary)]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={profile.resume}
            download
            className="font-ui text-ui text-[var(--text-secondary)]"
          >
            Download resume
          </a>
        </nav>
      ) : null}
    </header>
  );
}
