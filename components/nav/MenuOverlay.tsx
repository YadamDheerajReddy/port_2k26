"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/components/providers/ReducedMotionProvider";
import { usePointerFine } from "@/lib/usePointerFine";
import { MenuShape } from "@/components/nav/MenuShape";

const LINKS = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#contact", label: "Contact" },
];

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  activeHref: string | null;
};

/**
 * Full-screen menu, replacing the old always-visible inline nav row. Ties
 * the hover shapes back to the same faceted-polyhedron motif as the hero
 * object (MenuShape.tsx), Design_System.md §8: no arbitrary decoration.
 * GSAP timeline uses --ease-signature (Animation_system.md §3), gated by
 * useReducedMotion -- reduced motion gets a plain opacity crossfade, no
 * slide/stagger/rotation, per Animation_system.md §7.
 */
export function MenuOverlay({ open, onClose, activeHref }: MenuOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const scrimRef = useRef<HTMLDivElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const pointerFine = usePointerFine();
  const easeRegistered = useRef(false);

  useEffect(() => {
    if (easeRegistered.current) return;
    import("gsap/CustomEase").then(({ CustomEase }) => {
      gsap.registerPlugin(CustomEase);
      if (!gsap.parseEase("signature")) {
        CustomEase.create("signature", "0.65, 0, 0.35, 1");
      }
      easeRegistered.current = true;
    });
  }, []);

  useEffect(() => {
    const panels = panelRefs.current.filter((p): p is HTMLDivElement => p !== null);
    const links = linkRefs.current.filter((l): l is HTMLAnchorElement => l !== null);
    if (!overlayRef.current || !scrimRef.current) return;

    const ease = gsap.parseEase("signature") ? "signature" : "power3.inOut";
    const tl = gsap.timeline();

    if (open) {
      gsap.set(overlayRef.current, { display: "block" });

      if (reducedMotion) {
        tl.fromTo(
          [scrimRef.current, ...panels, ...links],
          { opacity: 0 },
          { opacity: 1, duration: 0.2, stagger: 0 },
        );
      } else {
        tl.fromTo(
          scrimRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.4, ease },
        )
          .fromTo(
            panels,
            { xPercent: 101 },
            { xPercent: 0, duration: 0.55, stagger: 0.1, ease },
            "<",
          )
          .fromTo(
            links,
            { yPercent: 130, rotate: 6 },
            { yPercent: 0, rotate: 0, duration: 0.6, stagger: 0.05, ease },
            "<+=0.25",
          );
      }

      links[0]?.focus();
    } else {
      if (reducedMotion) {
        tl.to(scrimRef.current, { opacity: 0, duration: 0.15 }).set(overlayRef.current, {
          display: "none",
        });
      } else {
        tl.to(scrimRef.current, { autoAlpha: 0, duration: 0.3, ease })
          .to(panels, { xPercent: 101, duration: 0.4, ease }, "<")
          .set(overlayRef.current, { display: "none" });
      }
    }

    return () => {
      tl.kill();
    };
  }, [open, reducedMotion]);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  function handleShapeHover(index: number, entering: boolean) {
    if (!pointerFine || reducedMotion) return;
    const shape = shapeRefs.current[index];
    if (!shape) return;

    if (entering) {
      shapeRefs.current.forEach((el, i) => {
        if (el && i !== index) gsap.set(el, { opacity: 0 });
      });
      gsap.fromTo(
        shape,
        { opacity: 0, scale: 0.7, rotate: -6 },
        { opacity: 0.5, scale: 1, rotate: 0, duration: 0.5, ease: "back.out(1.7)" },
      );
    } else {
      gsap.to(shape, { opacity: 0, scale: 0.85, duration: 0.25, ease: "power2.in" });
    }
  }

  return (
    <div
      ref={overlayRef}
      style={{ display: "none" }}
      className="fixed inset-0 z-[90]"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      <div
        ref={scrimRef}
        onClick={onClose}
        className="bg-ink/80 absolute inset-0 backdrop-blur-sm"
      />

      <div className="absolute inset-0 flex justify-end">
        <div
          ref={(el) => {
            panelRefs.current[0] = el;
          }}
          className="bg-ink absolute inset-0"
        />
        <div
          ref={(el) => {
            panelRefs.current[1] = el;
          }}
          className="bg-ink-raised absolute inset-0 opacity-60"
        />

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {LINKS.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                shapeRefs.current[i] = el;
              }}
              className="absolute top-1/2 right-[5%] h-[70vmin] w-[70vmin] -translate-y-1/2 opacity-0"
            >
              <MenuShape variant={i + 1} />
            </div>
          ))}
        </div>

        <nav className="relative flex w-full max-w-2xl flex-col justify-center px-6 sm:px-16">
          <ul className="flex flex-col gap-2">
            {LINKS.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <a
                  ref={(el) => {
                    linkRefs.current[i] = el;
                  }}
                  href={link.href}
                  onClick={onClose}
                  onMouseEnter={() => handleShapeHover(i, true)}
                  onMouseLeave={() => handleShapeHover(i, false)}
                  className={`group font-display text-display-2 flex items-baseline gap-4 py-2 transition-colors duration-[var(--dur-fast)] ${
                    activeHref === link.href
                      ? "text-[var(--accent-primary)]"
                      : "text-paper hover:text-[var(--accent-primary)]"
                  }`}
                >
                  <span className="text-mono font-mono text-[var(--text-secondary)] opacity-0 transition-opacity duration-[var(--dur-fast)] group-hover:opacity-100">
                    0{i + 1}
                  </span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
