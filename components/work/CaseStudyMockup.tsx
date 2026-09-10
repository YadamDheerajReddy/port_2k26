import Image from "next/image";
import type { Project } from "@/lib/content";
import { markGradient, initials } from "@/lib/work";

/**
 * The case study's hero visual. Real screenshots render at their own true
 * aspect ratio -- each project's media entry carries its source width and
 * height -- instead of being force-cropped into one fixed shape. A single
 * 16:10 box with object-cover was cutting the same slice out of every
 * project's screenshot regardless of what that screenshot actually looked
 * like, since the real images range from Echo's near-square 1112x762 to
 * Kinetx's wide 1917x861. Falls back to the same deterministic gradient +
 * initials mark as WorkIndex's own preview panel when there's no real
 * screenshot yet -- that path keeps its own fixed 16:10 box since there's
 * no intrinsic image size to size it from.
 */
export function CaseStudyMockup({ project, index }: { project: Project; index: number }) {
  const image = project.media[0];

  return (
    <div className="rounded-media bg-ink-raised overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.4)]">
      <div
        aria-hidden
        className="flex items-center gap-2 border-b border-white/5 px-4 py-3"
        style={{ background: "#242019" }}
      >
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ff5f56" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#ffbd2e" }} />
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#27c93f" }} />
      </div>
      {image ? (
        <Image
          src={image.src}
          alt={`${project.title} interface screenshot`}
          width={image.width}
          height={image.height}
          sizes="900px"
          className="h-auto w-full"
        />
      ) : (
        <div
          className="flex aspect-[16/10] w-full items-center justify-center"
          style={{ background: markGradient(index) }}
        >
          <span className="font-display text-paper/20 text-[7rem] leading-none md:text-[9rem]">
            {initials(project.title)}
          </span>
        </div>
      )}
    </div>
  );
}
