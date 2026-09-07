/**
 * Easing and duration constants. Mirrors styles/tokens.css so GSAP and
 * Motion read the same values as the CSS ease and dur tokens instead of
 * a second, drifting copy. See docs/Animation_system.md section 3.
 */

export const ease = {
  signature: "cubic-bezier(0.65, 0, 0.35, 1)",
  snap: "cubic-bezier(0.16, 1, 0.3, 1)",
  scroll: "none",
} as const;

export const duration = {
  micro: 0.15,
  fast: 0.3,
  base: 0.6,
  slow: 1.0,
} as const;

export const spring = {
  magnetic: { stiffness: 300, damping: 20 },
} as const;
