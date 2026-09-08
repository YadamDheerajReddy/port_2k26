import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CHAMFER =
  "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)";

/**
 * Chamfered-corner outline button: two stacked clip-path layers (an ember
 * fill, then an inset background layer) rather than one filled shape, so
 * it reads as an outline at rest, matching Design_System.md's secondary
 * button. On hover the inner layer switches to ember too (fully filled)
 * and text flips to ink, matching the primary button's "ink text on ember
 * fill" contrast rule (Design_System.md §7) rather than ember-on-ember.
 */
export function ChamferButton({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isAnchor = href.startsWith("#");
  const className = "group relative inline-flex";

  const inner = (
    <>
      <span
        aria-hidden
        className="bg-ember absolute inset-0"
        style={{ clipPath: CHAMFER }}
      />
      <span
        aria-hidden
        className="bg-ink group-hover:bg-ember absolute inset-[1.5px] transition-colors duration-[var(--dur-fast)]"
        style={{ clipPath: CHAMFER }}
      />
      <span className="font-ui text-ui group-hover:text-ink relative flex items-center gap-2 px-6 py-2.5 text-[var(--accent-primary)] transition-colors duration-[var(--dur-fast)]">
        {children}
        <ArrowRight
          size={16}
          className="transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5"
        />
      </span>
    </>
  );

  // Hash anchors go through Locomotive's own data-scroll-to (needs a real
  // <a> for it to intercept the click). Internal paths go through Next's
  // Link so the route change runs through the client-side router -- a
  // plain <a> would hard-reload, skipping the page-transition animation
  // entirely, not just looking abrupt.
  if (isAnchor) {
    return (
      <a href={href} className={className} data-scroll-to data-scroll-to-offset={100}>
        {inner}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {inner}
    </Link>
  );
}
