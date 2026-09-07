"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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
    <div className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="flex items-center gap-1 rounded-full border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-1.5 backdrop-blur-[16px]">
        {/*
          Always rendered: this is the exact element NameIntro measures and
          lands the animated wordmark on. Design_System.md §5: the "D"
          monogram doubles as the compact mark for this pill, the favicon,
          and the cursor companion.
        */}
        <a
          id="nav-logo"
          href="#top"
          className="nav-logo-idle-glow font-signature text-paper flex h-8 w-8 items-center justify-center rounded-full text-lg italic"
        >
          D
        </a>

        <div className="hidden items-center gap-0.5 sm:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-ui text-ui relative rounded-full px-4 py-1.5 text-[var(--text-secondary)] transition-colors duration-[var(--dur-fast)] hover:text-[var(--text-primary)]"
            >
              {activeHref === link.href ? (
                <motion.span
                  layoutId="nav-active-pill"
                  className="bg-ember/15 absolute inset-0 rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              ) : null}
              <span className="relative">{link.label}</span>
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-primary)] sm:hidden"
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
            className="absolute top-16 left-1/2 flex w-48 -translate-x-1/2 flex-col gap-1 rounded-2xl border border-[var(--border-subtle)] bg-[var(--glass-bg)] p-2 backdrop-blur-[16px] sm:hidden"
          >
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-ui text-ui rounded-xl px-4 py-2 transition-colors duration-[var(--dur-fast)] ${
                  activeHref === link.href
                    ? "bg-ember/15 text-[var(--accent-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
