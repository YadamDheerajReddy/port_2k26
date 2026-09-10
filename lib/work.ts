/**
 * Shared between WorkIndex.tsx (the list) and the case study pages
 * (components/work/CaseStudy*.tsx) so the two never drift -- same
 * deterministic per-project mark used as the honest stand-in for a real
 * screenshot until project.media actually has one.
 */
export function markGradient(index: number) {
  const hue = (16 + index * 41) % 360;
  return `linear-gradient(135deg, hsl(${hue} 70% 13%), hsl(${(hue + 30) % 360} 82% 20%))`;
}

export function initials(title: string) {
  return title
    .replace(/[^A-Za-z0-9 ]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}
