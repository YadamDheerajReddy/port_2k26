"use client";

import { useEffect, useRef, useState } from "react";
import { MenuOverlay } from "@/components/nav/MenuOverlay";

const SECTION_IDS = ["top", "about", "skills", "work", "contact"];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 80);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Return focus to the toggle button when the menu closes, matches it
  // being what opened the menu in the first place.
  useEffect(() => {
    if (wasOpen.current && !open) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-[var(--dur-fast)] ${
          scrolled && !open
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

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="font-ui text-ui text-paper flex items-center gap-3"
          >
            <span className="relative h-4 w-5 overflow-hidden">
              <span
                className={`absolute top-0 left-0 transition-transform duration-300 ${open ? "-translate-y-full" : "translate-y-0"}`}
              >
                Menu
              </span>
              <span
                className={`absolute top-0 left-0 transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
              >
                Close
              </span>
            </span>
            <span className="relative flex h-4 w-4 items-center justify-center">
              <span
                className={`bg-paper absolute h-px w-4 transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`}
              />
              <span
                className={`bg-paper absolute h-px w-4 transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`}
              />
            </span>
          </button>
        </div>
      </header>

      <MenuOverlay open={open} onClose={() => setOpen(false)} activeHref={activeHref} />
    </>
  );
}
