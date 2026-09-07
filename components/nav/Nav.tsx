"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { profile } from "@/lib/content";
import { NavMark } from "@/components/nav/NavMark";
import { ChamferButton } from "@/components/nav/ChamferButton";

const SECTION_IDS = ["top", "about", "skills", "work", "contact"];
const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

export function Nav() {
  const [activeHref, setActiveHref] = useState<string>("#top");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );

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
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="bg-ink/95 flex w-full max-w-[1400px] items-center justify-between gap-6 rounded-full border border-[var(--border-subtle)] px-6 py-3 backdrop-blur-[16px]">
        <div className="flex items-center">
          {/*
            Always rendered: this is the exact element NameIntro measures
            and lands the animated "DR" monogram on -- same letters, same
            font (Clash Display), so the handoff reads as continuous.
          */}
          <a
            id="nav-logo"
            href="#top"
            aria-label="Home"
            className="nav-logo-idle-glow flex items-center"
          >
            <NavMark />
          </a>
        </div>

        <div className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => {
            const active = activeHref === link.href;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`text-label-caps font-ui text-label relative pb-3 transition-colors duration-[var(--dur-fast)] ${
                  active ? "text-[var(--accent-primary)]" : "text-bone hover:text-paper"
                }`}
              >
                {link.label}
                {active ? (
                  <motion.span
                    layoutId="nav-active-line"
                    className="bg-ember absolute inset-x-0 bottom-0 h-px"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  >
                    <span className="bg-ember absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full" />
                  </motion.span>
                ) : null}
              </a>
            );
          })}
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <div className="h-6 w-px bg-[var(--border-subtle)]" />
          <a
            href={profile.resume}
            download
            className="text-label-caps font-ui text-label text-bone hover:text-paper transition-colors duration-[var(--dur-fast)]"
          >
            Resume
          </a>
          <ChamferButton href="#contact">Get in touch</ChamferButton>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="text-paper flex h-8 w-8 items-center justify-center lg:hidden"
        >
          <span className="relative flex h-3.5 w-4 flex-col justify-between">
            <span
              className={`bg-paper h-px w-full transition-transform duration-200 ${mobileOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
            />
            <span
              className={`bg-paper h-px w-full transition-opacity duration-200 ${mobileOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`bg-paper h-px w-full transition-transform duration-200 ${mobileOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="bg-ink/95 absolute top-20 right-4 left-4 flex flex-col gap-1 rounded-2xl border border-[var(--border-subtle)] p-3 backdrop-blur-[16px] lg:hidden"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-label-caps font-ui text-label rounded-xl px-4 py-3 transition-colors duration-[var(--dur-fast)] ${
                  activeHref === link.href
                    ? "bg-ember/15 text-[var(--accent-primary)]"
                    : "text-bone hover:text-paper"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-1 flex items-center justify-between border-t border-[var(--border-subtle)] px-4 pt-3">
              <a
                href={profile.resume}
                download
                className="text-label-caps font-ui text-label text-bone hover:text-paper"
              >
                Resume
              </a>
              <ChamferButton href="#contact">Get in touch</ChamferButton>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
