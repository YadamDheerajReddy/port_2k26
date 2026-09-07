"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/lib/content";
import { Button } from "@/components/ui/Button";
import { MagneticWrap } from "@/components/ui/MagneticWrap";

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
        <a href="#top" className="font-signature text-paper text-2xl italic">
          D
        </a>

        <nav className="hidden items-center gap-2 md:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
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
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <a
            href={profile.resume}
            download
            className="link-underline font-ui text-ui text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            Resume
          </a>
          <MagneticWrap>
            <Button href="#contact" variant="primary" className="!px-4 !py-2">
              Get in touch
            </Button>
          </MagneticWrap>
        </div>

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
